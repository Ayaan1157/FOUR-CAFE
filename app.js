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
  const canvas3D = document.getElementById('canvas-3d');
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
  // 3. THREE-POINT STUDIO LIGHTING RIG (8K SPECULARS)
  // ==========================================
  // Ambient glow fill
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  // Warm studio spotlight (top-left key light) to bounce on ceramic glazes
  const keyLight = new THREE.DirectionalLight(0xfaf8f5, 1.8);
  keyLight.position.set(6, 7, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // Cold rim backlight (top-right highlight) to capture stone-beige profile edges
  const backlight = new THREE.DirectionalLight(0xb8ad9a, 2.5);
  backlight.position.set(-6, 5, -5);
  scene.add(backlight);

  // Subtle bounce uplight (bottom key) simulating table ambient refraction
  const uplight = new THREE.DirectionalLight(0xb8ad9a, 0.4);
  uplight.position.set(0, -6, 2);
  scene.add(uplight);

  // Spot fill focusing on the shiny liquid crema surface
  const spotLight = new THREE.SpotLight(0xffffff, 1.5, 15, Math.PI / 8, 0.7, 0.5);
  spotLight.position.set(0, 8, 2);
  scene.add(spotLight);


  // ==========================================
  // 4. PROCEDURAL MODELING OF HYPER-REALISTIC MUG
  // ==========================================
  const cupGroup = new THREE.Group();
  scene.add(cupGroup);

  // 4a. Matte Clay + Outer Clearcoat Glaze Material (Dual-Layer Porcelain Feel)
  const cupMaterial = new THREE.MeshStandardMaterial({
    color: 0x090909,             // Luxury deep charcoal black
    roughness: 0.45,             // Satin clay textured reflection
    metalness: 0.1,              // Dense ceramic core density
    clearcoat: 0.38,             // Shiny transparent top porcelain glaze
    clearcoatRoughness: 0.22,    // Soft, realistic outer glaze specular
  });

  // 4b. Ultra-Smooth Lathe Geometry (Spun at 128 segments to remove polygon jaggies)
  const cupPoints = [];
  cupPoints.push(new THREE.Vector2(0, -1.35));     // Inner bottom center
  cupPoints.push(new THREE.Vector2(0.9, -1.25));   // Inner bottom corner
  cupPoints.push(new THREE.Vector2(1.15, 0.0));    // Inner wall mid
  cupPoints.push(new THREE.Vector2(1.35, 1.4));    // Inner wall upper rim edge
  cupPoints.push(new THREE.Vector2(1.42, 1.45));   // Rim inner bevel
  cupPoints.push(new THREE.Vector2(1.48, 1.5));    // Rim top flat surface
  cupPoints.push(new THREE.Vector2(1.52, 1.45));   // Rim outer bevel
  cupPoints.push(new THREE.Vector2(1.48, 1.3));    // Outer wall upper bevel
  cupPoints.push(new THREE.Vector2(1.22, 0.0));    // Outer wall mid flare
  cupPoints.push(new THREE.Vector2(1.05, -1.0));   // Outer wall lower base
  cupPoints.push(new THREE.Vector2(0.98, -1.45));  // Base outer corner
  cupPoints.push(new THREE.Vector2(0.85, -1.5));   // Bottom ring foot
  cupPoints.push(new THREE.Vector2(0.0, -1.5));    // Center bottom base
  
  const cupGeometry = new THREE.LatheGeometry(cupPoints, 128); // 128 high-res segments
  const cupBodyMesh = new THREE.Mesh(cupGeometry, cupMaterial);
  cupBodyMesh.castShadow = true;
  cupBodyMesh.receiveShadow = true;
  cupGroup.add(cupBodyMesh);

  // 4c. Elegant Curved Mug Handle
  const handleGeometry = new THREE.TorusGeometry(0.7, 0.14, 24, 96, Math.PI * 1.1);
  const handleMesh = new THREE.Mesh(handleGeometry, cupMaterial);
  handleMesh.position.set(-1.0, -0.05, 0);
  handleMesh.rotation.z = Math.PI * 0.45; // Natural curved mug rotation
  handleMesh.castShadow = true;
  cupGroup.add(handleMesh);

  // 4d. Dynamic Espresso Crema Swirls & Foam Texture Map
  const cremaCanvas = document.createElement('canvas');
  cremaCanvas.width = 1024;
  cremaCanvas.height = 1024;
  const cremaCtx = cremaCanvas.getContext('2d');
  
  // Base dark gradient espresso
  const cremaGrad = cremaCtx.createRadialGradient(512, 512, 10, 512, 512, 512);
  cremaGrad.addColorStop(0, '#5a3d28');   // Light brown hazelnut crema center
  cremaGrad.addColorStop(0.35, '#362114'); // Rich gold-brown body
  cremaGrad.addColorStop(0.85, '#190a04'); // Deep dark roast outer coffee
  cremaGrad.addColorStop(1, '#0c0401');    // Shadow cup rim border
  cremaCtx.fillStyle = cremaGrad;
  cremaCtx.fillRect(0, 0, 1024, 1024);

  // Render organic crema swirl structures (Apple-style detail)
  cremaCtx.strokeStyle = 'rgba(164, 122, 88, 0.2)';
  cremaCtx.lineWidth = 14;
  cremaCtx.beginPath();
  cremaCtx.arc(512, 512, 220, 0.1 * Math.PI, 1.2 * Math.PI);
  cremaCtx.stroke();
  
  cremaCtx.strokeStyle = 'rgba(202, 163, 132, 0.15)';
  cremaCtx.lineWidth = 8;
  cremaCtx.beginPath();
  cremaCtx.arc(512, 512, 380, 0.6 * Math.PI, 1.7 * Math.PI);
  cremaCtx.stroke();

  // Inject tiny micro-bubbles represent fresh brew froth
  cremaCtx.fillStyle = 'rgba(224, 192, 168, 0.2)';
  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 320;
    const rx = 512 + Math.cos(angle) * distance;
    const ry = 512 + Math.sin(angle) * distance;
    const size = 1.5 + Math.random() * 5.0;
    
    cremaCtx.beginPath();
    cremaCtx.arc(rx, ry, size, 0, Math.PI * 2);
    cremaCtx.fill();
  }

  const cremaTexture = new THREE.CanvasTexture(cremaCanvas);
  cremaTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  // Create Shiny liquid mesh inside mug cavity
  const liquidGeometry = new THREE.CylinderGeometry(1.34, 1.2, 0.06, 128);
  const liquidMaterial = new THREE.MeshStandardMaterial({
    map: cremaTexture,
    roughness: 0.02,              // Ultra-gloss fluid surface
    metalness: 0.05,
    clearcoat: 1.0,               // Smooth transparent liquid reflection layer
    clearcoatRoughness: 0.0,
  });
  const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquidMesh.position.set(0, 1.25, 0);
  cupGroup.add(liquidMesh);

  // 4e. 8K Sharp CanvasTexture Branding (Metallic Stone-Beige Gold Foil Stamp)
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 2048; // Double resolution (8K vector feel)
  logoCanvas.height = 2048;
  const ctx = logoCanvas.getContext('2d');
  
  ctx.clearRect(0, 0, 2048, 2048);
  ctx.fillStyle = '#B8AD9A'; // Brand stone beige base
  
  // Montserrat-styled vector lettering drawn with 8K subpixel accuracy
  // "4" on the left
  ctx.font = '500 480px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('4', 760, 1040);
  
  // "â‰¡" four parallel parallel lines
  const lineW = 420;
  const lineH = 30;
  const lineGap = 40;
  const startY = 740;
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(820, startY + i * (lineH + lineGap), lineW, lineH);
  }
  
  // "UR" on the right
  ctx.font = '500 480px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('UR', 1320, 1040);
  
  // "C A F E" underneath with tracking gaps
  ctx.font = '300 140px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('C  A  F  E', 1024, 1300);

  const logoTexture = new THREE.CanvasTexture(logoCanvas);
  logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  // Cylindrical wrap segment snug to cup body
  const logoGeometry = new THREE.CylinderGeometry(1.498, 1.232, 1.2, 64, 1, true, -Math.PI / 6, Math.PI / 3);
  
  // Metallic stone-beige gold foil material (Specular reflective foil)
  const logoMaterial = new THREE.MeshStandardMaterial({
    map: logoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.18,      // Satin gold foil reflection
    metalness: 0.85,      // Gold-foil metallic stamp look
    color: 0xffffff       // Foil base multiplier
  });
  
  const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
  logoMesh.position.set(0, -0.05, 0.015);
  cupGroup.add(logoMesh);


  // ==========================================
  // 5. WEBGL SCROLL KEYFRAME INTERPOLATION TIMELINE
  // ==========================================
  let targetProgress = 0;
  let currentProgress = 0;
  const videoLerpSpeed = 0.12; // satisfying lag value requested

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

  // Scroll listener driving progress from 0 to 1 mapped to the section's scroll range
  const heroSection = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    if (!heroSection) return;
    
    const sectionTop = heroSection.offsetTop;
    const sectionHeight = heroSection.offsetHeight;
    const scrollRange = sectionHeight - window.innerHeight;
    
    // Relative scrolled distance inside the section bounds
    const relativeScroll = window.scrollY - sectionTop;
    const progress = Math.max(0, Math.min(1, relativeScroll / scrollRange));
    targetProgress = progress;
  }, { passive: true });

  // Update dynamic staggered text overlays based on progress
  const textGroups = document.querySelectorAll('.text-group');
  function updateTextOverlays(progress) {
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
  // 6. THE SPACES: MOMENTUM DRAG ENGINE
  // ==========================================
  const dragContainer = document.getElementById('drag-container');
  const dragTrack = document.getElementById('drag-track');
  
  let isDragging = false;
  let dragStartX = 0;
  let prevTranslate = 0;
  let targetTranslate = 0;
  let currentTranslate = 0;
  let dragVelocity = 0;
  let lastDragX = 0;
  let lastDragTime = 0;

  if (dragContainer && dragTrack) {
    dragContainer.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
    window.addEventListener('mouseup', endDrag);

    dragContainer.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', endDrag);

    function startDrag(clientX) {
      isDragging = true;
      dragStartX = clientX;
      prevTranslate = targetTranslate;
      dragVelocity = 0;
      lastDragX = clientX;
      lastDragTime = performance.now();
      dragContainer.style.cursor = 'grabbing';
    }

    function moveDrag(clientX) {
      if (!isDragging) return;
      
      const currentX = clientX;
      const currentTime = performance.now();
      const deltaX = currentX - dragStartX;
      targetTranslate = prevTranslate + deltaX;

      const maxSlide = -(dragTrack.scrollWidth - dragContainer.clientWidth);
      if (targetTranslate > 0) {
        targetTranslate = targetTranslate * 0.35;
      } else if (targetTranslate < maxSlide) {
        targetTranslate = maxSlide + (targetTranslate - maxSlide) * 0.35;
      }

      const deltaTime = Math.max(1, currentTime - lastDragTime);
      dragVelocity = (currentX - lastDragX) / deltaTime * 16.66;
      lastDragX = currentX;
      lastDragTime = currentTime;
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      dragContainer.style.cursor = 'grab';
      targetTranslate += dragVelocity * 0.95;

      const maxSlide = -(dragTrack.scrollWidth - dragContainer.clientWidth);
      if (targetTranslate > 0) {
        targetTranslate = 0;
      } else if (targetTranslate < maxSlide) {
        targetTranslate = maxSlide;
      }
    }
  }


  // ==========================================
  // 7. EXCLUSIVITY LIST: SCROLL ILLUMINATION
  // ==========================================
  const exclusivityItems = document.querySelectorAll('.exclusivity-item');

  function updateExclusivityIllumination() {
    exclusivityItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight * 0.65;
      
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
  const memberCards = document.querySelectorAll('.member-card');
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

  function tick() {
    
    // 11a. Lerp progress values (Butter smooth)
    currentProgress += (targetProgress - currentProgress) * videoLerpSpeed;
    if (Math.abs(targetProgress - currentProgress) < 0.0001) {
      currentProgress = targetProgress;
    }
    
    // Update floating texts
    updateTextOverlays(currentProgress);

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

    // Lerp coordinates toward targets to prevent any jarring snap jumps
    currentX += (cupTimeline.x - currentX) * 0.1;
    currentY += (cupTimeline.y - currentY) * 0.1;
    currentZ += (cupTimeline.z - currentZ) * 0.1;
    
    currentRx += (cupTimeline.rx - currentRx) * 0.1;
    currentRy += (cupTimeline.ry - currentRy) * 0.1;
    currentRz += (cupTimeline.rz - currentRz) * 0.1;

    // Apply translations and rotations (Combine Scroll Matrix + Parallax + Floating Drift)
    cupGroup.position.x = currentX + hoverDriftX + mouseTiltY;
    cupGroup.position.y = currentY + hoverDriftY - mouseTiltX;
    cupGroup.position.z = currentZ;

    cupGroup.rotation.x = currentRx + mouseTiltX * 0.45;
    cupGroup.rotation.y = currentRy + hoverRotY + mouseTiltY * 0.45;
    cupGroup.rotation.z = currentRz;

    // 11c. Lerp Spaces Drag Slider
    if (dragTrack && dragContainer) {
      currentTranslate += (targetTranslate - currentTranslate) * 0.08;
      if (Math.abs(targetTranslate - currentTranslate) < 0.05) {
        currentTranslate = targetTranslate;
      }
      dragTrack.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    }



    // 11d. Lerp Custom Cursor
    if (cursor && !isTouchDevice) {
      cursorX += (targetCursorX - cursorX) * cursorLerpSpeed;
      cursorY += (targetCursorY - cursorY) * cursorLerpSpeed;
      cursor.style.top = `${cursorY}px`;
      cursor.style.left = `${cursorX}px`;
    }

    // 11e. List Illumination check on tick
    updateExclusivityIllumination();

    // 11f. Render WebGL frame
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }


  requestAnimationFrame(tick);

});
