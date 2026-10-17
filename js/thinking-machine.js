/**
 * THE INVENTOR'S DIMENSION — 3D HANGING LANYARD ID BADGE
 * Inspired by modern physical developer credentials & conference passes:
 * - Hanging woven lanyard strap & metallic clip/carabiner
 * - Acrylic badge holder with slot cutout
 * - Crisp dual-sided ID credential with high-res portrait, gold microchip & barcode
 * - Interactive 3D pendulum tilt & sway with holographic sheen
 * - Seamless on both Laptop (Desktop) and Mobile screens
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Falling back to static view.');
    return;
  }

  const canvas = document.getElementById('thinking-machine-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  const deck = canvas.closest('.hero-visual-deck') || container;

  let renderer, scene, camera;
  let lanyardGroup, cardAssembly;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let currentRot = { x: 0, y: 0, z: 0 };
  let animationFrameId;

  function init() {
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL init failed:', e);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, (container.clientWidth || 340) / (container.clientHeight || 480), 0.1, 100);
    camera.position.set(0, 0, 7.0);

    updateSize();

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyFrontLight = new THREE.DirectionalLight(0xffffff, 0.95);
    keyFrontLight.position.set(0, 1.5, 7.5);
    scene.add(keyFrontLight);

    const limeAccent = new THREE.DirectionalLight(0xd6fa77, 0.7);
    limeAccent.position.set(4, 5, 3);
    scene.add(limeAccent);

    const cyanAccent = new THREE.DirectionalLight(0x6ee7b7, 0.5);
    cyanAccent.position.set(-4, -3, -2);
    scene.add(cyanAccent);

    // =========================================================================
    // HANGING ID CARD ASSEMBLY (Pivoting from the lanyard clip at top)
    // =========================================================================
    lanyardGroup = new THREE.Group();
    // Anchor position
    lanyardGroup.position.set(0, 0.22, 0);
    scene.add(lanyardGroup);

    // 1. Lanyard Strap (Fabric woven ribbon coming down from top)
    const strapGeo = new THREE.PlaneGeometry(0.36, 3.4);
    const strapCanvas = document.createElement('canvas');
    strapCanvas.width = 128;
    strapCanvas.height = 512;
    const sCtx = strapCanvas.getContext('2d');
    if (sCtx) {
      // Dark navy/black strap matching the reel reference
      sCtx.fillStyle = '#111827';
      sCtx.fillRect(0, 0, 128, 512);
      // Dual pinstripes in tech lime
      sCtx.fillStyle = '#d6fa77';
      sCtx.fillRect(12, 0, 6, 512);
      sCtx.fillRect(110, 0, 6, 512);
      // Weave pattern texture
      sCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let y = 0; y < 512; y += 8) {
        sCtx.fillRect(0, y, 128, 4);
      }
    }
    const strapTex = new THREE.CanvasTexture(strapCanvas);
    const strapMat = new THREE.MeshStandardMaterial({
      map: strapTex,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    strapMesh.position.set(0, 3.25, -0.02);
    lanyardGroup.add(strapMesh);

    // 2. Metallic Badge Clip & Clear Vinyl Strap Loop
    const clipGroup = new THREE.Group();
    clipGroup.position.set(0, 1.85, 0);
    lanyardGroup.add(clipGroup);

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      metalness: 0.96,
      roughness: 0.14
    });

    // Ring connecting strap and swivel
    const ringGeo = new THREE.TorusGeometry(0.18, 0.038, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, chromeMat);
    ringMesh.rotation.y = Math.PI / 2;
    ringMesh.position.y = 0.22;
    clipGroup.add(ringMesh);

    // Main clip swivel barrel
    const barrelGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.26, 16);
    const barrelMesh = new THREE.Mesh(barrelGeo, chromeMat);
    barrelMesh.position.y = 0.05;
    clipGroup.add(barrelMesh);

    // Spring clamp jaw
    const claspGeo = new THREE.BoxGeometry(0.32, 0.30, 0.10);
    const claspMesh = new THREE.Mesh(claspGeo, chromeMat);
    claspMesh.position.set(0, -0.14, 0);
    clipGroup.add(claspMesh);

    // Clear vinyl strap tab going through the card's slot hole
    const tabGeo = new THREE.BoxGeometry(0.18, 0.36, 0.02);
    const tabMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1
    });
    const tabMesh = new THREE.Mesh(tabGeo, tabMat);
    tabMesh.position.set(0, -0.32, 0.01);
    clipGroup.add(tabMesh);

    // Metal rivet button on the clear vinyl tab
    const rivetGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16);
    const rivetMesh = new THREE.Mesh(rivetGeo, chromeMat);
    rivetMesh.rotation.x = Math.PI / 2;
    rivetMesh.position.set(0, -0.28, 0.015);
    clipGroup.add(rivetMesh);

    // 3. ID Card Body (Realistic PVC Badge)
    cardAssembly = new THREE.Group();
    cardAssembly.position.set(0, -0.22, 0);
    lanyardGroup.add(cardAssembly);

    const cardW = 2.45;
    const cardH = 3.80;
    const cardDepth = 0.036;

    const cardGeo = new THREE.BoxGeometry(cardW, cardH, cardDepth);

    const frontTex = createCardFrontTexture();
    const backTex = createCardBackTexture();

    // Crisp white PVC edge material
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.05,
      roughness: 0.35
    });
    const frontMat = new THREE.MeshBasicMaterial({
      map: frontTex
    });
    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      metalness: 0.04,
      roughness: 0.35
    });

    // BoxGeometry material mapping: [right, left, top, bottom, front (+Z), back (-Z)]
    const cardMaterials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat];
    const cardMesh = new THREE.Mesh(cardGeo, cardMaterials);
    cardAssembly.add(cardMesh);

    if (deck) {
      deck.classList.add('three-active');
    }

    setupEvents();
    animate(0);
  }

  // ===========================================================================
  // CANVAS TEXTURE GENERATOR FOR HIGH-DPI ID CARD (FRONT FACE)
  // Matching the reference developer badge: White PVC, dark header, crisp portrait
  // ===========================================================================
  function createCardFrontTexture() {
    const cw = 1024;
    const ch = 1580;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = cw;
    offCanvas.height = ch;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(offCanvas);

    function draw() {
      // 1. Crisp White PVC Base with subtle silver-white gradient & border
      const bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Subtle fine security guilloche watermark pattern
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.025)';
      ctx.lineWidth = 1;
      for (let i = -ch; i < cw + ch; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + ch, ch);
        ctx.stroke();
      }

      // Outer border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, cw - 24, ch - 24);

      // 2. Realistic punched slot hole at top center
      const slotW = 160;
      const slotH = 42;
      const slotX = (cw - slotW) / 2;
      const slotY = 32;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(slotX, slotY, slotW, slotH, 21);
      } else {
        ctx.rect(slotX, slotY, slotW, slotH);
      }
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 3. Dark Navy/Graphite Top Header Block (like the reference reel badge)
      const headerY = 96;
      const headerH = 82;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(36, headerY, cw - 72, headerH, 12);
      } else {
        ctx.rect(36, headerY, cw - 72, headerH);
      }
      ctx.fill();

      // Glowing active status indicator dot
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(68, headerY + 41, 10, 0, Math.PI * 2);
      ctx.fill();

      // Header title: "DEVELOPER ID"
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px "Manrope", sans-serif';
      ctx.fillText('DEVELOPER ID', 92, headerY + 52);

      // Top right badge code: "MECH · 2028"
      ctx.fillStyle = '#d6fa77';
      ctx.font = 'bold 24px "DM Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('MECH // 2028', cw - 56, headerY + 52);
      ctx.textAlign = 'left';

      // 4. Portrait Photo Frame & Sharan's Photo (Dominant, clean, centered)
      const photoX = 48;
      const photoY = 206;
      const photoW = cw - 96;
      const photoH = 770;

      // Photo frame background & border
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(photoX, photoY, photoW, photoH, 16);
      } else {
        ctx.rect(photoX, photoY, photoW, photoH);
      }
      ctx.fill();

      if (profileImageLoaded && profileImageObj) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(photoX, photoY, photoW, photoH, 16);
        } else {
          ctx.rect(photoX, photoY, photoW, photoH);
        }
        ctx.clip();

        // High-fidelity aspect ratio cover crop: preserves natural proportions without stretching
        const nw = profileImageObj.naturalWidth || profileImageObj.width || 1024;
        const nh = profileImageObj.naturalHeight || profileImageObj.height || 1024;
        const scale = Math.max(photoW / nw, photoH / nh);
        const sw = photoW / scale;
        const sh = photoH / scale;
        const sx = (nw - sw) / 2;
        const sy = Math.max(0, (nh - sh) * 0.12);
        ctx.drawImage(profileImageObj, sx, sy, sw, sh, photoX, photoY, photoW, photoH);

        ctx.restore();
      }

      // Crisp frame outline
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(photoX, photoY, photoW, photoH, 16);
      } else {
        ctx.rect(photoX, photoY, photoW, photoH);
      }
      ctx.stroke();

      // Security Gold Microchip on photo corner (like high-security pass)
      const chipX = photoX + photoW - 134;
      const chipY = photoY + 24;
      const chipW = 110;
      const chipH = 80;
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(chipX, chipY, chipW, chipH, 8);
      } else {
        ctx.rect(chipX, chipY, chipW, chipH);
      }
      ctx.fill();
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(chipX + 36, chipY); ctx.lineTo(chipX + 36, chipY + chipH);
      ctx.moveTo(chipX + 74, chipY); ctx.lineTo(chipX + 74, chipY + chipH);
      ctx.moveTo(chipX, chipY + 40); ctx.lineTo(chipX + chipW, chipY + 40);
      ctx.stroke();

      // 5. Name and Credentials (High contrast, bold typography like the reel)
      const nameY = 1055;
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 68px "Manrope", sans-serif';
      ctx.fillText('SHARAN M.', photoX, nameY);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 30px "DM Mono", monospace';
      ctx.fillText('B.E. MECHANICAL ENGINEERING', photoX, nameY + 48);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 26px "DM Mono", monospace';
      ctx.fillText('AI SYSTEMS & PARAMETRIC DESIGN', photoX, nameY + 92);

      ctx.fillStyle = '#64748b';
      ctx.font = '22px "DM Mono", monospace';
      ctx.fillText('DSCE · BENGALURU, INDIA', photoX, nameY + 130);

      // 6. Security Barcode & Holographic Verification Seal
      const footY = 1245;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(photoX, footY);
      ctx.lineTo(photoX + photoW, footY);
      ctx.stroke();

      // Clean dark barcode
      const barX = photoX;
      const barY = footY + 26;
      const barW = photoW - 170;
      const barH = 80;
      ctx.fillStyle = '#0f172a';
      const bars = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3];
      let bx = barX;
      for (let i = 0; i < bars.length && bx < barX + barW; i++) {
        const bw = bars[i] * 3.5;
        ctx.fillRect(bx, barY, bw, barH);
        bx += bw + (i % 2 === 0 ? 5 : 7);
      }

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px "DM Mono", monospace';
      ctx.fillText('ID: SM-849204-AI // SECURITY LEVEL 04', photoX, barY + barH + 34);

      // Holographic Badge Seal
      const sealX = photoX + photoW - 75;
      const sealY = barY + 45;
      const sGrad = ctx.createRadialGradient(sealX, sealY, 4, sealX, sealY, 56);
      sGrad.addColorStop(0, '#d6fa77');
      sGrad.addColorStop(0.4, '#6ee7b7');
      sGrad.addColorStop(0.7, '#60a5fa');
      sGrad.addColorStop(1, '#a855f7');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VERIFIED', sealX, sealY - 4);
      ctx.fillText('INVENTOR', sealX, sealY + 16);
      ctx.textAlign = 'left';

      texture.needsUpdate = true;
    }

    const texture = new THREE.CanvasTexture(offCanvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    if (THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      texture.encoding = THREE.sRGBEncoding;
    }

    let profileImageLoaded = false;
    const profileImageObj = new Image();
    profileImageObj.crossOrigin = 'anonymous';
    // Use fresh cache query string to guarantee newly replaced photo loads instantly
    profileImageObj.src = 'assets/sharan-profile.png?v=' + Date.now();
    profileImageObj.onload = () => {
      profileImageLoaded = true;
      draw();
      texture.needsUpdate = true;
    };

    draw();
    return texture;
  }

  // ===========================================================================
  // CANVAS TEXTURE GENERATOR FOR ID CARD BACK FACE
  // ===========================================================================
  function createCardBackTexture() {
    const cw = 1024;
    const ch = 1580;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = cw;
    offCanvas.height = ch;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(offCanvas);

    // Light PVC Card Back
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, cw, ch);

    // Magnetic Stripe
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 140, cw, 170);

    // Signature strip
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.fillRect(60, 390, cw - 120, 100);
    ctx.strokeRect(60, 390, cw - 120, 100);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic 34px cursive, sans-serif';
    ctx.fillText('Sharan M. // Verified Inventor', 100, 455);

    // Terms & Engineering Specifications
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 22px "DM Mono", monospace';
    ctx.fillText('OFFICIAL CREDENTIAL · SYSTEM ACCESS AUTHORIZED', 60, 560);
    ctx.fillText('DISCIPLINES: MECHANICAL CAD, ROS2, MULTIMODAL AI', 60, 600);
    ctx.fillText('RAG PIPELINES, THREE.JS WEBGL EXPERIENCES', 60, 640);
    ctx.fillText('ISSUED TO: SHARAN M · VALID: 2024 - 2028', 60, 680);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 760, cw - 120, 500);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "DM Mono", monospace';
    ctx.fillText('[SYSTEM_VERIFICATION_MATRIX]', 90, 810);

    ctx.fillStyle = '#334155';
    ctx.font = '20px "DM Mono", monospace';
    ctx.fillText('CORE: FULL-STACK AI & AUTONOMOUS AGENTS', 90, 860);
    ctx.fillText('ENCRYPTION: AES-256 DOCUMENT SECURITY', 90, 900);
    ctx.fillText('REPO: GITHUB.COM/SHARAN126', 90, 940);
    ctx.fillText('PORTFOLIO: SHARAN126.GITHUB.IO', 90, 980);

    const texture = new THREE.CanvasTexture(offCanvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    if (THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      texture.encoding = THREE.sRGBEncoding;
    }
    return texture;
  }

  // ===========================================================================
  // RESPONSIVE SIZE & CAMERA ADAPTATION
  // ===========================================================================
  function updateSize() {
    if (!renderer || !canvas) return;
    const width = container.clientWidth || deck.clientWidth || 340;
    const height = container.clientHeight || deck.clientHeight || 480;
    renderer.setSize(width, height, false);
    if (camera) {
      camera.aspect = width / height;
      if (width < 220) {
        // Compact mobile right slot
        camera.position.z = 7.1;
      } else if (width < 480) {
        camera.position.z = 7.2;
      } else if (width < 768) {
        camera.position.z = 7.0;
      } else {
        camera.position.z = 6.6;
      }
      camera.updateProjectionMatrix();
    }
  }

  // ===========================================================================
  // INTERACTIVE POINTER & TOUCH EVENTS
  // ===========================================================================
  function setupEvents() {
    window.addEventListener('resize', updateSize, { passive: true });

    let isInteracting = false;

    const pointerHandler = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);

      if (clientX === undefined) return;

      mouse.targetX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((clientY - rect.top) / rect.height) * 2 - 1);
    };

    const activeArea = deck || container;
    activeArea.addEventListener('mousemove', pointerHandler, { passive: true });
    activeArea.addEventListener('touchstart', pointerHandler, { passive: true });
    activeArea.addEventListener('touchmove', pointerHandler, { passive: true });

    activeArea.addEventListener('mouseenter', () => { isInteracting = true; });
    activeArea.addEventListener('mouseleave', () => {
      isInteracting = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          mouse.targetX = Math.max(-1, Math.min(1, e.gamma / 25));
          mouse.targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        }
      }, { passive: true });
    }
  }

  // ===========================================================================
  // ANIMATION LOOP WITH PENDULUM SWAY & SPRING DAMPING
  // ===========================================================================
  let lastTime = 0;
  function animate(time) {
    animationFrameId = requestAnimationFrame(animate);

    const delta = Math.min((time - lastTime) * 0.001, 0.05);
    lastTime = time;

    const t = time * 0.001;

    // Smooth lerp for mouse/touch tilt
    mouse.x += (mouse.targetX - mouse.x) * 0.07;
    mouse.y += (mouse.targetY - mouse.y) * 0.07;

    if (cardAssembly && lanyardGroup) {
      // Natural pendulum sway + interactive pointer tilt
      const ambientSwayY = Math.sin(t * 1.6) * 0.05;
      const ambientSwayX = Math.cos(t * 1.2) * 0.025;
      const ambientSwayZ = Math.sin(t * 1.4) * 0.035;

      const targetRotY = mouse.x * 0.44 + ambientSwayY;
      const targetRotX = -mouse.y * 0.32 + ambientSwayX;
      // Natural physical lean when dragged sideways
      const targetRotZ = -mouse.x * 0.14 + ambientSwayZ;

      currentRot.y += (targetRotY - currentRot.y) * 0.08;
      currentRot.x += (targetRotX - currentRot.x) * 0.08;
      currentRot.z += (targetRotZ - currentRot.z) * 0.08;

      cardAssembly.rotation.y = currentRot.y;
      cardAssembly.rotation.x = currentRot.x;
      cardAssembly.rotation.z = currentRot.z;

      // Slight vertical floating bob
      cardAssembly.position.y = -0.22 + Math.sin(t * 1.8) * 0.04;
    }

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
