(function initSylvaBackground() {
  const root = document.getElementById('root');
  if (!root) return;

  // Avoid duplicate mounting
  if (root.querySelector('.shader-frame')) return;

  const shaderFrame = document.createElement('div');
  shaderFrame.className = 'shader-frame';
  shaderFrame.setAttribute('aria-hidden', 'true');

  const frameWrap = document.createElement('div');
  frameWrap.className = 'threeui-background landing-page-frame';
  frameWrap.dataset.state = 'loading';

  const iframe = document.createElement('iframe');
  iframe.title = 'Sylva — Into the living world';
  // Use relative path for universal compatibility (localhost, GitHub Pages, subpaths)
  iframe.src = './landing-pages/inner-green-3d.html';
  iframe.sandbox = 'allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts';
  iframe.loading = 'eager';

  const BACKGROUND_STYLE_ID = 'threeui-background-presentation';

  function applyPresentation(frame) {
    try {
      const doc = frame.contentDocument;
      if (!doc) return;

      const existingStyle = doc.getElementById(BACKGROUND_STYLE_ID);
      if (existingStyle) existingStyle.remove();

      const canvas = doc.querySelector('#scene');
      if (!canvas) return;

      canvas.setAttribute('data-threeui-background-layer', '');
      canvas.setAttribute('data-threeui-background-fill', '');

      doc.documentElement.setAttribute('data-threeui-presentation', 'background');
      const styleEl = doc.createElement('style');
      styleEl.id = BACKGROUND_STYLE_ID;
      styleEl.textContent = `
        html[data-threeui-presentation="background"],
        html[data-threeui-presentation="background"] body {
          width: 100% !important;
          height: 100% !important;
          min-height: 100% !important;
          overflow: hidden !important;
        }
        html[data-threeui-presentation="background"] body * {
          visibility: hidden !important;
          pointer-events: none !important;
        }
        html[data-threeui-presentation="background"] [data-threeui-background-layer],
        html[data-threeui-presentation="background"] [data-threeui-background-layer] * {
          visibility: visible !important;
        }
        html[data-threeui-presentation="background"] [data-threeui-background-fill] {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: none !important;
          max-height: none !important;
          margin: 0 !important;
          transform: none !important;
        }
      `;
      doc.head.appendChild(styleEl);

      // Re-trigger layout after switching to full-frame presentation
      frame.contentWindow?.requestAnimationFrame(() => {
        frame.contentWindow?.dispatchEvent(new Event('resize'));
      });
    } catch (err) {
      console.warn('Could not apply ThreeUI background presentation:', err);
    }
  }

  iframe.addEventListener('load', () => {
    applyPresentation(iframe);
    frameWrap.dataset.state = 'ready';
  });

  frameWrap.appendChild(iframe);
  shaderFrame.appendChild(frameWrap);
  root.appendChild(shaderFrame);

  // Forward pointermove events so cursor movement drives 3D camera parallax & drifting pollen
  window.addEventListener('pointermove', (e) => {
    if (iframe.contentWindow) {
      try {
        iframe.contentWindow.dispatchEvent(new PointerEvent('pointermove', {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true
        }));
      } catch (_) {}
    }
  }, { passive: true });
})();
