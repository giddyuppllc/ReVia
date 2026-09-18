import type { NewsPost } from "@/lib/news";
import { post as pcacJuly2026 } from "./pcac-july-2026";
import { post as whiteOakFiveStatements } from "./white-oak-five-statements";
import { post as readingACertificate } from "./reading-a-certificate";
import { post as noBuyButton } from "./no-buy-button";

/* ------------------------------------------------------------------ */
/*  The archive.                                                       */
/*                                                                     */
/*  Add a post by writing a module beside this one and listing it       */
/*  here. Each is validated at load: no sources, no stance, or a        */
/*  duplicate slug throws rather than shipping quietly.                 */
/* ------------------------------------------------------------------ */

export const POSTS: NewsPost[] = [
  noBuyButton,
  readingACertificate,
  whiteOakFiveStatements,
  pcacJuly2026,
];
