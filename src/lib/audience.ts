import { Resend } from "resend";
import { notifyTeam } from "@/lib/notify";

/**
 * The mailing list, after the database.
 *
 * ## Why Resend rather than a table
 *
 * The list existed as a `Newsletter` table whose only readers were an admin
 * export button and an unsubscribe route. Both are gone. Resend is already the
 * sending platform, so putting the list where the sender can see it removes the
 * step where an address is subscribed in one system and mailed from another —
 * which is how someone stays on a list after unsubscribing.
 *
 * ## Why unsubscribing marks rather than deletes
 *
 * `contacts.remove` would take the address off the list, and the next time that
 * person filled in a form they would be added straight back. `unsubscribed:
 * true` is a suppression: the address stays known and stays unmailed. That is
 * the difference between honouring an unsubscribe and forgetting one.
 *
 * ## Why an unconfigured audience is not an error
 *
 * `RESEND_AUDIENCE_ID` may not be set yet. The caller still has to put the
 * address somewhere durable, so `subscribe` falls back to the team inbox and
 * says which path it took. What it never does is report success when the
 * address landed nowhere.
 */

type Outcome = "audience" | "inbox";

function audienceId(): string | null {
  const v = (process.env.RESEND_AUDIENCE_ID ?? "").trim();
  return v || null;
}

/** Whether the list has a home. Exposed so a health check can see the fallback. */
export const AUDIENCE_CONFIGURED = () => audienceId() !== null;

/**
 * Add an address to the list.
 *
 * Throws if it can be recorded neither in the audience nor in the inbox. The
 * caller must let that throw reach the user.
 */
export async function subscribe(email: string, source: string): Promise<Outcome> {
  const id = audienceId();
  if (!id || !process.env.RESEND_API_KEY) {
    await notifyTeam("Newsletter sign-up", { Email: email, Source: source });
    return "inbox";
  }

  const res = await new Resend(process.env.RESEND_API_KEY).contacts.create({
    audienceId: id,
    email,
    unsubscribed: false,
  });
  // An address already on the list comes back as an error, and re-subscribing
  // is not a failure — the form should not tell someone their own address is a
  // problem. Anything else is a real failure and is allowed to throw.
  if (res.error && !/already exists/i.test(res.error.message)) {
    throw new Error(`Resend refused the contact: ${res.error.message}`);
  }
  return "audience";
}

/**
 * Suppress an address.
 *
 * Returns true when the suppression is recorded. Never throws: an unsubscribe
 * page that 500s is worse than one that tells the person to email us, and the
 * caller shows exactly that.
 */
export async function unsubscribeAddress(email: string): Promise<boolean> {
  const id = audienceId();
  if (!id || !process.env.RESEND_API_KEY) {
    try {
      await notifyTeam("Unsubscribe request", { Email: email, Action: "Remove from all mailings" });
      return true;
    } catch {
      return false;
    }
  }
  try {
    const res = await new Resend(process.env.RESEND_API_KEY).contacts.update({
      audienceId: id,
      email,
      unsubscribed: true,
    });
    // An address that was never on the list is already unsubscribed in every
    // sense the person cares about.
    if (res.error && !/not found/i.test(res.error.message)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Add an address to the list without any fallback and without throwing.
 *
 * For callers that are already sending their own notification and must not
 * trigger a second one — see src/app/api/leads/capture/route.ts. Returns
 * whether the list now holds the address.
 */
export async function addContactQuiet(email: string): Promise<boolean> {
  const id = audienceId();
  if (!id || !process.env.RESEND_API_KEY) return false;
  try {
    const res = await new Resend(process.env.RESEND_API_KEY).contacts.create({
      audienceId: id,
      email,
      unsubscribed: false,
    });
    return !res.error || /already exists/i.test(res.error.message);
  } catch {
    return false;
  }
}
