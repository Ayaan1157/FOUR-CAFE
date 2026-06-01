/*
  FOUR CAFE â€” Hyper-Realistic WebGL 3D Cinematic Engine (8K Studio Quality)
  - ACES Filmic Tone Mapping & sRGB Output Encoding
  - Clearcoat Glazed Ceramic Mug Material
  - Canvas-Generated Espresso Crema Swirls & Bubble Texture
  - Metallic Stone-Beige Gold Foil Logo Stamp
  - LatheGeometry spun at 128 segments for perfect curves
  - Parallax interactive tilt and scroll-timeline matrix
*/

document.addEventListener('DOMContentLoaded', () => {

  // Force scroll to top on every page load / reload
  window.scrollTo(0, 0);
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Global DOM Queries (Declared at top to prevent TDZ ReferenceErrors)
  const canvas3D = document.getElementById('canvas-3d');
  const heroSection = document.getElementById('hero');
  const roomCards = document.querySelectorAll('.room-card');
  const exclusivityItems = document.querySelectorAll('.exclusivity-item');
  const textGroups = document.querySelectorAll('.text-group');
  const memberCards = document.querySelectorAll('.member-card');

  // ==========================================
  // 1. DIPTYCH SPLIT-PANEL PRELOADER (ULTRA-FAST & ADAPTIVE)
  // ==========================================
  const preloader = document.getElementById('preloader');
  const loaderCounter = document.getElementById('loader-counter');

  // Phase 1: Slide image panels in immediately
  requestAnimationFrame(() => {
    if (preloader) preloader.classList.add('panels-in');
  });

  let progress = 0;
  let isPageLoaded = false;

  // Listen to window load event
  window.addEventListener('load', () => {
    isPageLoaded = true;
  });

  // Safe fallback if load event already fired
  if (document.readyState === 'complete') {
    isPageLoaded = true;
  }

  // Phase 2: Animate the percentage counter 0% → 100%
  const counterTimer = setInterval(() => {
    // Accelerate loading progress if page has loaded, otherwise run smooth and steady
    const increment = isPageLoaded ? 8 : 2;
    progress = Math.min(100, progress + increment);
    const pct = Math.round(progress);
    
    if (loaderCounter) {
      loaderCounter.textContent = `Configuring experience... ${pct}%`;
    }

    if (pct >= 100) {
      clearInterval(counterTimer);
      
      // Phase 3: Fast, premium exit transition
      setTimeout(() => {
        if (preloader) preloader.classList.add('panels-out');
        
        // Fade entire preloader after panels have exited
        setTimeout(() => {
          if (preloader) preloader.classList.add('fade-out');
        }, 550);
      }, 150); // Snappy 150ms hold
    }
  }, 20);





  // ==========================================
  // 2. WEBGL RENDERER & CINEMATIC FILMIC ENVIRONMENT
  // ==========================================
  if (!canvas3D) return;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas3D,
    antialias: true,
    alpha: true, // Transparent bg to overlay beautifully on page #0A0A0A
    powerPreference: "high-performance",
    preserveDrawingBuffer: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Cinematic Film Grading & Rendering Tokens (ACES Filmic & sRGB Color Precision)
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // Real-world cinema camera exposure
  renderer.toneMappingExposure = 1.15;
  renderer.outputEncoding = THREE.sRGBEncoding;       // Vibrant, deep realistic color gamut
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6.2); // Frame the 3D cup perfectly in viewport center

  // Resize handler
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });


  // ==========================================
  // 3. HYPER-REALISTIC STUDIO LIGHTING RIG
  // ==========================================

  // Generate a procedural HDR environment map for true reflections on glossy surfaces
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // Build a synthetic studio environment with gradient lighting
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(50, 64, 32);
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 1024;
  envCanvas.height = 512;
  const envCtx = envCanvas.getContext('2d');
  // Top-down gradient simulating a soft studio HDRI
  const envGrad = envCtx.createLinearGradient(0, 0, 0, 512);
  envGrad.addColorStop(0, '#8a8078');    // Warm ceiling
  envGrad.addColorStop(0.3, '#3d3832'); // Mid tone
  envGrad.addColorStop(0.5, '#1a1714'); // Horizon shadow
  envGrad.addColorStop(0.7, '#0d0b0a'); // Floor
  envGrad.addColorStop(1, '#050403');   // Deep floor
  envCtx.fillStyle = envGrad;
  envCtx.fillRect(0, 0, 1024, 512);
  // Add subtle highlight spots to simulate softboxes
  envCtx.fillStyle = 'rgba(255, 248, 240, 0.12)';
  envCtx.beginPath(); envCtx.arc(300, 120, 100, 0, Math.PI * 2); envCtx.fill();
  envCtx.fillStyle = 'rgba(184, 173, 154, 0.08)';
  envCtx.beginPath(); envCtx.arc(700, 160, 80, 0, Math.PI * 2); envCtx.fill();

  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  const envMat = new THREE.MeshBasicMaterial({ map: envTexture, side: THREE.BackSide });
  const envMesh = new THREE.Mesh(envGeo, envMat);
  envScene.add(envMesh);
  const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;
  pmremGenerator.dispose();

  // Ambient fill — very subtle, lets the env map do the heavy lifting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
  scene.add(ambientLight);

  // Key light — warm, dramatic, top-left (primary specular source)
  const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.2);
  keyLight.position.set(5, 8, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0003;
  scene.add(keyLight);

  // Rim backlight — cool stone-beige edge catch for silhouette separation
  const backlight = new THREE.DirectionalLight(0xb8ad9a, 1.8);
  backlight.position.set(-5, 4, -6);
  scene.add(backlight);

  // Subtle bottom bounce fill — simulates table reflection
  const uplight = new THREE.DirectionalLight(0x9e9589, 0.25);
  uplight.position.set(0, -5, 3);
  scene.add(uplight);

  // Tight top spot — highlights the liquid crema surface
  const spotLight = new THREE.SpotLight(0xffffff, 1.8, 18, Math.PI / 9, 0.6, 0.4);
  spotLight.position.set(1, 9, 3);
  scene.add(spotLight);


  // ==========================================
  // 4. HYPER-REALISTIC BLACK CERAMIC MUG
  // ==========================================
  const cupGroup = new THREE.Group();
  scene.add(cupGroup);

  // 4a. Glossy Black Ceramic — MeshPhysicalMaterial for true PBR realism
  const cupMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x000000,              // Pure absolute black
    roughness: 0.18,              // Glossy ceramic glaze — low roughness for sharp reflections
    metalness: 0.0,               // Ceramic is a dielectric, not metal
    clearcoat: 1.0,               // Full transparent glaze layer on top
    clearcoatRoughness: 0.08,     // Very smooth clearcoat for mirror-like highlights
    reflectivity: 0.9,            // High reflectivity for glossy black look
    ior: 1.52,                    // Glass/ceramic index of refraction
    envMap: envMap,
    envMapIntensity: 0.85,        // Strong environment reflections
    sheen: 0.15,                  // Subtle fabric-like sheen at grazing angles
    sheenRoughness: 0.3,
    sheenColor: new THREE.Color(0x1a1816), // Warm dark sheen tint
  });

  // 4b. Ultra-Smooth Lathe Profile (256 segments for zero polygon aliasing)
  const cupPoints = [];
  cupPoints.push(new THREE.Vector2(0, -1.35));      // Inner bottom center
  cupPoints.push(new THREE.Vector2(0.88, -1.28));    // Inner bottom corner (gentle curve)
  cupPoints.push(new THREE.Vector2(1.12, -0.2));     // Inner wall lower
  cupPoints.push(new THREE.Vector2(1.20, 0.5));      // Inner wall mid
  cupPoints.push(new THREE.Vector2(1.32, 1.3));      // Inner wall upper
  cupPoints.push(new THREE.Vector2(1.38, 1.42));     // Rim inner bevel
  cupPoints.push(new THREE.Vector2(1.44, 1.48));     // Rim top surface
  cupPoints.push(new THREE.Vector2(1.50, 1.48));     // Rim outer lip
  cupPoints.push(new THREE.Vector2(1.54, 1.42));     // Rim outer bevel
  cupPoints.push(new THREE.Vector2(1.50, 1.28));     // Outer wall top
  cupPoints.push(new THREE.Vector2(1.30, 0.5));      // Outer wall mid
  cupPoints.push(new THREE.Vector2(1.20, -0.2));     // Outer wall lower
  cupPoints.push(new THREE.Vector2(1.08, -1.05));    // Outer wall base taper
  cupPoints.push(new THREE.Vector2(1.02, -1.40));    // Base outer corner
  cupPoints.push(new THREE.Vector2(0.95, -1.50));    // Bottom ring foot outer
  cupPoints.push(new THREE.Vector2(0.88, -1.52));    // Bottom ring foot flat
  cupPoints.push(new THREE.Vector2(0.0, -1.52));     // Center bottom

  const cupGeometry = new THREE.LatheGeometry(cupPoints, 256);
  cupGeometry.computeVertexNormals();
  const cupBodyMesh = new THREE.Mesh(cupGeometry, cupMaterial);
  cupBodyMesh.castShadow = true;
  cupBodyMesh.receiveShadow = true;
  cupGroup.add(cupBodyMesh);

  // 4c. Inner Wall — slightly different material (matte satin interior)
  const innerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    roughness: 0.55,
    metalness: 0.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    envMap: envMap,
    envMapIntensity: 0.3,
  });
  const innerPoints = [];
  innerPoints.push(new THREE.Vector2(0, -1.20));
  innerPoints.push(new THREE.Vector2(0.82, -1.15));
  innerPoints.push(new THREE.Vector2(1.06, -0.2));
  innerPoints.push(new THREE.Vector2(1.14, 0.5));
  innerPoints.push(new THREE.Vector2(1.28, 1.28));
  innerPoints.push(new THREE.Vector2(1.34, 1.40));
  const innerGeometry = new THREE.LatheGeometry(innerPoints, 256);
  innerGeometry.computeVertexNormals();
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  innerMesh.castShadow = false;
  innerMesh.receiveShadow = true;
  cupGroup.add(innerMesh);

  // 4d. Elegant Curved Handle — thicker, more realistic
  const handleShape = new THREE.Shape();
  handleShape.moveTo(-0.09, -0.09);
  handleShape.lineTo(0.09, -0.09);
  handleShape.quadraticCurveTo(0.14, 0, 0.09, 0.09);
  handleShape.lineTo(-0.09, 0.09);
  handleShape.quadraticCurveTo(-0.14, 0, -0.09, -0.09);

  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.18, 0.9, 0),
    new THREE.Vector3(-1.65, 0.5, 0),
    new THREE.Vector3(-1.75, -0.1, 0),
    new THREE.Vector3(-1.60, -0.7, 0),
    new THREE.Vector3(-1.15, -0.95, 0),
  ]);

  const handleGeometry = new THREE.TubeGeometry(handleCurve, 64, 0.1, 24, false);
  const handleMesh = new THREE.Mesh(handleGeometry, cupMaterial);
  handleMesh.castShadow = true;
  cupGroup.add(handleMesh);

  // 4e. Dynamic Espresso Crema Swirls & Foam Texture Map
  const cremaCanvas = document.createElement('canvas');
  cremaCanvas.width = 1024;
  cremaCanvas.height = 1024;
  const cremaCtx = cremaCanvas.getContext('2d');
  
  // Base dark gradient espresso
  const cremaGrad = cremaCtx.createRadialGradient(512, 512, 10, 512, 512, 512);
  cremaGrad.addColorStop(0, '#6b4a30');    // Light brown hazelnut crema center
  cremaGrad.addColorStop(0.25, '#4a2d18');  // Rich gold-brown
  cremaGrad.addColorStop(0.6, '#2a1508');   // Dark roast body
  cremaGrad.addColorStop(0.85, '#190a04');  // Deep outer coffee
  cremaGrad.addColorStop(1, '#0c0401');     // Shadow cup rim border
  cremaCtx.fillStyle = cremaGrad;
  cremaCtx.fillRect(0, 0, 1024, 1024);

  // Render organic crema swirl structures
  cremaCtx.strokeStyle = 'rgba(164, 122, 88, 0.25)';
  cremaCtx.lineWidth = 16;
  cremaCtx.beginPath();
  cremaCtx.arc(512, 512, 180, 0.1 * Math.PI, 1.1 * Math.PI);
  cremaCtx.stroke();
  
  cremaCtx.strokeStyle = 'rgba(202, 163, 132, 0.18)';
  cremaCtx.lineWidth = 10;
  cremaCtx.beginPath();
  cremaCtx.arc(512, 512, 320, 0.5 * Math.PI, 1.6 * Math.PI);
  cremaCtx.stroke();

  cremaCtx.strokeStyle = 'rgba(180, 140, 110, 0.12)';
  cremaCtx.lineWidth = 6;
  cremaCtx.beginPath();
  cremaCtx.arc(480, 530, 260, 1.2 * Math.PI, 2.1 * Math.PI);
  cremaCtx.stroke();

  // Micro-bubbles — fresh brew froth
  cremaCtx.fillStyle = 'rgba(224, 192, 168, 0.22)';
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 360;
    const rx = 512 + Math.cos(angle) * distance;
    const ry = 512 + Math.sin(angle) * distance;
    const size = 1 + Math.random() * 4.5;
    cremaCtx.beginPath();
    cremaCtx.arc(rx, ry, size, 0, Math.PI * 2);
    cremaCtx.fill();
  }

  const cremaTexture = new THREE.CanvasTexture(cremaCanvas);
  cremaTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  // Liquid surface inside mug — ultra-gloss mirror
  const liquidGeometry = new THREE.CylinderGeometry(1.26, 1.12, 0.04, 256);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    map: cremaTexture,
    roughness: 0.01,               // Near-perfect mirror liquid
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 1.33,                     // Water/coffee IOR
    envMap: envMap,
    envMapIntensity: 0.6,
  });
  const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquidMesh.position.set(0, 1.22, 0);
  cupGroup.add(liquidMesh);

  // 4f. 8K Sharp CanvasTexture Branding (Metallic Stone-Beige Gold Foil Stamp)
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 2048;
  logoCanvas.height = 2048;
  const ctx = logoCanvas.getContext('2d');
  
  ctx.clearRect(0, 0, 2048, 2048);
  ctx.fillStyle = '#B8AD9A'; // Brand stone beige base
  
  // Montserrat-styled vector lettering drawn with 8K subpixel accuracy
  ctx.font = '500 480px Montserrat, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('4', 760, 1040);
  
  // Four parallel lines
  const lineW = 420;
  const lineH = 30;
  const lineGap = 40;
  const startY = 740;
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(820, startY + i * (lineH + lineGap), lineW, lineH);
  }
  
  ctx.font = '500 480px Montserrat, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('UR', 1320, 1040);
  
  ctx.font = '300 140px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('C  A  F  E', 1024, 1300);

  const logoTexture = new THREE.CanvasTexture(logoCanvas);
  logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  // Cylindrical wrap segment snug to cup body
  const logoGeometry = new THREE.CylinderGeometry(1.518, 1.242, 1.2, 64, 1, true, -Math.PI / 6, Math.PI / 3);
  
  // Metallic stone-beige gold foil material
  const logoMaterial = new THREE.MeshPhysicalMaterial({
    map: logoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.12,       // Polished foil
    metalness: 0.92,       // Very metallic gold stamp
    color: 0xffffff,
    envMap: envMap,
    envMapIntensity: 0.5,
  });
  
  const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
  logoMesh.position.set(0, -0.05, 0.015);
  cupGroup.add(logoMesh);


  // ==========================================
  // 5. WEBGL SCROLL KEYFRAME INTERPOLATION TIMELINE
  // ==========================================
  let targetProgress = 0;
  let currentProgress = 0;
  let lastProgress = -1;
  const videoLerpSpeed = 0.05; // Butter-smooth cinematic scrolling inertia

  // Map progress indices to target 3D positions & rotations (Apple/Oryzo.ai style)
  const keyframes = [
    { progress: 0.0,  x: 0.0,  y: -0.2, z: 0.0,  rx: 0.25, ry: 0.0,  rz: 0.0 },  // Center facing
    { progress: 0.2,  x: 1.65, y: 0.0,  z: 0.0,  rx: 0.1,  ry: -1.2, rz: 0.05 }, // Slide right, handle left
    { progress: 0.4,  x: -1.65,y: 0.1,  z: 0.0,  rx: 0.35, ry: 1.25, rz: -0.05 },// Slide left, handle right
    { progress: 0.6,  x: 1.5,  y: 0.4,  z: 0.2,  rx: 1.35, ry: -2.3, rz: 0.35 }, // Tilting heavily, pouring liquid!
    { progress: 0.8,  x: -1.5, y: -0.3, z: 0.0,  rx: -0.3, ry: 3.2,  rz: -0.25 },// Zoom out, reverse profile
    { progress: 1.0,  x: 0.0,  y: -0.1, z: 1.2,  rx: 0.15, ry: 6.28, rz: 0.0 }   // Zoom close, center final upright
  ];

  function interpolateTimeline(progress) {
    const p = Math.max(0, Math.min(1, progress));
    
    let k1 = keyframes[0];
    let k2 = keyframes[keyframes.length - 1];
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (p >= keyframes[i].progress && p <= keyframes[i + 1].progress) {
        k1 = keyframes[i];
        k2 = keyframes[i + 1];
        break;
      }
    }
    
    const range = k2.progress - k1.progress;
    const t = range > 0 ? (p - k1.progress) / range : 0;
    
    // Smooth cosine transition multiplier (Butter-smooth ease-in-out)
    const tSmooth = (1 - Math.cos(t * Math.PI)) / 2;

    return {
      x: k1.x + (k2.x - k1.x) * tSmooth,
      y: k1.y + (k2.y - k1.y) * tSmooth,
      z: k1.z + (k2.z - k1.z) * tSmooth,
      rx: k1.rx + (k2.rx - k1.rx) * tSmooth,
      ry: k1.ry + (k2.ry - k1.ry) * tSmooth,
      rz: k1.rz + (k2.rz - k1.rz) * tSmooth
    };
  }

  // Caching offset measurements to completely eliminate forced layouts (Layout Thrashing)
  let roomCardOffsets = [];
  let exclusivityItemOffsets = [];

  function cacheScrollPositions() {
    roomCardOffsets = [];
    roomCards.forEach(card => {
      let top = 0;
      let el = card;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      roomCardOffsets.push({
        offsetTop: top,
        height: card.offsetHeight
      });
    });

    exclusivityItemOffsets = [];
    exclusivityItems.forEach(item => {
      let top = 0;
      let el = item;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      exclusivityItemOffsets.push({
        offsetTop: top,
        height: item.offsetHeight
      });
    });
  }

  // Scroll listener driving progress from 0 to 1 mapped to the section's scroll range
  window.addEventListener('scroll', () => {
    if (!heroSection) return;
    
    const sectionTop = heroSection.offsetTop;
    const sectionHeight = heroSection.offsetHeight;
    const scrollRange = sectionHeight - window.innerHeight;
    
    const relativeScroll = window.scrollY - sectionTop;
    let progress = 0;
    if (scrollRange > 0) {
      progress = Math.max(0, Math.min(1, relativeScroll / scrollRange));
    }
    
    if (isNaN(progress)) progress = 0;
    targetProgress = progress;
  }, { passive: true });

  // Initial and reactive caching triggers
  window.addEventListener('load', () => {
    cacheScrollPositions();
    updateRoomCardStacking();
    updateExclusivityIllumination();
  });
  window.addEventListener('resize', () => {
    cacheScrollPositions();
    updateRoomCardStacking();
    updateExclusivityIllumination();
  });
  // Safely recalculate offsets after 1s in case fonts or lazy images shifted layout
  setTimeout(cacheScrollPositions, 1000);

  // Update dynamic staggered text overlays based on progress
  function updateTextOverlays(progress) {
    if (isNaN(progress)) progress = 0;
    textGroups.forEach(group => {
      const rangeAttr = group.getAttribute('data-range');
      if (!rangeAttr) return;
      
      const [min, max] = rangeAttr.split(',').map(Number);
      
      if (progress >= min && progress <= max) {
        if (!group.classList.contains('active')) {
          group.classList.remove('exit-up');
          group.classList.add('active');
          
          const lines = group.querySelectorAll('.headline-large, .pull-quote');
          lines.forEach((line, idx) => {
            line.style.transitionDelay = `${idx * 0.15}s`;
          });
        }
      } else if (progress > max) {
        if (group.classList.contains('active')) {
          group.classList.remove('active');
          group.classList.add('exit-up');
          
          const lines = group.querySelectorAll('.headline-large, .pull-quote');
          lines.forEach(line => {
            line.style.transitionDelay = '0s';
          });
        }
      } else {
        group.classList.remove('active', 'exit-up');
        const lines = group.querySelectorAll('.headline-large, .pull-quote');
        lines.forEach(line => {
          line.style.transitionDelay = '0s';
        });
      }
    });
  }


  // ==========================================
  // 6. THE ROOMS: 3D STACKING DEPTH ENGINE
  // ==========================================
  function updateRoomCardStacking() {
    if (!roomCards.length || !roomCardOffsets.length) return;
    
    const isMobile = window.innerWidth <= 768;
    const stickyTop = isMobile ? 15 : 20; // Matches CSS top: 20px / 15px
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    roomCards.forEach((card, index) => {
      const cached = roomCardOffsets[index];
      if (!cached) return;
      
      // Calculate top relative to viewport without DOM query
      const cardTop = Math.max(stickyTop, cached.offsetTop - scrollY);
      
      if (cardTop <= stickyTop + 2) {
        // Track the next card to calculate how much it has overlapped the current card
        const nextCached = roomCardOffsets[index + 1];
        if (nextCached) {
          const nextCardTop = nextCached.offsetTop - scrollY;
          const distance = nextCardTop - stickyTop;
          
          // Dynamic scroll range until next card is fully stacked (100vh + gap of 48vh / 30vh)
          const overlapRange = viewportHeight + viewportHeight * (isMobile ? 0.3 : 0.48); 
          const progress = Math.max(0, Math.min(1, 1 - (distance / overlapRange)));
          
          // Dynamic editorial deck-stacking parameters
          const scale = 1 - (progress * 0.05); // Gently scale down to 0.95
          const brightness = 1 - (progress * 0.45); // Darken down to 0.55
          const translateY = -progress * 20; // Subtle lift
          
          card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          card.style.filter = `brightness(${brightness})`;
        } else {
          card.style.transform = 'scale(1) translateY(0)';
          card.style.filter = 'brightness(1)';
        }
      } else {
        card.style.transform = 'scale(1) translateY(0)';
        card.style.filter = 'brightness(1)';
      }
    });
  }


  // ==========================================
  // 7. EXCLUSIVITY LIST: SCROLL ILLUMINATION
  // ==========================================

  function updateExclusivityIllumination() {
    if (!exclusivityItems.length || !exclusivityItemOffsets.length) return;
    
    const scrollY = window.scrollY;
    const viewportCenter = window.innerHeight * 0.65;
    
    exclusivityItems.forEach((item, index) => {
      const cached = exclusivityItemOffsets[index];
      if (!cached) return;
      
      const rectTop = cached.offsetTop - scrollY;
      const elementCenter = rectTop + cached.height / 2;
      
      if (elementCenter < viewportCenter) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }


  // ==========================================
  // 8. MEMBERSHIP TIERS: GLARE REFLECTION
  // ==========================================
  memberCards.forEach(card => {
    const glare = card.querySelector('.card-tier-glare');
    if (!glare) return;
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glare.style.transform = `translate3d(${x - rect.width}px, ${y - rect.height}px, 0)`;
    });
  });


  // ==========================================
  // 9. CLOSING SCREEN WORD-BY-WORD REVEAL
  // ==========================================
  const closingSection = document.getElementById('closing');
  const closingLogo = closingSection?.querySelector('.logo-closing');
  const closingTagline = document.getElementById('closing-tagline');
  const closingCredits = closingSection?.querySelector('.closing-credits');
  
  let taglineRevealed = false;
  const rawTagline = "It is a world people want to belong to.";
  if (closingTagline) {
    closingTagline.innerHTML = rawTagline
      .split(' ')
      .map(word => `<span class="word">${word}</span>`)
      .join(' ');
  }

  const closingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !taglineRevealed) {
        taglineRevealed = true;
        
        if (closingLogo) {
          closingLogo.classList.add('reveal');
        }

        const words = closingTagline?.querySelectorAll('.word');
        if (words) {
          words.forEach((word, idx) => {
            setTimeout(() => {
              word.classList.add('reveal');
            }, 600 + (idx * 160));
          });
        }

        if (closingCredits) {
          closingCredits.classList.add('reveal');
        }
      }
    });
  }, { threshold: 0.25 });

  if (closingSection) {
    closingObserver.observe(closingSection);
  }


  // ==========================================
  // 10. DIFFERENCE CUSTOM CURSOR SYSTEM
  // ==========================================
  const cursor = document.getElementById('custom-cursor');
  
  let cursorX = 0, cursorY = 0;
  let targetCursorX = 0, targetCursorY = 0;
  const cursorLerpSpeed = 0.16;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice && cursor) {
    cursor.style.display = 'none';
  } else if (cursor) {
    
    window.addEventListener('mousemove', (e) => {
      targetCursorX = e.clientX;
      targetCursorY = e.clientY;
    });

    const updateInteractives = () => {
      const interactives = document.querySelectorAll('.interactive');
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', expandCursor);
        el.removeEventListener('mouseleave', shrinkCursor);
        el.addEventListener('mouseenter', expandCursor);
        el.addEventListener('mouseleave', shrinkCursor);
      });
    };

    function expandCursor() {
      cursor.classList.add('expanded');
    }

    function shrinkCursor() {
      cursor.classList.remove('expanded');
    }

    updateInteractives();
    setInterval(updateInteractives, 2000);
  }


  // ==========================================
  // 11. HIGH-PERFORMANCE WEBGL 60FPS CENTRAL LOOP
  // ==========================================
  let currentX = 0, currentY = 0, currentZ = 0;
  let currentRx = 0, currentRy = 0, currentRz = 0;
  let lastScrollY = -1;

  function tick() {
    // NaN protections
    if (isNaN(targetProgress)) targetProgress = 0;
    if (isNaN(currentProgress)) currentProgress = 0;
    
    // 11a. Lerp progress values (Butter smooth)
    currentProgress += (targetProgress - currentProgress) * videoLerpSpeed;
    if (Math.abs(targetProgress - currentProgress) < 0.0001) {
      currentProgress = targetProgress;
    }
    if (isNaN(currentProgress)) currentProgress = 0;
    
    // ONLY update dynamic DOM text overlays if progress has actually changed to save massive layout thrashes
    if (currentProgress !== lastProgress) {
      updateTextOverlays(currentProgress);
      lastProgress = currentProgress;
    }

    // High-performance scroll tracking (Run layout updates exactly once per frame, only on scroll change)
    const scrollY = window.scrollY;
    if (scrollY !== lastScrollY) {
      updateRoomCardStacking();
      updateExclusivityIllumination();
      lastScrollY = scrollY;
    }

    // 11b. Evaluate timeline values
    const cupTimeline = interpolateTimeline(currentProgress);

    // Dynamic weightless floating drift (Out-of-sync multi-frequency sine waves)
    const time = performance.now() * 0.0016;
    const hoverDriftY = Math.sin(time) * 0.15;
    const hoverDriftX = Math.cos(time * 0.85) * 0.1;
    const hoverRotY = Math.sin(time * 0.5) * 0.05;

    // Dynamic mouse parallax inertia tilt (Smooth, reactive)
    const mouseTiltX = (targetCursorY / window.innerHeight - 0.5) * 0.28;
    const mouseTiltY = (targetCursorX / window.innerWidth - 0.5) * 0.28;

    // Lerp coordinates toward targets to prevent any jarring snap jumps (Ultra-smooth 0.045 factor)
    const lerpSpeed = 0.045;
    currentX += (cupTimeline.x - currentX) * lerpSpeed;
    currentY += (cupTimeline.y - currentY) * lerpSpeed;
    currentZ += (cupTimeline.z - currentZ) * lerpSpeed;
    
    currentRx += (cupTimeline.rx - currentRx) * lerpSpeed;
    currentRy += (cupTimeline.ry - currentRy) * lerpSpeed;
    currentRz += (cupTimeline.rz - currentRz) * lerpSpeed;

    // Apply translations and rotations (Combine Scroll Matrix + Parallax + Floating Drift)
    cupGroup.position.x = currentX + hoverDriftX + mouseTiltY;
    cupGroup.position.y = currentY + hoverDriftY - mouseTiltX;
    cupGroup.position.z = currentZ;

    cupGroup.rotation.x = currentRx + mouseTiltX * 0.45;
    cupGroup.rotation.y = currentRy + hoverRotY + mouseTiltY * 0.45;
    cupGroup.rotation.z = currentRz;

    // 11d. Lerp Custom Cursor (Hardware-Accelerated 3D Transform - no layout reflows!)
    if (cursor && !isTouchDevice) {
      cursorX += (targetCursorX - cursorX) * cursorLerpSpeed;
      cursorY += (targetCursorY - cursorY) * cursorLerpSpeed;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }

    // 11f. Render WebGL frame
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);


  // ==========================================================================
  // 12. PRIVATE MEMBERS & SEAT RESERVATION SYSTEM ENGINE
  // ==========================================================================
  
  // A. Toast Notifications System
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    // Trigger GPU-accelerated enter animation
    requestAnimationFrame(() => toast.classList.add('reveal'));
    
    // Auto dismissal
    setTimeout(() => {
      toast.classList.remove('reveal');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // B. State Management Variables
  let currentUser = JSON.parse(localStorage.getItem('four_cafe_user')) || null;
  let selectedChamber = 1;
  let selectedTimeSlot = '';

  const portalOverlay = document.getElementById('portal-overlay');
  const portalClose = document.getElementById('portal-close');
  
  const viewAuth = document.getElementById('portal-view-auth');
  const viewBooking = document.getElementById('portal-view-booking');
  const viewDashboard = document.getElementById('portal-view-dashboard');

  const tabLogin = document.getElementById('btn-tab-login');
  const tabSignup = document.getElementById('btn-tab-signup');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');

  // C. Visual QR Code Procedural Generator (8K Canvas Vector feel)
  function drawSimulatedQRCode(canvas, text) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 120;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 120, 120);
    
    ctx.fillStyle = '#0A0A0A';
    // Top-Left corner marker
    ctx.fillRect(8, 8, 28, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 12, 20, 20);
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(16, 16, 12, 12);
    
    // Top-Right corner marker
    ctx.fillRect(84, 8, 28, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(88, 12, 20, 20);
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(92, 16, 12, 12);
    
    // Bottom-Left corner marker
    ctx.fillRect(8, 84, 28, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 88, 20, 20);
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(16, 92, 12, 12);
    
    // Draw some random gold-beige accent data blocks in the middle
    ctx.fillStyle = '#B8AD9A';
    for (let x = 40; x < 80; x += 6) {
      for (let y = 40; y < 80; y += 6) {
        if (Math.random() > 0.4) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
    
    // Draw standard dark data blocks elsewhere
    ctx.fillStyle = '#0A0A0A';
    for (let x = 8; x < 112; x += 6) {
      for (let y = 8; y < 112; y += 6) {
        // Skip marker bounds
        if (x < 40 && y < 40) continue;
        if (x > 80 && y < 40) continue;
        if (x < 40 && y > 80) continue;
        // Skip center accent blocks
        if (x >= 40 && x < 80 && y >= 40 && y < 80) continue;
        
        if (Math.random() > 0.5) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  }

  // D. Staggered Dashboard Render
  const chambers = {
    1: 'The Quiet Room',
    2: 'The Cinematic Room',
    3: 'The Hidden Room',
    4: 'The Social Room'
  };

  function renderDashboard() {
    if (!currentUser) return;
    
    // Update Profile metadata
    const welcomeText = document.getElementById('dash-welcome');
    const memberIdText = document.getElementById('dash-member-id');
    const badgeTier = document.getElementById('dash-badge-tier');
    const bookingsList = document.getElementById('bookings-list');

    if (welcomeText) welcomeText.textContent = `Welcome, ${currentUser.name}`;
    if (memberIdText) memberIdText.textContent = `MEMBER ID: ${currentUser.email.split('@')[0].toUpperCase()}-${currentUser.phone || '9045'}`;
    if (badgeTier) {
      badgeTier.textContent = currentUser.tier || 'Tier I';
      // Invert badges based on tiers for premium look
      badgeTier.className = `user-badge-tier tier-${(currentUser.tier || 'Tier I').replace(' ', '-').toLowerCase()}`;
    }

    if (!bookingsList) return;
    bookingsList.innerHTML = '';

    const userBookings = currentUser.bookings || [];

    if (userBookings.length === 0) {
      bookingsList.innerHTML = `
        <div class="dash-empty-state">
          <span>You have no active seat reservations in the universe.</span>
          <button id="btn-empty-book" class="interactive">Secure a Seat Now</button>
        </div>
      `;
      
      const btnEmptyBook = document.getElementById('btn-empty-book');
      if (btnEmptyBook) {
        btnEmptyBook.addEventListener('click', () => {
          showView('booking');
        });
      }
      return;
    }

    // Render active reservations list
    userBookings.forEach((booking, idx) => {
      const ticket = document.createElement('div');
      ticket.className = 'holographic-ticket interactive';
      ticket.style.animationDelay = `${idx * 0.1}s`;
      
      ticket.innerHTML = `
        <div class="ticket-details">
          <div class="ticket-header">
            <span class="ticket-label">// EXCLUSIVE CHAMBER PASS</span>
            <span class="ticket-chamber-title">${chambers[booking.chamber] || 'Chamber Vault'}</span>
          </div>
          <div class="ticket-grid">
            <div class="ticket-meta-item">
              <span class="ticket-label">DATE</span>
              <span class="ticket-meta-val">${booking.date}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-label">TIME SLOT</span>
              <span class="ticket-meta-val">${booking.time}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-label">GUESTS</span>
              <span class="ticket-meta-val">${booking.guests} Seat${booking.guests > 1 ? 's' : ''}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-label">BOOKING ID</span>
              <span class="ticket-meta-val">${booking.id}</span>
            </div>
          </div>
          <button class="btn-ticket-cancel interactive" data-id="${booking.id}">Cancel Reservation</button>
        </div>
        <div class="ticket-qr-container">
          <canvas class="qr-canvas"></canvas>
          <span class="ticket-pass-id">${booking.passId}</span>
        </div>
      `;

      bookingsList.appendChild(ticket);

      // Render custom canvas QR Code immediately
      const qrCanvas = ticket.querySelector('.qr-canvas');
      drawSimulatedQRCode(qrCanvas, booking.id);

      // Setup Cancel Action handler
      const cancelBtn = ticket.querySelector('.btn-ticket-cancel');
      cancelBtn.addEventListener('click', () => {
        currentUser.bookings = currentUser.bookings.filter(b => b.id !== booking.id);
        
        // Update user state in localStorage database
        localStorage.setItem('user_' + currentUser.email, JSON.stringify(currentUser));
        localStorage.setItem('four_cafe_user', JSON.stringify(currentUser));
        
        showToast('Reservation successfully canceled', 'error');
        renderDashboard();
      });
    });
  }

  // E. View Switcher controller
  function showView(viewName) {
    viewAuth.classList.remove('active');
    viewBooking.classList.remove('active');
    viewDashboard.classList.remove('active');

    if (viewName === 'auth') {
      viewAuth.classList.add('active');
    } else if (viewName === 'booking') {
      viewBooking.classList.add('active');
      
      // Auto pre-populate date picker to tomorrow for user comfort
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const bookingDateInput = document.getElementById('booking-date');
      if (bookingDateInput && !bookingDateInput.value) {
        bookingDateInput.value = tomorrow.toISOString().split('T')[0];
        // Enforce tomorrow as minimum booking date (exclusivity rules!)
        bookingDateInput.min = tomorrow.toISOString().split('T')[0];
      }
    } else if (viewName === 'dashboard') {
      viewDashboard.classList.add('active');
      renderDashboard();
    }
  }

  // F. Google Authentication Popup window simulator
  function openGoogleAuthPopup() {
    const w = 450, h = 570;
    const left = (window.screen.width - w) / 2;
    const top = (window.screen.height - h) / 2;
    const popup = window.open('', 'GoogleSignIn', `width=${w},height=${h},top=${top},left=${left},resizable=yes`);
    
    if (!popup) {
      showToast('Popup blocker active. Please allow popups to connect with Google.', 'error');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Sign in - Google Accounts</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Roboto', sans-serif; background-color: #ffffff; color: #202124; margin: 0; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: calc(100vh - 80px); box-sizing: border-box; }
          .logo { height: 32px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: 400; margin-bottom: 8px; text-align: center; }
          .sub { font-size: 16px; color: #5f6368; margin-bottom: 35px; text-align: center; }
          .accounts-list { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 12px; }
          .account-chip { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid #dadce0; border-radius: 8px; cursor: pointer; transition: background-color 0.2s, border-color 0.2s; }
          .account-chip:hover { background-color: #f8f9fa; border-color: #4285f4; }
          .avatar { width: 36px; height: 36px; border-radius: 50%; background-color: #b8ad9a; color: #ffffff; font-weight: 500; display: flex; align-items: center; justify-content: center; font-size: 16px; text-transform: uppercase; }
          .avatar.am { background-color: #3f51b5; }
          .avatar.ad { background-color: #009688; }
          .details { display: flex; flex-direction: column; text-align: left; }
          .name { font-size: 14px; font-weight: 500; }
          .email { font-size: 12px; color: #5f6368; }
          .loader { border: 3px solid #f3f3f3; border-top: 3px solid #4285f4; border-radius: 50%; width: 28px; height: 28px; animation: spin 1s linear infinite; margin-top: 40px; display: none; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <svg class="logo" viewBox="0 0 24 24" width="75" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        <div class="title">Choose an account</div>
        <div class="sub">to continue to 4 ≡ UR CAFÉ</div>
        <div class="accounts-list" id="list">
          <div class="account-chip" data-name="Ayaan Mohammed" data-email="ayaan.m@gmail.com" data-phone="3023">
            <div class="avatar am">AM</div>
            <div class="details">
              <span class="name">Ayaan Mohammed</span>
              <span class="email">ayaan.m@gmail.com</span>
            </div>
          </div>
          <div class="account-chip" data-name="Ayaaa Design" data-email="ayaaa@design.com" data-phone="9912">
            <div class="avatar ad">A</div>
            <div class="details">
              <span class="name">Ayaaa Design</span>
              <span class="email">ayaaa@design.com</span>
            </div>
          </div>
        </div>
        <div class="loader" id="loader"></div>
        <script>
          document.querySelectorAll('.account-chip').forEach(chip => {
            chip.addEventListener('click', () => {
              document.getElementById('list').style.display = 'none';
              document.getElementById('loader').style.display = 'block';
              document.querySelector('.title').textContent = 'Connecting...';
              document.querySelector('.sub').textContent = 'Securing private session keys';
              
              setTimeout(() => {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_SUCCESS',
                  name: chip.getAttribute('data-name'),
                  email: chip.getAttribute('data-email'),
                  phone: chip.getAttribute('data-phone')
                }, '*');
                window.close();
              }, 1200);
            });
          });
        </script>
      </body>
      </html>
    `;
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  }

  // G. Auth Event Handlers
  window.addEventListener('message', (e) => {
    const data = e.data;
    if (data && data.type === 'GOOGLE_AUTH_SUCCESS') {
      let user = JSON.parse(localStorage.getItem('user_' + data.email));
      if (!user) {
        // Create simulated user database record
        user = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          bookings: [],
          tier: 'Tier I'
        };
        localStorage.setItem('user_' + data.email, JSON.stringify(user));
      }
      
      currentUser = user;
      localStorage.setItem('four_cafe_user', JSON.stringify(currentUser));
      
      showToast(`Welcome back, ${currentUser.name}!`, 'success');
      showView('booking');
    }
  });

  // Login form submit
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;

      const user = JSON.parse(localStorage.getItem('user_' + email));
      if (user && pass.length >= 4) {
        currentUser = user;
        localStorage.setItem('four_cafe_user', JSON.stringify(currentUser));
        
        showToast('Passkey verified successfully!', 'success');
        showView('booking');
        
        // Reset fields
        formLogin.reset();
      } else {
        showToast('Invalid member credentials', 'error');
      }
    });
  }

  // Signup form submit
  if (formSignup) {
    formSignup.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const pass = document.getElementById('signup-password').value;

      if (pass.length < 4) {
        showToast('Password must be at least 4 digits', 'error');
        return;
      }

      const existingUser = localStorage.getItem('user_' + email);
      if (existingUser) {
        showToast('Email address already registered', 'error');
        return;
      }

      // Create new user record
      const newUser = {
        name,
        email,
        phone: Math.floor(1000 + Math.random() * 9000).toString(),
        bookings: [],
        tier: 'Tier I'
      };
      
      localStorage.setItem('user_' + email, JSON.stringify(newUser));
      currentUser = newUser;
      localStorage.setItem('four_cafe_user', JSON.stringify(currentUser));

      showToast('Membership credentials created successfully!', 'success');
      showView('booking');
      
      formSignup.reset();
    });
  }

  // Tabs togglers
  if (tabLogin && tabSignup) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      formLogin.classList.add('active');
      formSignup.classList.remove('active');
    });

    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      formSignup.classList.add('active');
      formLogin.classList.remove('active');
    });
  }

  const btnGoogle = document.getElementById('btn-google-login');
  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
      openGoogleAuthPopup();
    });
  }

  // H. Seat Reservation Logic
  const chamberOptions = document.querySelectorAll('.chamber-option');
  chamberOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      chamberOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedChamber = parseInt(opt.getAttribute('data-chamber'));
    });
  });

  const timeChips = document.querySelectorAll('.time-chip');
  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedTimeSlot = chip.getAttribute('data-time');
    });
  });

  const btnConfirmBooking = document.getElementById('btn-confirm-booking');
  if (btnConfirmBooking) {
    btnConfirmBooking.addEventListener('click', () => {
      if (!currentUser) {
        showToast('Please log in to complete reservation', 'error');
        showView('auth');
        return;
      }

      const bookingDate = document.getElementById('booking-date').value;
      const bookingGuests = document.getElementById('booking-guests').value;

      if (!bookingDate) {
        showToast('Please select a booking date', 'error');
        return;
      }
      if (!selectedTimeSlot) {
        showToast('Please select a time slot', 'error');
        return;
      }

      // Exclusivity rule validation: prevent double booking on the same day/slot combo
      const hasDoubleBooking = currentUser.bookings.some(b => b.date === bookingDate && b.time === selectedTimeSlot);
      if (hasDoubleBooking) {
        showToast('You already hold a seat reservation for this slot!', 'error');
        return;
      }

      // Create new booking pass
      const newBooking = {
        id: 'RES-4UR-' + Math.floor(1000 + Math.random() * 9000),
        chamber: selectedChamber,
        date: bookingDate,
        time: selectedTimeSlot,
        guests: bookingGuests,
        passId: 'PASS-' + Math.floor(100000 + Math.random() * 900000)
      };

      // Save reservation
      currentUser.bookings.unshift(newBooking);
      localStorage.setItem('user_' + currentUser.email, JSON.stringify(currentUser));
      localStorage.setItem('four_cafe_user', JSON.stringify(currentUser));

      showToast(`Chamber seat booked for ${bookingDate}!`, 'success');
      showView('dashboard');
    });
  }

  // Dashboard buttons
  const btnDashNewBooking = document.getElementById('btn-dash-new-booking');
  if (btnDashNewBooking) {
    btnDashNewBooking.addEventListener('click', () => {
      showView('booking');
    });
  }

  const btnToDashboard = document.getElementById('btn-to-dashboard');
  if (btnToDashboard) {
    btnToDashboard.addEventListener('click', () => {
      showView('dashboard');
    });
  }

  const btnDashLogout = document.getElementById('btn-dash-logout');
  if (btnDashLogout) {
    btnDashLogout.addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('four_cafe_user');
      showToast('Logged out of private member session', 'success');
      showView('auth');
    });
  }

  // I. Modal Trigger Controls & Hooks
  const openPortal = (tierPreset = null) => {
    if (portalOverlay) {
      portalOverlay.classList.add('active');
      
      if (currentUser) {
        // Apply preset tier if user exists
        if (tierPreset) {
          currentUser.tier = tierPreset;
          localStorage.setItem('user_' + currentUser.email, JSON.stringify(currentUser));
          localStorage.setItem('four_cafe_user', JSON.stringify(currentUser));
        }
        showView('booking');
      } else {
        showView('auth');
      }
    }
  };

  const closePortal = () => {
    if (portalOverlay) {
      portalOverlay.classList.remove('active');
    }
  };

  if (portalClose) {
    portalClose.addEventListener('click', () => {
      closePortal();
    });
  }

  // Hook all interactive booking and reservation buttons on the landing page
  // 1. Header CTA button
  const headerCTA = document.querySelector('.btn-minimal');
  if (headerCTA) {
    headerCTA.addEventListener('click', (e) => {
      e.preventDefault();
      openPortal();
    });
  }

  // 2. Membership Tier applied cards triggers
  const tierCards = document.querySelectorAll('.member-card');
  const tiers = ['Tier I', 'Tier II', 'Tier III'];
  
  tierCards.forEach((card, idx) => {
    const applyBtn = card.querySelector('.btn-tier');
    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Auto-select chamber matching membership tier focus dynamically
        // Tier 1 -> Chamber 1 (Quiet Room), Tier 2 -> Chamber 2 (Cinematic), Tier 3 -> Chamber 3 (Hidden)
        selectedChamber = idx + 1;
        
        const matchingChamberOpt = document.querySelector(`.chamber-option[data-chamber="${selectedChamber}"]`);
        if (matchingChamberOpt) {
          chamberOptions.forEach(o => o.classList.remove('active'));
          matchingChamberOpt.classList.add('active');
        }

        openPortal(tiers[idx]);
      });
    }
  });

});
