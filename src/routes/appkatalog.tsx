import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { launchPortableApp } from "@/actions/shell";
import logViewerAppIcon from "../../images/LogViewerApp.png";
import pdfLogo from "../../images/pdflogo.png";

const APPS = [
  {
    id: "saver-pdf-worker",
    name: "Saver PDF Worker",
    icon: pdfLogo,
    // iOS-inspired gradient: bright cyan to deep blue with subtle warmth
    gradient: "linear-gradient(135deg, #56CCF2 0%, #2F80ED 48%, #1E5EAD 100%)",
    accentShadow: "rgba(46, 128, 237, 0.4)",
  },
  {
    id: "machine-log-viewer",
    name: "Machine Log Viewer",
    icon: logViewerAppIcon,
    gradient: "linear-gradient(135deg, #34D399 0%, #10B981 42%, #064E3B 100%)",
    accentShadow: "rgba(16, 185, 129, 0.38)",
  },
] as const;

function AppCatalogPage() {
  const [launchingAppId, setLaunchingAppId] = useState<string | null>(null);

  const openApp = async (appId: (typeof APPS)[number]["id"]) => {
    setLaunchingAppId(appId);
    try {
      await launchPortableApp(appId);
      toast.success("App wird gestartet.");
    } catch {
      toast.error("App konnte nicht gestartet werden.");
    } finally {
      setLaunchingAppId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex animate-fade-up items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-3xl tracking-tight">
            Appkatalog
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            JOZI Apps direkt aus dem Control Center starten.
          </p>
        </div>
      </div>

      {/* iOS-style app grid */}
      <div
        className="grid animate-fade-up grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-x-6 gap-y-7 pt-1"
        style={{
          animationDelay: "80ms",
          maxWidth: "520px",
        }}
      >
        {APPS.map((appItem, i) => {
          const launching = launchingAppId === appItem.id;

          return (
            <button
              className="group tap-highlight-transparent flex min-w-0 animate-fade-up flex-col items-center gap-2 text-center outline-none"
              disabled={launching}
              key={appItem.id}
              onClick={() => openApp(appItem.id)}
              style={{
                animationDelay: `${80 + i * 45}ms`,
                WebkitTapHighlightColor: "transparent",
              }}
              type="button"
            >
              {/* iOS App Icon Container */}
              <div
                className="ios-app-icon relative"
                style={{
                  width: "80px",
                  height: "80px",
                  background: appItem.gradient,
                  borderRadius: "18px", // iOS squircle approximation
                  transform: launching ? "scale(0.92)" : "scale(1)",
                  transition: "all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1)",
                  willChange: "transform",
                  // Multi-layer iOS shadow system
                  boxShadow: `
                    0 1px 2px rgba(0, 0, 0, 0.06),
                    0 2px 6px rgba(0, 0, 0, 0.08),
                    0 8px 16px ${appItem.accentShadow},
                    0 12px 32px ${appItem.accentShadow.replace("0.4", "0.15")},
                    inset 0 0.5px 1px rgba(255, 255, 255, 0.3),
                    inset 0 -0.5px 1px rgba(0, 0, 0, 0.1)
                  `,
                }}
              >
                {/* iOS Glossy Overlay - Top Highlight */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    borderRadius: "18px",
                    background: `
                      radial-gradient(
                        circle at 30% 20%,
                        rgba(255, 255, 255, 0.6) 0%,
                        rgba(255, 255, 255, 0.2) 20%,
                        transparent 50%
                      ),
                      linear-gradient(
                        180deg,
                        rgba(255, 255, 255, 0.25) 0%,
                        rgba(255, 255, 255, 0.08) 40%,
                        transparent 60%
                      )
                    `,
                  }}
                />

                {/* App Icon Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    alt=""
                    className="relative z-10 object-contain"
                    height={52}
                    src={appItem.icon}
                    style={{
                      width: "52px",
                      height: "52px",
                      filter: launching
                        ? "brightness(0.9) saturate(0.8)"
                        : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))",
                      transition: "filter 0.15s ease-out",
                    }}
                    width={52}
                  />
                </div>

                {/* Bottom Inner Shadow for Depth */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    borderRadius: "18px",
                    boxShadow: "inset 0 -1px 2px rgba(0, 0, 0, 0.08)",
                  }}
                />
              </div>

              {/* iOS App Label */}
              <span
                className="line-clamp-2 flex min-h-[30px] max-w-[90px] items-center justify-center px-1 text-xs leading-tight"
                style={{
                  color: launching ? "var(--muted-foreground)" : undefined,
                  transition: "color 0.15s ease-out",
                }}
              >
                {launching ? "Öffnet..." : appItem.name}
              </span>

              {/* CSS for enhanced hover/active states */}
              <style>{`
                .ios-app-icon {
                  position: relative;
                }

                button:hover:not(:disabled) .ios-app-icon {
                  transform: scale(1.05) translateY(-2px);
                  filter: brightness(1.05);
                }

                button:active:not(:disabled) .ios-app-icon {
                  transform: scale(0.92);
                  filter: brightness(0.95);
                  transition-duration: 0.08s;
                }

                /* iOS spring animation on appearance */
                @keyframes ios-appear {
                  0% {
                    transform: scale(0.7);
                    opacity: 0;
                  }
                  50% {
                    transform: scale(1.05);
                  }
                  100% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }

                .animate-fade-up button .ios-app-icon {
                  animation: ios-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
                }
              `}</style>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/appkatalog")({
  component: AppCatalogPage,
});
