"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {/*
        min-h-[100svh] is a layout-shift fix, not decoration.

        This shell is a client component: on a cold request Next streams the nav
        and the footer before the page's own content arrives. With nothing
        holding the middle open, the footer rendered at y=1127 on a 2560x1440
        screen and was shoved down the moment the content landed — measured
        CLS 0.217 on first (uncached) load, against Google's 0.1 budget. It
        reproduced roughly one load in three, because only the first request for
        a URL is cold; afterwards the CDN answers and there is nothing to see.

        Reserving a viewport of height means the footer starts below the fold
        and the arriving content fills space that was already there.
      */}
      <main className="flex-1 min-h-[100svh]">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
