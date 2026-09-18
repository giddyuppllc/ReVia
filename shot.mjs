import { chromium } from "playwright";
const U = "https://revialife.vercel.app";
const OUT = "/private/tmp/claude-501/-Users-browne/5111d68d-e8a3-447c-9867-76ef64621e6c/scratchpad";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.addInitScript(() => {
  localStorage.setItem("revia-age-verified", "true");
  localStorage.setItem("revia-cookie-consent", "essential");
});
const p = await ctx.newPage();
for (const path of process.argv.slice(2)) {
  await p.goto(U + path, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(1300);
  const name = path === "/" ? "home" : path.replace(/\//g, "_").replace(/^_/, "");
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name);
}
await b.close();
