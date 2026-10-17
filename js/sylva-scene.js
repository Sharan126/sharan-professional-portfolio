(function initSylvaBackground() {
  function mount() {
    const root = document.getElementById('root');
    if (!root) return;

    // Guarantee full-screen fixed backdrop via inline styles (immune to any cached CSS)
    root.style.cssText = 'position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; z-index:0 !important; pointer-events:none !important; overflow:hidden !important; margin:0 !important; padding:0 !important; border:none !important;';

    // Avoid duplicate mounting
    if (root.querySelector('.shader-frame')) return;

    const shaderFrame = document.createElement('div');
    shaderFrame.className = 'shader-frame';
    shaderFrame.setAttribute('aria-hidden', 'true');
    shaderFrame.style.cssText = 'position:absolute !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; overflow:hidden !important; pointer-events:none !important; border:none !important; margin:0 !important; padding:0 !important;';

    const frameWrap = document.createElement('div');
    frameWrap.className = 'threeui-background landing-page-frame';
    frameWrap.dataset.state = 'loading';
    frameWrap.style.cssText = 'position:absolute !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; background:transparent !important; pointer-events:none !important; border:none !important; margin:0 !important; padding:0 !important;';

    const iframe = document.createElement('iframe');
    iframe.title = 'Sylva — Into the living world';
    // Explicit full-frame styling removes default 300x150 iframe box & borders
    iframe.style.cssText = 'position:absolute !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; border:0 !important; outline:none !important; background:transparent !important; display:block !important; pointer-events:none !important; margin:0 !important; padding:0 !important;';
    iframe.loading = 'eager';
    // Robust path resolution across environments (localhost, root domains, and GitHub Pages repo subpaths)
    try {
      const loc = window.location;
      let dir = loc.pathname;
      if (!dir.endsWith('/')) {
        dir = dir.substring(0, dir.lastIndexOf('/') + 1) || '/';
      }
      iframe.src = new URL(`${dir}landing-pages/inner-green-3d.html`, loc.origin).href;
    } catch (_) {
      iframe.src = './landing-pages/inner-green-3d.html';
    }

    const BACKGROUND_STYLE_ID = 'threeui-background-presentation';

    function applyPresentation() {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return false;

        const canvas = doc.querySelector('#scene');
        if (!canvas) return false;

        canvas.setAttribute('data-threeui-background-layer', '');
        canvas.setAttribute('data-threeui-background-fill', '');

        doc.documentElement.setAttribute('data-threeui-presentation', 'background');

        let styleEl = doc.getElementById(BACKGROUND_STYLE_ID);
        if (!styleEl) {
          styleEl = doc.createElement('style');
          styleEl.id = BACKGROUND_STYLE_ID;
          doc.head.appendChild(styleEl);
        }

        styleEl.textContent = `
          html[data-threeui-presentation="background"],
          html[data-threeui-presentation="background"] body {
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            overflow: hidden !important;
            background: #383b34 !important;
            margin: 0 !important;
            padding: 0 !important;
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
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            transform: none !important;
            opacity: 1 !important;
            display: block !important;
          }
        `;

        iframe.contentWindow?.requestAnimationFrame(() => {
          iframe.contentWindow?.dispatchEvent(new Event('resize'));
        });

        frameWrap.dataset.state = 'ready';
        return true;
      } catch (err) {
        console.warn('ThreeUI presentation application notice:', err);
        return false;
      }
    }

    function initPresentation() {
      if (!applyPresentation()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (applyPresentation() || attempts > 30) {
            clearInterval(interval);
          }
        }, 100);
      }
    }

    iframe.addEventListener('load', initPresentation);

    frameWrap.appendChild(iframe);
    shaderFrame.appendChild(frameWrap);
    root.appendChild(shaderFrame);

    // If iframe already loaded from cache before event listener attached
    if (iframe.contentDocument?.readyState === 'complete') {
      initPresentation();
    }

    // Forward pointermove events so cursor parallax responds across the whole portfolio
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
