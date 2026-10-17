/**
 * THE THINKING MACHINE — UNIFIED 3D MECHANICAL RING & PORTRAIT
 * Custom Three.js Experience: Mechanical Engineering meets Generative AI.
 * The 3D rotating mechanical ring and Sharan M's profile portrait form a single
 * physically connected, gyroscopically precessing 3D assembly.
 */

(function () {
  'use strict';

  // Check if WebGL & Three.js are available
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Falling back to static view.');
    return;
  }

  const canvas = document.getElementById('thinking-machine-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  const deck = canvas.closest('.hero-visual-deck') || container;

  // Scene setup
  let renderer, scene, camera;
  let sculptureGroup, ringAssembly, mainRing, gearGroup, mountingGroup, portraitGroup;
  let orbitalRing, particleSystem;
  let pulseRings = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let animationFrameId;

  // Active Machine Mode: 03 // CREATION
  const CREATION_CONFIG = {
    speed: 0.016,
    ringExpansion: 1.0,
    particleSpread: 1.45,
    accentColor: 0xd6fa77
  };

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
    renderer.toneMappingExposure = 1.1;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, (container.clientWidth || 450) / (container.clientHeight || 520), 0.1, 100);
    camera.position.set(0, 0, 7.2);

    updateSize();

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key front light for portrait clarity
    const keyFrontLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyFrontLight.position.set(0, 1, 7);
    scene.add(keyFrontLight);

    // Lime accent directional light for specular highlights on metal
    const limeLight = new THREE.DirectionalLight(0xd6fa77, 1.6);
    limeLight.position.set(6, 8, 4);
    scene.add(limeLight);

    // Cyan rim light for dramatic edge depth
    const cyanLight = new THREE.DirectionalLight(0x6ee7b7, 1.2);
    cyanLight.position.set(-6, -4, -3);
    scene.add(cyanLight);

    // Root Group
    sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // =========================================================================
    // UNIFIED 3D ASSEMBLY: MECHANICAL RING + MOUNTING STRUTS + PORTRAIT FRAME
    // =========================================================================
    ringAssembly = new THREE.Group();
    sculptureGroup.add(ringAssembly);

    const ringRadius = 2.34;
    const ringTube = 0.07;
    const cardW = 2.30;
    const cardH = 2.808;
    const cardDepth = 0.12;

    // 1. The Main Outer Titanium Ring
    const ringGeo = new THREE.TorusGeometry(ringRadius, ringTube, 24, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x161e18,
      metalness: 0.9,
      roughness: 0.22
    });
    mainRing = new THREE.Mesh(ringGeo, ringMat);
    mainRing.userData = { name: 'MECHANICAL_GIMBAL_A: TITANIUM_TORQUE_RING' };
    ringAssembly.add(mainRing);

    // 1b. Concentric Lime Luminous Inner Rim
    const glowRimGeo = new THREE.TorusGeometry(ringRadius - 0.08, 0.012, 16, 120);
    const glowRimMat = new THREE.MeshBasicMaterial({
      color: 0xd6fa77,
      transparent: true,
      opacity: 0.65
    });
    const glowRim = new THREE.Mesh(glowRimGeo, glowRimMat);
    mainRing.add(glowRim);

    // 1c. Rotating Precision Gear Bezel (gears mounted along perimeter)
    gearGroup = new THREE.Group();
    const teethCount = 36;
    const toothGeo = new THREE.BoxGeometry(0.06, 0.18, 0.07);
    const toothMat = new THREE.MeshStandardMaterial({
      color: 0xd6fa77,
      metalness: 0.92,
      roughness: 0.18
    });
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeo, toothMat);
      tooth.position.set(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0);
      tooth.rotation.z = angle;
      gearGroup.add(tooth);
    }
    mainRing.add(gearGroup);

    // 2. The 3D Portrait Frame Assembly
    portraitGroup = new THREE.Group();
    ringAssembly.add(portraitGroup);

    // 2a. Machined Titanium Chassis (Solid backing with metallic bevels)
    const chassisGeo = new THREE.BoxGeometry(cardW + 0.08, cardH + 0.08, cardDepth);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x111713,
      metalness: 0.88,
      roughness: 0.26
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.z = -cardDepth / 2;
    portraitGroup.add(chassis);

    // 2b. Luminous Lime Beveled Edge Rim
    const rimEdgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(cardW + 0.08, cardH + 0.08, 0.01));
    const rimEdgeMat = new THREE.LineBasicMaterial({
      color: 0xd6fa77,
      transparent: true,
      opacity: 0.55
    });
    const rimEdges = new THREE.LineSegments(rimEdgeGeo, rimEdgeMat);
    rimEdges.position.z = 0.005;
    portraitGroup.add(rimEdges);

    // 2c. Photo & Nameplate Mesh (Loaded from high-res asset)
    const plateGeo = new THREE.PlaneGeometry(cardW, cardH);
    const textureLoader = new THREE.TextureLoader();
    
    // Create plate texture with immediate crisp loading
    const plateTexture = textureLoader.load(
      'assets/sharan-card-plate.png',
      function (tex) {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      },
      undefined,
      function (err) {
        // Fallback: draw dynamic canvas texture if needed
        createCanvasFallback(plateMat);
      }
    );

    const plateMat = new THREE.MeshStandardMaterial({
      map: plateTexture,
      metalness: 0.0,
      roughness: 0.85
    });
    const photoPlane = new THREE.Mesh(plateGeo, plateMat);
    photoPlane.position.z = 0.008;
    portraitGroup.add(photoPlane);

    // 2d. Four Precision Corner CNC Clamps with Lime Locking Pins
    const cornerPinMat = new THREE.MeshStandardMaterial({
      color: 0xd6fa77,
      metalness: 0.95,
      roughness: 0.15
    });
    const cornerOffsets = [
      [-cardW / 2 + 0.08, cardH / 2 - 0.08],
      [cardW / 2 - 0.08, cardH / 2 - 0.08],
      [-cardW / 2 + 0.08, -cardH / 2 + 0.08],
      [cardW / 2 - 0.08, -cardH / 2 + 0.08]
    ];
    cornerOffsets.forEach(([cx, cy]) => {
      const boltGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 8);
      const bolt = new THREE.Mesh(boltGeo, cornerPinMat);
      bolt.position.set(cx, cy, 0.012);
      bolt.rotation.x = Math.PI / 2;
      portraitGroup.add(bolt);
    });

    // 3. Four Mechanical CNC Mounting Brackets / Struts
    // Physically connects the 4 edges of the portrait frame to the surrounding ring
    mountingGroup = new THREE.Group();
    ringAssembly.add(mountingGroup);

    const strutMat = new THREE.MeshStandardMaterial({
      color: 0x1f2b22,
      metalness: 0.92,
      roughness: 0.2
    });
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xd6fa77,
      metalness: 0.95,
      roughness: 0.15
    });

    function createStrut(len, isHorizontal) {
      const g = new THREE.Group();
      const shaftGeo = new THREE.CylinderGeometry(0.042, 0.042, len, 16);
      const shaft = new THREE.Mesh(shaftGeo, strutMat);
      g.add(shaft);

      // Pivot collars at joints
      const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16);
      const pin1 = new THREE.Mesh(pinGeo, pinMat);
      pin1.position.y = len / 2;
      pin1.rotation.x = Math.PI / 2;
      g.add(pin1);

      const pin2 = new THREE.Mesh(pinGeo, pinMat);
      pin2.position.y = -len / 2;
      pin2.rotation.x = Math.PI / 2;
      g.add(pin2);

      if (isHorizontal) {
        g.rotation.z = Math.PI / 2;
      }
      return g;
    }

    // Left strut: from frame left to ring inner wall
    const hStrutLen = ringRadius - cardW / 2;
    const leftStrut = createStrut(hStrutLen, true);
    leftStrut.position.set(-cardW / 2 - hStrutLen / 2, 0, -cardDepth / 2);
    mountingGroup.add(leftStrut);

    // Right strut: from frame right to ring inner wall
    const rightStrut = createStrut(hStrutLen, true);
    rightStrut.position.set(cardW / 2 + hStrutLen / 2, 0, -cardDepth / 2);
    mountingGroup.add(rightStrut);

    // Top strut: from frame top to ring inner wall
    const vStrutLen = ringRadius - cardH / 2;
    const topStrut = createStrut(vStrutLen, false);
    topStrut.position.set(0, cardH / 2 + vStrutLen / 2, -cardDepth / 2);
    mountingGroup.add(topStrut);

    // Bottom strut: from frame bottom to ring inner wall
    const bottomStrut = createStrut(vStrutLen, false);
    bottomStrut.position.set(0, -cardH / 2 - vStrutLen / 2, -cardDepth / 2);
    mountingGroup.add(bottomStrut);

    // 4. Secondary Background Precision Calibrated Ring (stays strictly behind the assembly)
    const orbitalRingGeo = new THREE.TorusGeometry(2.82, 0.02, 16, 120);
    const orbitalRingMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      metalness: 0.85,
      roughness: 0.25
    });
    orbitalRing = new THREE.Mesh(orbitalRingGeo, orbitalRingMat);
    orbitalRing.position.z = -0.35;
    orbitalRing.userData = { name: 'GIMBAL_B: BACKGROUND_CALIBRATION_RING' };
    sculptureGroup.add(orbitalRing);

    // 5. Subtle Ambient Particle Swarm
    const particleCount = 42;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const basePositions = [];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.0 + Math.random() * 1.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions.push({ x, y, z, speed: 0.15 + Math.random() * 0.45 });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xd6fa77,
      size: 0.035,
      transparent: true,
      opacity: 0.45
    });
    particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.userData = { basePositions };
    sculptureGroup.add(particleSystem);

    // 6. Expanding Data Pulse Rings
    for (let i = 0; i < 2; i++) {
      const pGeo = new THREE.RingGeometry(0.5, 0.54, 48);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xd6fa77,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.rotation.x = Math.PI / 2;
      pMesh.userData = { progress: i * 0.5 };
      sculptureGroup.add(pMesh);
      pulseRings.push(pMesh);
    }

    // Mark visual deck as three-active (activates CSS rules)
    if (deck) {
      deck.classList.add('three-active');
    }

    // Attach Event Listeners
    setupEvents();

    // Start Animation Loop
    animate(0);
  }

  // Fallback 2D Canvas Generator (in case texture asset is delayed)
  function createCanvasFallback(material) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 1024;
    offCanvas.height = 1250;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0e130f';
    ctx.fillRect(0, 0, 1024, 1250);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'assets/sharan-profile.png';
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 1024, 1030);

      // Gradient transition to bottom text panel
      const grad = ctx.createLinearGradient(0, 860, 0, 1030);
      grad.addColorStop(0, 'rgba(14, 19, 15, 0)');
      grad.addColorStop(1, 'rgba(14, 19, 15, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 860, 1024, 170);

      ctx.fillStyle = '#0e130f';
      ctx.fillRect(0, 1030, 1024, 220);

      // Line
      ctx.strokeStyle = 'rgba(214, 250, 119, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(48, 1040);
      ctx.lineTo(976, 1040);
      ctx.stroke();

      // Typography
      ctx.fillStyle = '#f0f5ee';
      ctx.font = 'bold 44px Manrope, sans-serif';
      ctx.fillText('SHARAN M', 48, 1105);

      ctx.fillStyle = '#9aa89b';
      ctx.font = '24px "DM Mono", monospace';
      ctx.fillText('B.E. Mechanical Engineering · Karnataka, India', 48, 1165);

      const dynamicTexture = new THREE.CanvasTexture(offCanvas);
      dynamicTexture.generateMipmaps = true;
      dynamicTexture.minFilter = THREE.LinearMipmapLinearFilter;
      material.map = dynamicTexture;
      material.needsUpdate = true;
    };
  }

  function updateSize() {
    if (!renderer || !canvas) return;
    const width = container.clientWidth || deck.clientWidth || 450;
    const height = container.clientHeight || deck.clientHeight || 520;
    renderer.setSize(width, height, false);
    if (camera) {
      camera.aspect = width / height;
      // Responsive camera distance adjustments
      if (width < 480) {
        camera.position.z = 8.5;
      } else if (width < 768) {
        camera.position.z = 7.8;
      } else {
        camera.position.z = 7.2;
      }
      camera.updateProjectionMatrix();
    }
  }

  function setupEvents() {
    window.addEventListener('resize', updateSize, { passive: true });

    let isHovered = false;

    // Pointer move for smooth parallax
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

    activeArea.addEventListener('mouseenter', () => { isHovered = true; });
    activeArea.addEventListener('mouseleave', () => {
      isHovered = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    });

    // Scroll parallax
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const factor = Math.min(scrollY / heroHeight, 1.5);

      if (sculptureGroup) {
        sculptureGroup.position.y = -factor * 0.7;
      }
    }, { passive: true });
  }

  // Animation Loop
  let lastTime = 0;
  function animate(time) {
    animationFrameId = requestAnimationFrame(animate);

    const delta = (time - lastTime) * 0.001;
    lastTime = time;

    // Smooth lerp mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    const t = time * 0.001;
    const speedMult = CREATION_CONFIG.speed * 70; // normalized speed factor

    // =========================================================================
    // UNIFIED GIMBAL MOTION:
    // The Ring, Mounting Struts, and Portrait Frame rotate as ONE COHESIVE ASSEMBLY
    // Gentle, elegant gyroscopic precession keeps the portrait facing the viewer
    // while providing convincing 3D perspective and depth!
    // =========================================================================
    if (ringAssembly) {
      // Harmonic 3D Precession (Yaw, Pitch, Roll)
      const yawOsc = Math.sin(t * 0.85 * speedMult) * 0.26;    // ~15° yaw oscillation
      const pitchOsc = Math.cos(t * 0.65 * speedMult) * 0.13;  // ~7.5° pitch oscillation
      const rollOsc = Math.sin(t * 0.45 * speedMult) * 0.04;   // ~2.3° roll oscillation

      // Combined oscillation + interactive pointer tilt
      const targetRotY = yawOsc + mouse.x * 0.42;
      const targetRotX = pitchOsc - mouse.y * 0.32;
      const targetRotZ = rollOsc + mouse.x * 0.08;

      ringAssembly.rotation.y += (targetRotY - ringAssembly.rotation.y) * 0.08;
      ringAssembly.rotation.x += (targetRotX - ringAssembly.rotation.x) * 0.08;
      ringAssembly.rotation.z += (targetRotZ - ringAssembly.rotation.z) * 0.08;

      // Subtle mechanical floating elevation
      ringAssembly.position.y = Math.sin(t * 1.3) * 0.07;

      // Steady calibrated ring scale
      ringAssembly.scale.setScalar(CREATION_CONFIG.ringExpansion);
    }

    // Outer gear teeth revolve continuously around the main ring
    if (gearGroup) {
      gearGroup.rotation.z -= CREATION_CONFIG.speed * 0.8;
    }

    // Secondary background calibration ring rotates smoothly behind the assembly
    if (orbitalRing) {
      orbitalRing.rotation.z += CREATION_CONFIG.speed * 0.55;
    }

    // Animate Particles
    if (particleSystem) {
      const posAttr = particleSystem.geometry.attributes.position;
      const positions = posAttr.array;
      const basePos = particleSystem.userData.basePositions;
      const spread = CREATION_CONFIG.particleSpread;

      for (let i = 0; i < basePos.length; i++) {
        const bp = basePos[i];
        const pt = t * bp.speed;

        positions[i * 3] = bp.x * spread + Math.sin(pt) * 0.1;
        positions[i * 3 + 1] = bp.y * spread + Math.cos(pt) * 0.1;
        positions[i * 3 + 2] = bp.z * spread + Math.sin(pt * 1.2) * 0.1;
      }
      posAttr.needsUpdate = true;
    }

    // Pulse Rings animation
    pulseRings.forEach(ring => {
      ring.userData.progress += delta * 0.4;
      if (ring.userData.progress > 1) ring.userData.progress = 0;

      const p = ring.userData.progress;
      const scale = 0.5 + p * 4.2;
      ring.scale.set(scale, scale, scale);
      ring.material.opacity = Math.sin(p * Math.PI) * 0.3;
    });

    renderer.render(scene, camera);
  }

  // Self-start on DOM readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
