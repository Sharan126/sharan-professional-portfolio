import { useEffect } from "react";
import { LandingPageFrame } from "./shaders/landing-pages/LandingPageFrame";
import "@designcodeio/threeui/style.css";

export function Scene() {
  // Forward pointermove events from the parent document to the background iframe
  // so camera parallax and drifting pollen respond anywhere on the portfolio
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const iframe = document.querySelector<HTMLIFrameElement>(".shader-frame iframe");
      if (iframe?.contentWindow) {
        try {
          iframe.contentWindow.dispatchEvent(
            new PointerEvent("pointermove", {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,
            })
          );
        } catch (_) {}
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div className="shader-frame" aria-hidden="true">
      <LandingPageFrame
        backgroundCanvasSelector="#scene"
        title="Sylva — Into the living world"
        sourceUrl="/landing-pages/inner-green-3d.html"
      />
    </div>
  );
}

export default Scene;
