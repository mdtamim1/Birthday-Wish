/* ============================================================
   ULTRA-LUXURY VIP 3D BIRTHDAY EXPERIENCE — APP.JS
   WebGL Three.js 3D Universe, 3D Cake, 3D Crystals & Balloons,
   Camera Director, Sound FX, Confetti, Fireworks & Theme Switcher
   ============================================================ */

// ===== 6 CURATED LUXURY THEMES =====
const THEMES = {
  'royal-gold': {
    name: '👑 Royal Gold',
    p: '#f59e0b',
    s: '#fbbf24',
    a: '#fde68a',
    goldDark: '#b45309',
    glow: 'rgba(245, 158, 11, 0.45)',
    bgDeep: '#06040c',
    bgDark: '#0e081a',
    bgCard: 'rgba(16, 10, 28, 0.76)',
    glassGlow: 'rgba(245, 158, 11, 0.35)',
    threeLight1: 0xf59e0b,
    threeLight2: 0xfbbf24,
    threeParticle: 0xfde68a,
    threeCake: [0xb45309, 0xf59e0b, 0xfbbf24],
    confetti: ['#f59e0b', '#fbbf24', '#fde68a', '#ffffff', '#ffd700']
  },
  'rose-gold': {
    name: '🌸 Rose Gold & Diamond',
    p: '#f43f5e',
    s: '#fb7185',
    a: '#fde047',
    goldDark: '#9f1239',
    glow: 'rgba(244, 63, 94, 0.45)',
    bgDeep: '#0a0312',
    bgDark: '#160620',
    bgCard: 'rgba(24, 8, 30, 0.76)',
    glassGlow: 'rgba(251, 113, 133, 0.35)',
    threeLight1: 0xf43f5e,
    threeLight2: 0xfb7185,
    threeParticle: 0xfda4af,
    threeCake: [0x9f1239, 0xf43f5e, 0xfb7185],
    confetti: ['#fb7185', '#f43f5e', '#fde047', '#ffffff', '#fda4af']
  },
  'sapphire-cyan': {
    name: '💎 Cosmic Sapphire',
    p: '#38bdf8',
    s: '#818cf8',
    a: '#a5f3fc',
    goldDark: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.45)',
    bgDeep: '#02050e',
    bgDark: '#070f24',
    bgCard: 'rgba(6, 14, 34, 0.76)',
    glassGlow: 'rgba(56, 189, 248, 0.35)',
    threeLight1: 0x38bdf8,
    threeLight2: 0x818cf8,
    threeParticle: 0xa5f3fc,
    threeCake: [0x0369a1, 0x38bdf8, 0x818cf8],
    confetti: ['#38bdf8', '#818cf8', '#a5f3fc', '#ffffff', '#60a5fa']
  },
  'emerald-gold': {
    name: '✨ Emerald Royale',
    p: '#10b981',
    s: '#34d399',
    a: '#fbbf24',
    goldDark: '#047857',
    glow: 'rgba(16, 185, 129, 0.45)',
    bgDeep: '#010f09',
    bgDark: '#031c12',
    bgCard: 'rgba(3, 24, 16, 0.76)',
    glassGlow: 'rgba(16, 185, 129, 0.35)',
    threeLight1: 0x10b981,
    threeLight2: 0x34d399,
    threeParticle: 0x6ee7b7,
    threeCake: [0x047857, 0x10b981, 0x34d399],
    confetti: ['#34d399', '#10b981', '#fbbf24', '#ffffff', '#6ee7b7']
  },
  'sunset-coral': {
    name: '🌅 Sunset Silk',
    p: '#f97316',
    s: '#fb7185',
    a: '#fde047',
    goldDark: '#c2410c',
    glow: 'rgba(249, 115, 22, 0.45)',
    bgDeep: '#100307',
    bgDark: '#1e0610',
    bgCard: 'rgba(28, 7, 14, 0.76)',
    glassGlow: 'rgba(249, 115, 22, 0.35)',
    threeLight1: 0xf97316,
    threeLight2: 0xfb7185,
    threeParticle: 0xfed7aa,
    threeCake: [0xc2410c, 0xf97316, 0xfb7185],
    confetti: ['#f97316', '#fb7185', '#fde047', '#ffffff', '#fed7aa']
  },
  'galaxy-violet': {
    name: '💜 Mystic Galaxy',
    p: '#da5ec9',
    s: '#ec4899',
    a: '#fd8ae0',
    goldDark: '#7e22ce',
    glow: 'rgba(218, 94, 201, 0.45)',
    bgDeep: '#060214',
    bgDark: '#100528',
    bgCard: 'rgba(16, 8, 30, 0.78)',
    glassGlow: 'rgba(218, 94, 201, 0.35)',
    threeLight1: 0xda5ec9,
    threeLight2: 0xec4899,
    threeParticle: 0xfd8ae0,
    threeCake: [0x7e22ce, 0xda5ec9, 0xec4899],
    confetti: ['#da5ec9', '#ec4899', '#fd8ae0', '#ffffff', '#38bdf8']
  }
};

// ===== DEFAULT SETTINGS =====
const DEFAULT_SETTINGS = {
  name: 'Your Name',
  birthdate: '',
  specialText: 'May all your wildest dreams come true today and forever 🌸',
  birthdayNote: "On this magnificent day, I want you to know how truly special you are. Every smile of yours brings sunshine, and having you in this world is a blessing. Here's to a year overflowing with boundless joy, glorious memories, and endless love!",
  photo: '',
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
  ],
  showWisher: false,
  wisherName: '',
  musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-155461.mp3',
  musicEnabled: true,
  themeId: 'galaxy-violet',
  themeColor1: '#da5ec9',
  themeColor2: '#ec4899',
  themeAccent: '#fd8ae0',
  giftMessage: 'This gift is wrapped with all my heart and endless love for you! 💝',
  giftPhoto: '',
  showBirthdate: true,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('birthdaySettings');
    if (!saved) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(saved);
    return { 
      ...DEFAULT_SETTINGS, 
      ...parsed,
      themeId: parsed.themeId || 'galaxy-violet',
      photos: (parsed.photos && parsed.photos.length > 0) ? parsed.photos : DEFAULT_SETTINGS.photos
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let S = loadSettings();
let currentTheme = THEMES[S.themeId] || THEMES['galaxy-violet'];

// ===== SYNTHETIC AUDIO ENGINE =====
class SoundFX {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playBlow() {
    this.init();
    if (!this.ctx) return;
    try {
      const node = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.6, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
      }
      node.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
      node.connect(filter);
      filter.connect(this.ctx.destination);
      node.start();
    } catch {}
  }
  playChime() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.85);
      });
    } catch {}
  }
  playWhoosh() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);
    } catch {}
  }
  playSlice() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {}
  }
}
const sfx = new SoundFX();

// ===== THREE.JS 3D WEBGL ENGINE =====
let scene, camera, renderer;
let particlesMesh, ringGroup, cakeGroup, balloonGroup, giftGroup;
let pointLight1, pointLight2, candleLight;
let cakeFlames = [];
let candlesLit = true;
let cakeCut = false;
let currentSceneIndex = 0;

let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0, targetCameraZ = 6;
let targetLookAtY = 0;

function initThreeScene() {
  const container = document.getElementById('webgl-container');
  if (!container || typeof THREE === 'undefined') return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 6.2);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  pointLight1 = new THREE.PointLight(currentTheme.threeLight1, 2.5, 30);
  pointLight1.position.set(4, 5, 4);
  scene.add(pointLight1);

  pointLight2 = new THREE.PointLight(currentTheme.threeLight2, 2.0, 30);
  pointLight2.position.set(-4, -3, 3);
  scene.add(pointLight2);

  candleLight = new THREE.PointLight(0xffeedd, 2.5, 12);
  candleLight.position.set(0, -0.6, 1);
  scene.add(candleLight);

  // 1. Particle Stardust Universe (2,500 particles)
  const particleCount = window.innerWidth < 600 ? 1500 : 2500;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const baseColor = new THREE.Color(currentTheme.threeParticle);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 3 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const shade = baseColor.clone().offsetHSL(Math.random() * 0.1 - 0.05, 0, (Math.random() - 0.5) * 0.4);
    colors[i3] = shade.r;
    colors[i3 + 1] = shade.g;
    colors[i3 + 2] = shade.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  particlesMesh = new THREE.Points(particleGeo, particleMat);
  scene.add(particlesMesh);

  // 2. 3D Orbiting Golden Torus Rings & Crystals
  ringGroup = new THREE.Group();

  const torusMat = new THREE.MeshStandardMaterial({
    color: currentTheme.threeLight1,
    metalness: 0.9,
    roughness: 0.15,
    wireframe: false
  });

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.03, 16, 100), torusMat);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.02, 16, 100), torusMat);
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;

  ringGroup.add(ring1);
  ringGroup.add(ring2);

  // Floating 3D Crystal Diamonds
  const crystalMat = new THREE.MeshStandardMaterial({
    color: currentTheme.threeLight2,
    metalness: 0.8,
    roughness: 0.1,
    transparent: true,
    opacity: 0.9
  });

  for (let c = 0; c < 8; c++) {
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), crystalMat);
    const angle = (Math.PI * 2 / 8) * c;
    crystal.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, (Math.random() - 0.5) * 0.8);
    ringGroup.add(crystal);
  }

  scene.add(ringGroup);

  // 3. 3D Birthday Balloons (Positioned at outer perimeter)
  balloonGroup = new THREE.Group();
  const balloonMat = new THREE.MeshStandardMaterial({
    color: currentTheme.threeLight1,
    metalness: 0.6,
    roughness: 0.25
  });

  const balloonPositions = [
    [-4.8, 2.2, -2.5],
    [4.8, 2.0, -2.8],
    [-4.4, -1.8, -2.2],
    [4.4, -1.6, -2.4],
    [-5.4, 0.4, -3.0],
    [5.4, 0.5, -3.0]
  ];

  balloonPositions.forEach((pos, idx) => {
    const bMesh = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 32), balloonMat.clone());
    bMesh.scale.set(1, 1.25, 1);
    bMesh.position.set(pos[0], pos[1], pos[2]);
    bMesh.userData = {
      baseY: pos[1],
      speed: 0.8 + idx * 0.2,
      phase: idx * 1.5
    };
    balloonGroup.add(bMesh);
  });

  scene.add(balloonGroup);

  // 4. Real 3D Birthday Cake Group
  cakeGroup = new THREE.Group();
  cakeGroup.position.set(0, 0.05, 0);

  const tierColors = currentTheme.threeCake || [0x7e22ce, 0xda5ec9, 0xec4899];
  const frostingColor = 0xfff0f5; // Creamy vanilla frosting

  // Frosting material
  const frostingMat = new THREE.MeshStandardMaterial({
    color: frostingColor,
    roughness: 0.25,
    metalness: 0.1,
    emissive: 0xffffff,
    emissiveIntensity: 0.08
  });

  // Base Tier (Tier 1)
  const tier1Mat = new THREE.MeshStandardMaterial({ 
    color: tierColors[0], 
    metalness: 0.25, 
    roughness: 0.45 
  });
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.6, 36), tier1Mat);
  tier1.position.y = 0.0;
  cakeGroup.add(tier1);

  // Base Tier Frosting Trim (pearls around top and bottom)
  const trim1Top = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.045, 16, 40), frostingMat);
  trim1Top.rotation.x = Math.PI / 2;
  trim1Top.position.y = 0.3;
  cakeGroup.add(trim1Top);

  const trim1Bot = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.04, 16, 40), frostingMat);
  trim1Bot.rotation.x = Math.PI / 2;
  trim1Bot.position.y = -0.3;
  cakeGroup.add(trim1Bot);

  // Mid Tier (Tier 2)
  const tier2Mat = new THREE.MeshStandardMaterial({ 
    color: tierColors[1], 
    metalness: 0.25, 
    roughness: 0.4 
  });
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.52, 36), tier2Mat);
  tier2.position.y = 0.56;
  cakeGroup.add(tier2);

  // Mid Tier Frosting Trim
  const trim2Top = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.04, 16, 36), frostingMat);
  trim2Top.rotation.x = Math.PI / 2;
  trim2Top.position.y = 0.82;
  cakeGroup.add(trim2Top);

  // Top Tier (Tier 3)
  const tier3Mat = new THREE.MeshStandardMaterial({ 
    color: tierColors[2], 
    metalness: 0.3, 
    roughness: 0.35 
  });
  const tier3 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.45, 36), tier3Mat);
  tier3.position.y = 1.05;
  cakeGroup.add(tier3);

  // Top Tier Frosting Swirl / Trim
  const trim3Top = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.038, 16, 32), frostingMat);
  trim3Top.rotation.x = Math.PI / 2;
  trim3Top.position.y = 1.275;
  cakeGroup.add(trim3Top);

  // Strawberries / Cherries on Top
  const berryMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.1 });
  for (let b = 0; b < 6; b++) {
    const angle = (b / 6) * Math.PI * 2;
    const berry = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), berryMat);
    berry.position.set(Math.cos(angle) * 0.42, 1.31, Math.sin(angle) * 0.42);
    cakeGroup.add(berry);
  }

  // 3 Candles on Top
  const candlePositions = [-0.22, 0, 0.22];
  cakeFlames = [];

  candlePositions.forEach((cx, i) => {
    // Candle Body (Golden / Striped)
    const cBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.32, 16),
      new THREE.MeshStandardMaterial({ 
        color: i === 1 ? 0xfffae6 : (currentTheme.threeLight1 || 0xffd700),
        metalness: 0.4,
        roughness: 0.2
      })
    );
    cBody.position.set(cx, 1.43, (i === 1 ? 0.04 : -0.04));
    cakeGroup.add(cBody);

    // Candle Wick
    const wick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.05, 8),
      new THREE.MeshBasicMaterial({ color: 0x222222 })
    );
    wick.position.set(cx, 1.61, (i === 1 ? 0.04 : -0.04));
    cakeGroup.add(wick);

    // Candle Flame Mesh
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.18, 16), flameMat);
    flame.position.set(cx, 1.70, (i === 1 ? 0.04 : -0.04));
    cakeGroup.add(flame);
    cakeFlames.push(flame);
  });

  // Candle Glow PointLight
  candleLight = new THREE.PointLight(0xffaa33, 2.8, 7);
  candleLight.position.set(0, 1.75, 0);
  cakeGroup.add(candleLight);

  // Luxury Plate & Pedestal Stand
  const plateMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    metalness: 0.9, 
    roughness: 0.1 
  });
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.5, 0.08, 36), plateMat);
  plate.position.y = -0.34;
  cakeGroup.add(plate);

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 0.25, 32), plateMat);
  pedestal.position.y = -0.48;
  cakeGroup.add(pedestal);

  cakeGroup.scale.set(0.92, 0.92, 0.92);
  cakeGroup.visible = false;
  scene.add(cakeGroup); // Added directly to scene!

  // 5. 3D Orbiting Photo Cards around the Cake (Double Sided Images)
  setup3DOrbitPhotoCards();

  // Event Listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  animateThree();
}

// ===== 3D ORBIT PHOTO CARDS AROUND CAKE (DOUBLE-SIDED THREE.JS WEBGL) =====
let orbitPhotosGroup = null;
let orbitPhotoCards = [];

function setup3DOrbitPhotoCards() {
  if (!scene) return;
  if (orbitPhotosGroup) {
    scene.remove(orbitPhotosGroup);
  }

  orbitPhotosGroup = new THREE.Group();
  orbitPhotosGroup.position.set(0, 0.05, 0); // Centered with cakeGroup
  orbitPhotoCards = [];

  const photosList = (S.photos && S.photos.length > 0) ? S.photos : (DEFAULT_SETTINGS.photos || []);
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');

  const radius = 2.65; // Wide orbit cleanly circling around the 4 sides of the cake
  const totalCards = 4;

  for (let i = 0; i < totalCards; i++) {
    const cardPivot = new THREE.Group();
    const angle = (i / totalCards) * Math.PI * 2;
    cardPivot.position.set(Math.cos(angle) * radius, 0.65, Math.sin(angle) * radius);
    cardPivot.userData = {
      baseAngle: angle,
      radius: radius,
      baseY: 0.65,
      phase: i * 1.5
    };

    // 1. Sleek Glass / Golden Frame
    const frameGeo = new THREE.BoxGeometry(0.88, 1.18, 0.03);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.88,
      roughness: 0.15,
      emissive: currentTheme.threeLight1 || 0xda5ec9,
      emissiveIntensity: 0.25
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    cardPivot.add(frameMesh);

    // 2. Glowing Neon Border Outline
    const edgeGeo = new THREE.EdgesGeometry(frameGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: currentTheme.threeLight2 || 0xfd8ae0,
      linewidth: 2
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    cardPivot.add(edgeLine);

    // 3. Dynamic Canvas Fallback Texture
    const canvas = document.createElement('canvas');
    canvas.width = 300; canvas.height = 420;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 300, 420);
    grad.addColorStop(0, '#8b5cf6');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 420);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Memory ' + (i + 1), 150, 210);
    const defaultTex = new THREE.CanvasTexture(canvas);

    // Front Picture Material
    const picMatFront = new THREE.MeshStandardMaterial({
      map: defaultTex,
      metalness: 0.05,
      roughness: 0.25,
      side: THREE.FrontSide
    });

    // Back Picture Material
    const picMatBack = new THREE.MeshStandardMaterial({
      map: defaultTex,
      metalness: 0.05,
      roughness: 0.25,
      side: THREE.FrontSide
    });

    const imgSrc = photosList[i % photosList.length];
    if (imgSrc) {
      textureLoader.load(imgSrc, (loadedTex) => {
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        picMatFront.map = loadedTex;
        picMatFront.needsUpdate = true;
        picMatBack.map = loadedTex;
        picMatBack.needsUpdate = true;
      }, undefined, () => {});
    }

    const picGeo = new THREE.PlaneGeometry(0.82, 1.12);

    // 4. Front Picture Mesh (facing +Z)
    const picMeshFront = new THREE.Mesh(picGeo, picMatFront);
    picMeshFront.position.z = 0.016;
    cardPivot.add(picMeshFront);

    // 5. Back Picture Mesh (facing -Z, rotated Math.PI so image is properly oriented)
    const picMeshBack = new THREE.Mesh(picGeo, picMatBack);
    picMeshBack.position.z = -0.016;
    picMeshBack.rotation.y = Math.PI;
    cardPivot.add(picMeshBack);

    orbitPhotosGroup.add(cardPivot);
    orbitPhotoCards.push(cardPivot);
  }

  orbitPhotosGroup.visible = false;
  scene.add(orbitPhotosGroup);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

  const glow = document.getElementById('cursorGlow');
  if (glow) {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }
}

function onTouchMove(e) {
  if (e.touches.length > 0) {
    mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
  }
}

// 3D Animation Loop (60 FPS)
let clock = new THREE.Clock();

function animateThree() {
  requestAnimationFrame(animateThree);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Rotate Stardust Particles
  if (particlesMesh) {
    particlesMesh.rotation.y = time * 0.03;
    particlesMesh.rotation.x = time * 0.01;
  }

  // Rotate Golden Rings & Crystals
  if (ringGroup && ringGroup.visible) {
    ringGroup.rotation.z = time * 0.15;
    ringGroup.rotation.y = time * 0.2;
    ringGroup.rotation.x = Math.sin(time * 0.4) * 0.2;
  }

  // Animate Balloons Sway
  if (balloonGroup) {
    balloonGroup.children.forEach(b => {
      b.position.y = b.userData.baseY + Math.sin(time * b.userData.speed + b.userData.phase) * 0.18;
      b.rotation.z = Math.sin(time * 0.8 + b.userData.phase) * 0.1;
    });
  }

  // Animate 3D Cake & Candle Flames Flicker
  if (cakeGroup && cakeGroup.visible) {
    cakeGroup.rotation.y = time * 0.18;

    if (candlesLit) {
      cakeFlames.forEach((flame, idx) => {
        const flick = 1 + Math.sin(time * 18 + idx * 3) * 0.22;
        flame.scale.set(flick, flick * (1 + Math.cos(time * 15) * 0.2), flick);
      });
      if (candleLight) {
        candleLight.intensity = 2.6 + Math.sin(time * 20) * 0.5;
      }
    }
  }

  // Animate 3D Orbiting Photo Cards around Cake
  if (orbitPhotosGroup && orbitPhotosGroup.visible) {
    orbitPhotosGroup.rotation.y = time * 0.22;

    orbitPhotoCards.forEach((card) => {
      // Gentle floating bob
      card.position.y = card.userData.baseY + Math.sin(time * 1.8 + card.userData.phase) * 0.08;
      // Gentle self-spin so both front and back images are revealed dynamically
      card.rotation.y = time * 0.45 + card.userData.phase;
    });
  }

  // Smooth Camera Director Lerping
  const targetCamX = mouseX * 0.6;
  const targetCamY = -mouseY * 0.5;

  camera.position.x += (targetCameraX + targetCamX - camera.position.x) * 0.05;
  camera.position.y += (targetCameraY + targetCamY - camera.position.y) * 0.05;
  camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

  camera.lookAt(0, targetLookAtY, 0);

  renderer.render(scene, camera);
}

// ===== CAMERA DIRECTOR & SCENE SWITCHING =====
function goToScene(index) {
  if (index < 0 || index > 3) return;
  currentSceneIndex = index;

  // Update DOM panels
  const panels = document.querySelectorAll('.scene-panel');
  panels.forEach((p, i) => {
    p.classList.toggle('active', i === index);
  });

  // Update Navigation Dots
  const dots = document.querySelectorAll('.nav-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // Animate scene content fade-in
  const activePanel = panels[index];
  if (activePanel && typeof gsap !== 'undefined') {
    const content = activePanel.querySelector('.scene-content');
    if (content) {
      gsap.fromTo(content,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }
      );
    }
    // Animate flow indicator in (delay a bit)
    const flowInd = activePanel.querySelector('.flow-indicator');
    if (flowInd) {
      gsap.fromTo(flowInd,
        { opacity: 0, y: 14 },
        { opacity: 0.85, y: 0, duration: 0.5, delay: 0.4, ease: 'power2.out' }
      );
    }
  }

  // Direct 3D Camera & Objects based on Scene
  if (index === 0) {
    targetCameraX = 0; targetCameraY = 0; targetCameraZ = 6.2; targetLookAtY = 0;
    if (ringGroup) ringGroup.visible = true;
    if (cakeGroup) cakeGroup.visible = false;
    if (orbitPhotosGroup) orbitPhotosGroup.visible = false;
  } else if (index === 1) {
    targetCameraX = 0; targetCameraY = 0.48; targetCameraZ = 5.4; targetLookAtY = 0.35;
    if (ringGroup) ringGroup.visible = false;
    if (cakeGroup) {
      cakeGroup.visible = true;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(cakeGroup.scale, { x: 0.1, y: 0.1, z: 0.1 }, { x: 0.92, y: 0.92, z: 0.92, duration: 0.9, ease: 'back.out(1.8)' });
      }
    }
    if (orbitPhotosGroup) {
      orbitPhotosGroup.visible = true;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(orbitPhotosGroup.scale, { x: 0.1, y: 0.1, z: 0.1 }, { x: 1, y: 1, z: 1, duration: 1.0, ease: 'back.out(1.6)' });
      }
    }
  } else if (index === 2) {
    targetCameraX = 0; targetCameraY = 0.3; targetCameraZ = 5.5; targetLookAtY = 0;
    if (ringGroup) ringGroup.visible = true;
    if (cakeGroup) cakeGroup.visible = false;
    if (orbitPhotosGroup) orbitPhotosGroup.visible = false;
    if (typeof startLetterTyping === 'function') {
      startLetterTyping();
    }
  } else if (index === 3) {
    targetCameraX = 0; targetCameraY = -0.1; targetCameraZ = 5.0; targetLookAtY = 0;
    if (ringGroup) ringGroup.visible = true;
    if (cakeGroup) cakeGroup.visible = false;
    if (orbitPhotosGroup) orbitPhotosGroup.visible = false;
  }
}

// ===== APPLY THEME ENGINE (CSS + THREE.JS) =====
function applyTheme(themeKey) {
  if (themeKey && THEMES[themeKey]) {
    S.themeId = themeKey;
    currentTheme = THEMES[themeKey];
    S.themeColor1 = currentTheme.p;
    S.themeColor2 = currentTheme.s;
    S.themeAccent = currentTheme.a;
    try {
      localStorage.setItem('birthdaySettings', JSON.stringify(S));
    } catch {}
  }

  const t = currentTheme;
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', S.themeColor1 || t.p);
  root.style.setProperty('--theme-secondary', S.themeColor2 || t.s);
  root.style.setProperty('--theme-accent', S.themeAccent || t.a);
  root.style.setProperty('--theme-gold-dark', t.goldDark || '#b45309');
  root.style.setProperty('--theme-glow', t.glow || 'rgba(245,158,11,0.45)');
  root.style.setProperty('--bg-deep', t.bgDeep || '#06040c');
  root.style.setProperty('--bg-dark', t.bgDark || '#0e081a');
  root.style.setProperty('--bg-card', t.bgCard || 'rgba(16,10,28,0.76)');
  root.style.setProperty('--glass-glow', t.glassGlow || 'rgba(245,158,11,0.35)');

  // Update Three.js lights and materials
  if (pointLight1) pointLight1.color.setHex(t.threeLight1);
  if (pointLight2) pointLight2.color.setHex(t.threeLight2);

  // Update theme pill label & swatch
  const activeLabel = document.getElementById('activeThemeLabel');
  const activeSwatch = document.getElementById('activeThemeSwatch');
  if (activeLabel) activeLabel.textContent = t.name.replace(/[^\w\s&]/gi, '').trim();
  if (activeSwatch) activeSwatch.style.background = `linear-gradient(135deg, ${S.themeColor1 || t.p}, ${S.themeColor2 || t.s})`;

  // Update dropdown buttons
  document.querySelectorAll('.theme-opt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === S.themeId);
  });
}
applyTheme(S.themeId);

// ===== 3D TYPOGRAPHY BUILDER =====
function setup3DTypography() {
  const happyEl = document.getElementById('titleHappy');
  const bdayEl = document.getElementById('titleBirthday');
  const toyouEl = document.getElementById('titleToYou');

  if (happyEl) {
    happyEl.innerHTML = 'Happy'.split('').map(c => `<span class="title-char happy-char">${c}</span>`).join('');
  }
  if (bdayEl) {
    bdayEl.innerHTML = 'Birthday'.split('').map(c => `<span class="title-char bday-char">${c}</span>`).join('');
  }
  if (toyouEl) {
    toyouEl.innerHTML = 'To You'.split('').map(c => c === ' ' ? '&nbsp;' : `<span class="title-char toyou-char">${c}</span>`).join('');
  }
}
setup3DTypography();

// ===== CINEMATIC 3D INTRO ANIMATION TIMELINE =====
let introPlayed = false;

function play3DCinematicIntro() {
  introPlayed = true;
  const introOverlay = document.getElementById('introOverlay');

  // 1. Play magical whoosh + chimes
  sfx.playWhoosh();
  setTimeout(() => sfx.playChime(), 320);

  // 2. Play background music
  if (!isMusicPlaying && bgMusic && bgMusic.src) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicIcon) musicIcon.textContent = '🎵';
      if (eqBars) eqBars.classList.add('playing');
    }).catch(() => {});
  }

  // 3. Three.js Camera 3D Warp Entrance
  if (camera) {
    camera.position.z = 16;
    gsap.to(camera.position, {
      z: 6.2,
      duration: 1.6,
      ease: 'power3.out'
    });
  }

  // 4. Torus Rings 3D Spin & Expansion
  if (ringGroup) {
    ringGroup.visible = true;
    gsap.fromTo(ringGroup.scale, 
      { x: 0.01, y: 0.01, z: 0.01 }, 
      { x: 1, y: 1, z: 1, duration: 1.5, ease: 'back.out(2)' }
    );
    gsap.fromTo(ringGroup.rotation,
      { z: 6, x: 4 },
      { z: 0, x: 0, duration: 1.6, ease: 'power2.out' }
    );
  }

  // 5. Hide Intro Overlay with explosion zoom
  if (introOverlay) {
    gsap.to(introOverlay, {
      opacity: 0,
      scale: 1.3,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        introOverlay.style.display = 'none';
        introOverlay.style.pointerEvents = 'none';
      }
    });
  }

  // 6. Confetti & Supernova Fireworks Burst
  launchConfetti(90);
  setTimeout(() => launchConfetti(140), 450);

  // 7. Letter-by-Letter 3D Sculpted Typography Entrance
  const tl = gsap.timeline({ delay: 0.25 });

  // Pre-Title Badge Drop
  tl.fromTo('#heroBadge', 
    { y: -40, opacity: 0, scale: 0.8 }, 
    { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }
  );

  // 'Happy' Letters Sweep
  tl.fromTo('.happy-char', 
    { y: -35, opacity: 0, scale: 0.4, rotateX: -60 }, 
    { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(1.8)' },
    '-=0.2'
  );

  // 'BIRTHDAY' 3D Letters Heavy Slam Impact
  tl.fromTo('.bday-char', 
    { y: -50, opacity: 0, scale: 2.0, rotateX: 70 }, 
    { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(2)' },
    '-=0.2'
  );

  // 'To You' Flourish
  tl.fromTo('.toyou-char', 
    { y: 25, opacity: 0, scale: 0.5 }, 
    { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.8)' },
    '-=0.2'
  );

  // Recipient Name Medallion Radial Shockwave
  tl.fromTo('#nameWrapper', 
    { scale: 0.4, opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' },
    '-=0.2'
  );

  // Subtitle, Date & CTAs
  tl.fromTo('#specialText, #birthdateWrapper', 
    { y: 20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
    '-=0.3'
  );

  // Flow Indicator Fade In
  tl.fromTo('#flowNext1',
    { y: 16, opacity: 0 },
    { y: 0, opacity: 0.85, duration: 0.55, ease: 'power2.out' },
    '-=0.2'
  );
}

// Intro Button Listeners
const introUnlockBtn = document.getElementById('introUnlockBtn');
if (introUnlockBtn) {
  introUnlockBtn.addEventListener('click', () => {
    play3DCinematicIntro();
  });
}

const btnReplayIntro = document.getElementById('btnReplayIntro');
if (btnReplayIntro) {
  btnReplayIntro.addEventListener('click', () => {
    goToScene(0);
    play3DCinematicIntro();
  });
}

// ===== POPULATE DOM CONTENT =====
document.getElementById('birthdayName').textContent = S.name;
const introForName = document.getElementById('introForName');
if (introForName) introForName.textContent = `For ${S.name} 👑`;

if (S.birthdate && S.showBirthdate) {
  const bd = new Date(S.birthdate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('birthdateDisplay').textContent = bd.toLocaleDateString('en-US', options);
  document.getElementById('birthdateWrapper').style.display = 'inline-flex';
} else {
  document.getElementById('birthdateWrapper').style.display = 'none';
}

document.getElementById('specialText').textContent = S.specialText;

if (S.showWisher && S.wisherName) {
  document.getElementById('wisherSection').style.display = 'block';
  document.getElementById('wisherName').textContent = S.wisherName;
}

// ===== TYPEWRITER NOTE EFFECT =====
function typeText(element, text, speed = 26) {
  return new Promise((resolve) => {
    let index = 0;
    element.textContent = '';
    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

const noteEl = document.getElementById('noteText');
const cursorEl = document.getElementById('typingCursor');
if (noteEl) {
  setTimeout(() => {
    typeText(noteEl, S.birthdayNote, 24).then(() => {
      if (cursorEl) { cursorEl.style.animation = 'none'; cursorEl.style.opacity = '0'; }
    });
  }, 1000);
}

// ===== CONFETTI LAUNCHER =====
function launchConfetti(count = 70) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: count,
      spread: 90,
      origin: { y: 0.6 },
      colors: currentTheme.confetti || ['#f59e0b', '#fbbf24', '#fde68a']
    });
  }
}

// ===== 3D CAKE INTERACTIONS =====
const blowBtn = document.getElementById('blowCandleBtn');
const cutBtn  = document.getElementById('cutCakeBtn');
const wishBanner = document.getElementById('wishBanner');

function triggerBlowCandles() {
  if (!candlesLit) return;
  candlesLit = false;
  sfx.playBlow();

  // Extinguish 3D flames
  cakeFlames.forEach(f => {
    gsap.to(f.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
  });
  if (candleLight) {
    gsap.to(candleLight, { intensity: 0, duration: 0.4 });
  }

  // Celebration
  setTimeout(() => {
    sfx.playChime();
    launchConfetti(120);

    if (blowBtn) blowBtn.style.display = 'none';
    if (cutBtn)  cutBtn.style.display  = 'inline-flex';
    if (wishBanner) wishBanner.style.display = 'flex';
  }, 400);
}

if (blowBtn) blowBtn.addEventListener('click', triggerBlowCandles);

function triggerCutCake() {
  if (cakeCut) return;
  cakeCut = true;
  sfx.playSlice();

  if (cakeGroup) {
    gsap.to(cakeGroup.position, { y: 0.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' });
    gsap.to(cakeGroup.rotation, { y: cakeGroup.rotation.y + 0.65, duration: 0.9, ease: 'back.out(2)' });
  }

  launchConfetti(160);
  if (cutBtn) {
    cutBtn.innerHTML = '<span class="cut-btn-glow"></span><span>🍰</span><span>Cake Served with Love!</span><span>💕</span>';
    cutBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
  }
}

if (cutBtn) cutBtn.addEventListener('click', triggerCutCake);

// ===== FLOW INDICATOR + SWIPE/SCROLL SCENE NAVIGATION =====

// Flow indicator clicks
document.querySelectorAll('.flow-indicator').forEach(indicator => {
  indicator.addEventListener('click', () => {
    const next = parseInt(indicator.dataset.next, 10);
    if (!isNaN(next)) {
      sfx.playChime();
      goToScene(next);
    }
  });
});

// Begin Again button
document.getElementById('btnBeginAgain')?.addEventListener('click', () => {
  goToScene(0);
  sfx.playChime();
});

// Replay intro button (if exists elsewhere)
document.getElementById('btnReplayIntro')?.addEventListener('click', () => {
  goToScene(0);
  play3DCinematicIntro();
});

// ===== SWIPE GESTURE SUPPORT (Mobile) =====
let touchStartY = 0;
let touchStartX = 0;
let isSwiping = false;

document.addEventListener('touchstart', (e) => {
  // Ignore touch on interactive elements
  if (e.target.closest('button, .flow-indicator, .gift-interactive-card, .memories-reel-track')) return;
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  isSwiping = true;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!isSwiping) return;
  isSwiping = false;
  const dy = touchStartY - e.changedTouches[0].clientY;
  const dx = touchStartX - e.changedTouches[0].clientX;

  // Only vertical swipes (dy must dominate)
  if (Math.abs(dy) < 55 || Math.abs(dy) < Math.abs(dx) * 1.5) return;

  if (dy > 0) {
    // Swipe UP → next scene
    if (currentSceneIndex < 3) goToScene(currentSceneIndex + 1);
  } else {
    // Swipe DOWN → previous scene
    if (currentSceneIndex > 0) goToScene(currentSceneIndex - 1);
  }
}, { passive: true });

// ===== MOUSE WHEEL SCENE NAVIGATION (Desktop) =====
let wheelCooldown = false;

window.addEventListener('wheel', (e) => {
  // Ignore wheel on scrollable elements
  if (e.target.closest('.memories-reel-track, .letter-card-wrapper')) return;
  if (wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, 900);

  if (e.deltaY > 40) {
    // Scroll DOWN → next scene
    if (currentSceneIndex < 3) goToScene(currentSceneIndex + 1);
  } else if (e.deltaY < -40) {
    // Scroll UP → prev scene
    if (currentSceneIndex > 0) goToScene(currentSceneIndex - 1);
  }
}, { passive: true });

// ===== GIFT UNBOXING & PRECIOUS MEMORIES REEL =====
const giftCard = document.getElementById('giftCard');
const giftOpenBtn = document.getElementById('giftOpenBtn');
const giftHeading = document.getElementById('giftHeading');
const giftMessage = document.getElementById('giftMessage');

if (giftOpenBtn) {
  giftOpenBtn.addEventListener('click', () => {
    sfx.playChime();
    launchConfetti(160);
    giftHeading.textContent = '🎉 SURPRISE UNLOCKED! 💖';
    giftOpenBtn.innerHTML = '<span>💝 Opened with Love!</span>';
    giftOpenBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
  });
}

// ===== POPULATE ORBIT PHOTO CARDS (Scene 2 Cake) =====
(function setupOrbitCards() {
  const orbitCards = document.querySelectorAll('#orbitRing3D .orbit-card');
  if (!orbitCards.length) return;

  const photosList = (S.photos && S.photos.length > 0) ? S.photos : (DEFAULT_SETTINGS.photos || []);

  orbitCards.forEach((card, idx) => {
    const img = card.querySelector('.oc-img');
    const placeholder = card.querySelector('.oc-placeholder');
    const src = photosList[idx % photosList.length];
    if (src && img) {
      img.src = src;
      img.alt = `Memory ${idx + 1}`;
      if (placeholder) placeholder.style.display = 'none';
    } else {
      if (img) img.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    }
  });
})();

// Populate Precious Memories Reel
(function setupMemoriesReel() {
  const track = document.getElementById('memoriesReelTrack');
  if (!track) return;

  const photosList = (S.photos && S.photos.length > 0) ? S.photos : DEFAULT_SETTINGS.photos;
  if (!photosList || photosList.length === 0) return;

  const captions = [
    'Radiant Smile ✨', 'Precious Moments 💕', 'Forever Shining 🌟',
    'Best Memory 💖', 'Pure Joy 🌸', 'Special Day 🎉',
    'Golden Days 💫', 'Unforgettable 👑', 'Sweet Dreams 🎀',
    'Magical Times 🪄', 'Timeless Love 🌹', 'Celebration Time 🥳'
  ];

  photosList.forEach((src, i) => {
    const card = document.createElement('div');
    card.className = 'reel-card';
    const cap = captions[i % captions.length];
    card.innerHTML = `
      <div class="reel-img-box">
        <img src="${src}" alt="${cap}" loading="lazy" />
      </div>
      <div class="reel-caption">${cap}</div>
    `;
    card.addEventListener('click', () => openLightbox(src, cap));
    track.appendChild(card);
  });
})();

// Quick Gallery Navigation Button
document.getElementById('memoriesQuickBtn')?.addEventListener('click', () => {
  goToScene(3);
  document.getElementById('memoriesReelSection')?.scrollIntoView({ behavior: 'smooth' });
});

// ===== MEMORY LIGHTBOX MODAL =====
const lightbox = document.getElementById('memoryLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

// ===== BACKGROUND MUSIC CONTROLLER =====
const bgMusic = document.getElementById('bgMusic');
const musicPill = document.getElementById('musicPill');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const eqBars = document.getElementById('equalizerBars');
let isMusicPlaying = false;

if (S.musicUrl) bgMusic.src = S.musicUrl;

function toggleMusic() {
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    musicIcon.textContent = '🔇';
    eqBars.classList.remove('playing');
  } else {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      musicIcon.textContent = '🎵';
      eqBars.classList.add('playing');
    }).catch(() => {});
  }
}

if (musicPill) musicPill.addEventListener('click', toggleMusic);
if (musicToggle) musicToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleMusic(); });

document.addEventListener('click', function autoMusicStarter() {
  if (S.musicEnabled && !isMusicPlaying && bgMusic.src) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      musicIcon.textContent = '🎵';
      eqBars.classList.add('playing');
    }).catch(() => {});
  }
  document.removeEventListener('click', autoMusicStarter);
}, { once: true });

// Initialize Three Scene on DOM Ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initThreeScene();
} else {
  document.addEventListener('DOMContentLoaded', initThreeScene);
}
