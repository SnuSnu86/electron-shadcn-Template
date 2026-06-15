import type React from "react";
import AppSidebar from "@/components/app-sidebar";
import Titlebar from "@/components/titlebar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Titlebar />
      <div className="relative flex min-h-0 flex-1">
        <AppSidebar />
        <main className="control-grid relative min-w-0 flex-1 overflow-y-auto">
          {/* Atmosphärischer Glow am oberen Rand */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-64"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--primary) 7%, transparent), transparent)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
