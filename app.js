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
  birthdate: '2002-08-15',
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
  voiceUrl: '',
  showVoiceNote: true,
  voiceTitle: 'A Special Voice Message from the Heart 💖',
};

function loadSettings() {
  let result = { ...DEFAULT_SETTINGS };

  // 1. Try loading from localStorage
  try {
    const saved = localStorage.getItem('birthdaySettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      result = { ...result, ...parsed };
    }
  } catch (e) {}

  // 2. Check for URL Parameters (Shareable Link)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let fromUrl = false;

    if (urlParams.has('data')) {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(urlParams.get('data')))));
      result = { ...result, ...decoded };
      fromUrl = true;
    } else {
      if (urlParams.has('name')) { result.name = urlParams.get('name'); fromUrl = true; }
      if (urlParams.has('birthdate')) { result.birthdate = urlParams.get('birthdate'); fromUrl = true; }
      if (urlParams.has('specialText')) { result.specialText = urlParams.get('specialText'); fromUrl = true; }
      if (urlParams.has('birthdayNote')) { result.birthdayNote = urlParams.get('birthdayNote'); fromUrl = true; }
      if (urlParams.has('wisherName')) { result.wisherName = urlParams.get('wisherName'); result.showWisher = true; fromUrl = true; }
      if (urlParams.has('theme')) { result.themeId = urlParams.get('theme'); fromUrl = true; }
      if (urlParams.has('giftMessage')) { result.giftMessage = urlParams.get('giftMessage'); fromUrl = true; }
    }

    if (fromUrl) {
      try {
        localStorage.setItem('birthdaySettings', JSON.stringify(result));
      } catch (e) {}
    }
  } catch (e) {}

  result.themeId = result.themeId || 'galaxy-violet';
  result.photos = (result.photos && result.photos.length > 0) ? result.photos : DEFAULT_SETTINGS.photos;
  return result;
}

let S = loadSettings();
let currentTheme = THEMES[S.themeId] || THEMES['galaxy-violet'];

// ===== AUDIO & MUSIC CONTROLS (Top-Level Declaration to prevent TDZ) =====
let bgMusic = null;
let musicPill = null;
let musicToggle = null;
let musicIcon = null;
let eqBars = null;
let isMusicPlaying = false;

function initMusicElements() {
  if (!bgMusic) bgMusic = document.getElementById('bgMusic');
  if (!musicPill) musicPill = document.getElementById('musicPill');
  if (!musicToggle) musicToggle = document.getElementById('musicToggle');
  if (!musicIcon) musicIcon = document.getElementById('musicIcon');
  if (!eqBars) eqBars = document.getElementById('equalizerBars');
  if (bgMusic && S.musicUrl && !bgMusic.src) {
    bgMusic.src = S.musicUrl;
  }
}

function toggleMusic() {
  initMusicElements();
  if (!bgMusic) return;
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    if (musicIcon) musicIcon.textContent = '🔇';
    if (eqBars) eqBars.classList.remove('playing');
  } else {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicIcon) musicIcon.textContent = '🎵';
      if (eqBars) eqBars.classList.add('playing');
    }).catch(() => {});
  }
}

function setupMusicListeners() {
  initMusicElements();
  if (musicPill) musicPill.onclick = toggleMusic;
  if (musicToggle) musicToggle.onclick = (e) => { e.stopPropagation(); toggleMusic(); };

  document.addEventListener('click', function autoMusicStarter() {
    initMusicElements();
    if (S.musicEnabled && !isMusicPlaying && bgMusic && bgMusic.src) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        if (musicIcon) musicIcon.textContent = '🎵';
        if (eqBars) eqBars.classList.add('playing');
      }).catch(() => {});
    }
    document.removeEventListener('click', autoMusicStarter);
  }, { once: true });
}

// ===== GIFT BOX & UNBOXING TOP-LEVEL DECLARATIONS =====
let isGiftUnboxed = false;
let giftBoxVisual = null;
let giftLidWrap = null;
let revealedGiftCard = null;
let giftBoxRevealedImg = null;
let revealedGiftCaption = null;
let giftOpenBtn = null;
let giftHeading = null;
let giftMessage = null;

function initGiftElements() {
  if (!giftBoxVisual) giftBoxVisual = document.getElementById('giftBoxVisual');
  if (!giftLidWrap) giftLidWrap = document.getElementById('giftLidWrap');
  if (!revealedGiftCard) revealedGiftCard = document.getElementById('revealedGiftCard');
  if (!giftBoxRevealedImg) giftBoxRevealedImg = document.getElementById('giftBoxRevealedImg');
  if (!revealedGiftCaption) revealedGiftCaption = document.getElementById('revealedGiftCaption');
  if (!giftOpenBtn) giftOpenBtn = document.getElementById('giftOpenBtn');
  if (!giftHeading) giftHeading = document.getElementById('giftHeading');
  if (!giftMessage) giftMessage = document.getElementById('giftMessage');
}

function getSurpriseGiftPhoto() {
  if (S.giftPhoto && S.giftPhoto.trim()) return S.giftPhoto;
  if (S.photo && S.photo.trim()) return S.photo;
  if (S.photos && S.photos.length > 0 && S.photos[0]) return S.photos[0];
  return (DEFAULT_SETTINGS && (DEFAULT_SETTINGS.giftPhoto || DEFAULT_SETTINGS.photo)) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
}

function updateGiftSurprisePhoto() {
  initGiftElements();
  const imgSrc = getSurpriseGiftPhoto();
  if (giftBoxRevealedImg) {
    giftBoxRevealedImg.src = imgSrc;
  }
  if (revealedGiftCaption) {
    revealedGiftCaption.textContent = S.name ? (`For ${S.name} 💖`) : 'Wrapped with Love 💕';
  }
}

function triggerGiftUnbox() {
  initGiftElements();
  if (isGiftUnboxed) {
    const imgSrc = getSurpriseGiftPhoto();
    openLightbox(imgSrc, (S.name ? `Special Surprise for ${S.name}` : 'Special Surprise'));
    return;
  }

  isGiftUnboxed = true;
  if (typeof sfx !== 'undefined' && sfx) {
    sfx.playWhoosh();
    setTimeout(() => sfx.playChime(), 200);
  }

  updateGiftSurprisePhoto();

  // 1. Box slight wiggle / anticipating shake
  if (typeof gsap !== 'undefined') {
    gsap.to('#giftBoxBody', {
      x: 6,
      duration: 0.06,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.to('#giftBoxBody', { x: 0, duration: 0.1 });
      }
    });

    // 2. 3D Lid flies off and spins upwards
    if (giftLidWrap) {
      gsap.to(giftLidWrap, {
        y: -130,
        x: 35,
        rotationX: -110,
        rotationZ: 45,
        opacity: 0,
        scale: 0.8,
        duration: 0.95,
        ease: 'power2.out'
      });
    }

    // 3. Floating surprise photo emerges from inside the box
    if (revealedGiftCard) {
      revealedGiftCard.style.display = 'block';
      gsap.fromTo(revealedGiftCard,
        { scale: 0.15, y: 60, opacity: 0, rotationZ: -12 },
        { scale: 1, y: -70, opacity: 1, rotationZ: 0, duration: 1.15, delay: 0.15, ease: 'back.out(2.2)' }
      );
    }
  } else {
    if (giftLidWrap) giftLidWrap.style.display = 'none';
    if (revealedGiftCard) revealedGiftCard.style.display = 'block';
  }

  // 4. Confetti Celebration
  launchConfetti(220);

  // 5. Update info panel
  if (giftHeading) {
    giftHeading.textContent = '🎉 SURPRISE UNLOCKED! 💖';
  }
  if (giftOpenBtn) {
    giftOpenBtn.innerHTML = `
      <span class="btn-glow-layer"></span>
      <span class="btn-icon">🔍</span>
      <span class="btn-text">Tap Photo to Enlarge</span>
      <span class="btn-sparkle">✨</span>
    `;
    giftOpenBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
    giftOpenBtn.style.borderColor = 'rgba(52, 211, 153, 0.6)';
    giftOpenBtn.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
  }
}

function setupGiftListeners() {
  initGiftElements();
  if (giftOpenBtn) giftOpenBtn.onclick = triggerGiftUnbox;
  if (giftBoxVisual) giftBoxVisual.onclick = triggerGiftUnbox;
  if (revealedGiftCard) {
    revealedGiftCard.onclick = (e) => {
      e.stopPropagation();
      const imgSrc = getSurpriseGiftPhoto();
      openLightbox(imgSrc, (S.name ? `Special Surprise for ${S.name}` : 'Special Surprise'));
    };
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupMusicListeners();
    setupGiftListeners();
  });
} else {
  setupMusicListeners();
  setupGiftListeners();
}

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
  playSparklePop() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = 1200 + Math.random() * 800;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
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

  // Helper: Create Smooth 3D Heart Geometry
  function create3DHeartGeometry(size = 0.5) {
    const shape = new THREE.Shape();
    const d = size;
    // Parametric rounded heart contour
    shape.moveTo(0, 0.35 * d);
    shape.bezierCurveTo(0, 0.65 * d, -0.55 * d, 0.85 * d, -0.55 * d, 0.38 * d);
    shape.bezierCurveTo(-0.55 * d, 0.08 * d, -0.28 * d, -0.28 * d, 0, -0.65 * d);
    shape.bezierCurveTo(0.28 * d, -0.28 * d, 0.55 * d, 0.08 * d, 0.55 * d, 0.38 * d);
    shape.bezierCurveTo(0.55 * d, 0.85 * d, 0, 0.65 * d, 0, 0.35 * d);

    const extrudeSettings = {
      depth: 0.12 * d,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05 * d,
      bevelThickness: 0.05 * d
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }

  // 2. 3D Floating Royal Gemstone Hearts & Stardust Crystals
  ringGroup = new THREE.Group();

  // Multi-sized 3D Floating Hearts orbiting in a majestic framing halo around the scene
  const heartSizes = [0.85, 1.1, 0.7, 0.95, 0.8, 1.2, 0.65, 0.9, 0.75, 1.05, 0.6, 0.85];
  const heartCount = heartSizes.length;

  for (let h = 0; h < heartCount; h++) {
    const size = heartSizes[h];
    const geo = create3DHeartGeometry(size);

    // Luxury Crystal Material with Refraction & Clearcoat
    const isRuby = h % 3 === 0;
    const isGold = h % 3 === 1;

    const heartMat = new THREE.MeshPhysicalMaterial({
      color: isRuby ? (currentTheme.threeLight2 || 0xf43f5e) : (isGold ? 0xffd166 : (currentTheme.threeLight1 || 0xd946ef)),
      emissive: isRuby ? 0x9f1239 : (isGold ? 0xb45309 : 0x701a75),
      emissiveIntensity: 0.28,
      metalness: 0.18,
      roughness: 0.12,
      transmission: 0.55,
      thickness: 0.5,
      ior: 1.52,
      transparent: true,
      opacity: 0.86,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06
    });

    const heartMesh = new THREE.Mesh(geo, heartMat);

    // Golden Filigree Edge Outline
    const edgeGeo = new THREE.EdgesGeometry(geo, 30);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffe699,
      transparent: true,
      opacity: 0.65
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    heartMesh.add(edgeLine);

    // Position in a wide framing ellipse around the typography (center text remains clean & readable)
    const angle = (Math.PI * 2 / heartCount) * h;
    const radX = 3.2 + (h % 3) * 0.7; // Wide horizontal radius
    const radY = 2.1 + (h % 2) * 0.5; // Vertical radius
    const x = Math.cos(angle) * radX;
    const y = Math.sin(angle) * radY + 0.1;
    const z = -1.2 - ((h % 4) * 0.7); // Placed at pleasant background depth (-1.2 to -3.3)

    heartMesh.position.set(x, y, z);
    heartMesh.rotation.z = (Math.random() - 0.5) * 0.5;
    heartMesh.rotation.y = (Math.random() - 0.5) * 0.8;
    heartMesh.userData = {
      isHeart: true,
      phase: h * 1.3,
      baseY: y,
      speed: 0.4 + (h % 3) * 0.25
    };

    ringGroup.add(heartMesh);
  }

  // Floating 3D Crystal Diamonds
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffe066,
    emissiveIntensity: 0.25,
    metalness: 0.95,
    roughness: 0.08,
    transparent: true,
    opacity: 0.95
  });

  for (let c = 0; c < 8; c++) {
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), crystalMat);
    const angle = (Math.PI * 2 / 8) * c + 0.3;
    crystal.position.set(Math.cos(angle) * 4.2, Math.sin(angle) * 2.8, -1.5 - (Math.random() * 1.8));
    crystal.userData = { isCrystal: true, phase: c * 1.1, baseY: Math.sin(angle) * 2.8 };
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

// ===== 📱 MOBILE GYROSCOPE & MOUSE 3D PARALLAX =====
let gyroTiltX = 0, gyroTiltY = 0;
let currentGyroX = 0, currentGyroY = 0;
let hasGyro = false;

function handleDeviceOrientation(e) {
  if (e.gamma === null || e.beta === null) return;
  hasGyro = true;
  // Gamma: left-to-right tilt (-90 to 90 deg) -> clamped to [-35, 35]
  const clampedGamma = Math.max(-35, Math.min(35, e.gamma));
  gyroTiltX = (clampedGamma / 35) * 1.1;

  // Beta: front-to-back tilt (-180 to 180 deg). Standard holding angle is ~48 deg
  const betaOffset = e.beta - 48;
  const clampedBeta = Math.max(-30, Math.min(30, betaOffset));
  gyroTiltY = (-clampedBeta / 30) * 0.85;
}

function initGyroscope() {
  if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }
  }
}
initGyroscope();

// ===== 🪄 MAGIC CARPET & STARDUST WAND TRAIL =====
let lastStardustTime = 0;
let lastStardustX = 0, lastStardustY = 0;
const STARDUST_CHARS = ['✦', '⋆', '✨', '•', '✧', '💖', '★'];

function spawnStardust(x, y) {
  const now = performance.now();
  if (now - lastStardustTime < 32) return;
  const dist = Math.hypot(x - lastStardustX, y - lastStardustY);
  if (dist < 10) return;

  lastStardustTime = now;
  lastStardustX = x;
  lastStardustY = y;

  const count = Math.random() > 0.5 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = 'magic-stardust-particle';
    star.textContent = STARDUST_CHARS[Math.floor(Math.random() * STARDUST_CHARS.length)];
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    const sx = (Math.random() - 0.5) * 36;
    const sy = (Math.random() - 0.5) * 36 - 12;
    const srot = (Math.random() - 0.5) * 90;

    star.style.setProperty('--sx', `${sx}px`);
    star.style.setProperty('--sy', `${sy}px`);
    star.style.setProperty('--srot', `${srot}deg`);

    document.body.appendChild(star);
    setTimeout(() => star.remove(), 900);
  }
}

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

  const glow = document.getElementById('cursorGlow');
  if (glow) {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }
  spawnStardust(e.clientX, e.clientY);
}

function onTouchMove(e) {
  if (e.touches.length > 0) {
    mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;

    spawnStardust(e.touches[0].clientX, e.touches[0].clientY);
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

  // Smooth Gyroscope & Mouse Parallax Interpolation
  currentGyroX += (gyroTiltX - currentGyroX) * 0.08;
  currentGyroY += (gyroTiltY - currentGyroY) * 0.08;

  const activeParallaxX = hasGyro ? currentGyroX : (mouseX * 0.6);
  const activeParallaxY = hasGyro ? currentGyroY : (-mouseY * 0.5);

  // Rotate 3D Floating Love Hearts & Crystals (Reacts to Phone Tilt)
  if (ringGroup && ringGroup.visible) {
    ringGroup.rotation.y = time * 0.14 + activeParallaxX * 0.18;
    ringGroup.rotation.z = Math.sin(time * 0.25) * 0.08 + activeParallaxX * 0.06;
    ringGroup.rotation.x = Math.sin(time * 0.3) * 0.06 + activeParallaxY * 0.12;

    ringGroup.children.forEach(obj => {
      if (obj.userData && obj.userData.isHeart) {
        obj.rotation.y = time * (obj.userData.speed || 0.45) + obj.userData.phase + activeParallaxX * 0.3;
        obj.rotation.x = Math.sin(time * 0.65 + obj.userData.phase) * 0.18 + activeParallaxY * 0.2;
        obj.position.y = obj.userData.baseY + Math.sin(time * 1.35 + obj.userData.phase) * 0.14;
      } else if (obj.userData && obj.userData.isCrystal) {
        obj.rotation.y = time * 0.75 + obj.userData.phase;
        obj.rotation.z = time * 0.45;
        obj.position.y = obj.userData.baseY + Math.sin(time * 1.2 + obj.userData.phase) * 0.12;
      }
    });
  }

  // Animate Balloons Sway
  if (balloonGroup) {
    balloonGroup.children.forEach(b => {
      b.position.y = b.userData.baseY + Math.sin(time * b.userData.speed + b.userData.phase) * 0.18;
      b.rotation.z = Math.sin(time * 0.8 + b.userData.phase) * 0.1 + activeParallaxX * 0.08;
    });
  }

  // Animate 3D Cake & Candle Flames Flicker
  if (cakeGroup && cakeGroup.visible) {
    cakeGroup.rotation.y = time * 0.18 + activeParallaxX * 0.15;
    cakeGroup.rotation.x = activeParallaxY * 0.1;

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
    orbitPhotosGroup.rotation.y = time * 0.22 + activeParallaxX * 0.18;

    orbitPhotoCards.forEach((card) => {
      // Gentle floating bob
      card.position.y = card.userData.baseY + Math.sin(time * 1.8 + card.userData.phase) * 0.08;
      // Gentle self-spin so both front and back images are revealed dynamically
      card.rotation.y = time * 0.45 + card.userData.phase;
    });
  }

  // Smooth Camera Director Lerping with Gyro / Mouse Parallax
  camera.position.x += (targetCameraX + activeParallaxX - camera.position.x) * 0.055;
  camera.position.y += (targetCameraY + activeParallaxY - camera.position.y) * 0.055;
  camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

  camera.lookAt(0, targetLookAtY, 0);

  renderer.render(scene, camera);
}

function getResponsiveCamZ(baseZ) {
  const aspect = window.innerWidth / window.innerHeight;
  if (aspect < 0.6) {
    return baseZ * 1.36; // standard mobile portrait
  } else if (aspect < 0.85) {
    return baseZ * 1.18; // narrow tablet or fold phone
  }
  return baseZ;
}
// ===== CAMERA DIRECTOR & SCENE SWITCHING =====
function goToScene(index) {
  if (index < 0 || index > 3) return;
  currentSceneIndex = index;

  const isMobile = window.innerWidth < 768 || (window.innerWidth / window.innerHeight) < 0.75;

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
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
    // Animate flow indicator in (delay a bit)
    const flowInd = activePanel.querySelector('.flow-indicator');
    if (flowInd) {
      gsap.fromTo(flowInd,
        { opacity: 0, y: 12 },
        { opacity: 0.85, y: 0, duration: 0.45, delay: 0.35, ease: 'power2.out' }
      );
    }
  }

  // Direct 3D Camera & Objects based on Scene
  if (index === 0) {
    targetCameraX = 0;
    targetCameraY = isMobile ? 0.15 : 0;
    targetCameraZ = getResponsiveCamZ(6.2);
    targetLookAtY = 0;
    if (ringGroup) ringGroup.visible = true;
    if (cakeGroup) cakeGroup.visible = false;
    if (orbitPhotosGroup) orbitPhotosGroup.visible = false;
  } else if (index === 1) {
    targetCameraX = 0;
    targetCameraY = isMobile ? 0.36 : 0.48;
    targetCameraZ = getResponsiveCamZ(5.4);
    targetLookAtY = isMobile ? 0.58 : 0.35;
    if (ringGroup) ringGroup.visible = false;

    const cakeScale = isMobile ? 0.75 : 0.92;
    const orbitScale = isMobile ? 0.82 : 1.0;

    if (cakeGroup) {
      cakeGroup.visible = true;
      cakeGroup.position.y = isMobile ? 0.42 : 0;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(cakeGroup.scale,
          { x: 0.1, y: 0.1, z: 0.1 },
          { x: cakeScale, y: cakeScale, z: cakeScale, duration: 0.85, ease: 'back.out(1.8)' }
        );
      }
    }
    if (orbitPhotosGroup) {
      orbitPhotosGroup.visible = true;
      orbitPhotosGroup.position.y = isMobile ? 0.45 : 0.05;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(orbitPhotosGroup.scale,
          { x: 0.1, y: 0.1, z: 0.1 },
          { x: orbitScale, y: orbitScale, z: orbitScale, duration: 0.95, ease: 'back.out(1.6)' }
        );
      }
    }
  } else if (index === 2) {
    targetCameraX = 0;
    targetCameraY = 0.3;
    targetCameraZ = getResponsiveCamZ(5.5);
    targetLookAtY = 0;
    if (ringGroup) ringGroup.visible = true;
    if (cakeGroup) cakeGroup.visible = false;
    if (orbitPhotosGroup) orbitPhotosGroup.visible = false;
    if (typeof startLetterTyping === 'function') {
      startLetterTyping();
    }
  } else if (index === 3) {
    targetCameraX = 0;
    targetCameraY = -0.1;
    targetCameraZ = getResponsiveCamZ(5.0);
    targetLookAtY = 0;
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

  if (ringGroup) {
    ringGroup.children.forEach((obj, idx) => {
      if (obj.material && obj.userData && obj.userData.isHeart) {
        const hex = (idx % 2 === 0) ? t.threeLight1 : t.threeLight2;
        obj.material.color.setHex(hex);
        obj.material.emissive.setHex(hex);
      }
    });
  }

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
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
        }
      }).catch(() => {});
    }
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

// ===== TYPEWRITER NOTE EFFECT =====
let activeTypewriterInterval = null;
function typeText(element, text, speed = 26) {
  if (activeTypewriterInterval) {
    clearInterval(activeTypewriterInterval);
    activeTypewriterInterval = null;
  }
  return new Promise((resolve) => {
    let index = 0;
    element.textContent = '';
    if (!text) { resolve(); return; }
    activeTypewriterInterval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(activeTypewriterInterval);
        activeTypewriterInterval = null;
        resolve();
      }
    }, speed);
  });
}

// ===== REAL-TIME LIVE SYNC TOAST NOTIFICATION =====
function showLiveToast(text) {
  let toast = document.getElementById('liveSyncToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'liveSyncToast';
    toast.className = 'live-sync-toast';
    toast.innerHTML = '<span class="live-sync-indicator"></span><span id="liveSyncText"></span>';
    document.body.appendChild(toast);
  }
  const textEl = document.getElementById('liveSyncText');
  if (textEl) textEl.textContent = text;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ===== ⏳ MAGICAL LIVE TIME TRAVELER (AGE & MAGIC CLOCK) =====
let magicClockInterval = null;

function updateMagicClock() {
  const clockCard = document.getElementById('magicClockCard');
  if (!clockCard) return;

  const clockYears = document.getElementById('clockYears');
  const clockDays = document.getElementById('clockDays');
  const clockHours = document.getElementById('clockHours');
  const clockSeconds = document.getElementById('clockSeconds');
  const clockNextBdayText = document.getElementById('clockNextBdayText');

  // Check if birthdate is provided
  if (!S.birthdate || S.showBirthdate === false) {
    clockCard.style.display = 'none';
    return;
  }

  const birth = new Date(S.birthdate + 'T00:00:00');
  const now = new Date();

  if (isNaN(birth.getTime()) || birth > now) {
    clockCard.style.display = 'none';
    return;
  }

  clockCard.style.display = 'flex';

  const diffMs = now.getTime() - birth.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Exact completed years
  let years = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    years--;
  }

  // Next Birthday Countdown
  let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) {
    nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }

  const diffToNext = nextBday.getTime() - now.getTime();
  const daysToNext = Math.floor(diffToNext / (1000 * 60 * 60 * 24));
  const hoursToNext = Math.floor((diffToNext / (1000 * 60 * 60)) % 24);
  const minsToNext = Math.floor((diffToNext / (1000 * 60)) % 60);
  const secsToNext = Math.floor((diffToNext / 1000) % 60);

  if (clockYears) clockYears.textContent = Math.max(0, years);
  if (clockDays) clockDays.textContent = totalDays.toLocaleString();
  if (clockHours) clockHours.textContent = totalHours.toLocaleString();
  if (clockSeconds) clockSeconds.textContent = totalSeconds.toLocaleString();

  if (clockNextBdayText) {
    if (daysToNext === 0 && now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate()) {
      clockNextBdayText.textContent = '🎉 TODAY IS THE BIG DAY! HAPPY BIRTHDAY! 🥳💖';
    } else {
      clockNextBdayText.textContent = `✨ Next Birthday in ${daysToNext}d ${hoursToNext}h ${minsToNext}m ${secsToNext}s 🎂`;
    }
  }
}

function startMagicClock() {
  updateMagicClock();
  if (!magicClockInterval) {
    magicClockInterval = setInterval(updateMagicClock, 1000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMagicClock);
} else {
  startMagicClock();
}

// ===== DYNAMIC LIVE UPDATE DISPATCHER =====
let isFirstLiveRun = true;
function applyLiveUpdate(newSettings, isInitial = false) {
  if (!newSettings || typeof newSettings !== 'object') return;
  const prevName = S.name;
  const prevTheme = S.themeId;

  S = { ...DEFAULT_SETTINGS, ...S, ...newSettings };
  try {
    localStorage.setItem('birthdaySettings', JSON.stringify(S));
  } catch (e) {}

  // 1. Recipient Name
  const bdayNameEl = document.getElementById('birthdayName');
  if (bdayNameEl) bdayNameEl.textContent = S.name || 'Your Name';
  const introForNameEl = document.getElementById('introForName');
  if (introForNameEl) introForNameEl.textContent = `For ${S.name || 'Someone Very Special'} 👑`;

  // 2. Birthdate & Magic Time Clock
  const bdWrapper = document.getElementById('birthdateWrapper');
  const bdDisplay = document.getElementById('birthdateDisplay');
  if (bdWrapper && bdDisplay) {
    if (S.birthdate && S.showBirthdate !== false) {
      try {
        const bd = new Date(S.birthdate + 'T00:00:00');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        bdDisplay.textContent = bd.toLocaleDateString('en-US', options);
        bdWrapper.style.display = 'inline-flex';
      } catch (e) {
        bdWrapper.style.display = 'none';
      }
    } else {
      bdWrapper.style.display = 'none';
    }
  }
  if (typeof updateMagicClock === 'function') updateMagicClock();

  // 3. Special Subtitle Text
  const specialTextEl = document.getElementById('specialText');
  if (specialTextEl) specialTextEl.textContent = S.specialText || '';

  // 4. Wisher Section
  const wisherSec = document.getElementById('wisherSection');
  const wisherNameEl = document.getElementById('wisherName');
  if (wisherSec && wisherNameEl) {
    if (S.showWisher && S.wisherName) {
      wisherSec.style.display = 'block';
      wisherNameEl.textContent = S.wisherName;
    } else {
      wisherSec.style.display = 'none';
    }
  }

  // 5. Birthday Note (Typewriter)
  const noteEl = document.getElementById('noteText');
  const cursorEl = document.getElementById('typingCursor');
  if (noteEl) {
    if (isInitial || isFirstLiveRun) {
      setTimeout(() => {
        typeText(noteEl, S.birthdayNote || '', 24).then(() => {
          if (cursorEl) { cursorEl.style.animation = 'none'; cursorEl.style.opacity = '0'; }
        });
      }, 1000);
    } else {
      typeText(noteEl, S.birthdayNote || '', 18).then(() => {
        if (cursorEl) { cursorEl.style.animation = 'none'; cursorEl.style.opacity = '0'; }
      });
    }
  }

  // 6. Gift Message
  const giftMsgEl = document.getElementById('giftMessage');
  if (giftMsgEl) giftMsgEl.textContent = S.giftMessage || DEFAULT_SETTINGS.giftMessage;

  // 7. Theme
  if (S.themeId) {
    applyTheme(S.themeId);
  }
  const root = document.documentElement;
  if (S.themeColor1) root.style.setProperty('--theme-primary', S.themeColor1);
  if (S.themeColor2) root.style.setProperty('--theme-secondary', S.themeColor2);
  if (S.themeAccent) root.style.setProperty('--theme-accent', S.themeAccent);

  // 8. Photos & Galleries
  if (typeof window.setupOrbitCards === 'function') window.setupOrbitCards();
  if (typeof window.setupMemoriesReel === 'function') window.setupMemoriesReel();
  if (typeof updateGiftSurprisePhoto === 'function') updateGiftSurprisePhoto();
  if (typeof window.updateVoiceUI === 'function') window.updateVoiceUI();

  // 9. Music URL
  if (typeof bgMusic !== 'undefined' && bgMusic && S.musicUrl && bgMusic.src !== S.musicUrl) {
    const wasPlaying = typeof isMusicPlaying !== 'undefined' && isMusicPlaying;
    bgMusic.src = S.musicUrl;
    if (wasPlaying && S.musicEnabled) {
      bgMusic.play().catch(() => {});
    }
  }

  // 10. Live sync toast feedback
  if (!isInitial && !isFirstLiveRun) {
    showLiveToast(`⚡ Live Updated: "${S.name}"`);
  }
  isFirstLiveRun = false;
}

// ===== 🎙️ LUXURY VOICE NOTE CAPSULE PLAYER =====
let isVoicePlaying = false;

function initVoicePlayer() {
  const voiceNoteCard = document.getElementById('voiceNoteCard');
  const voiceAudioPlayer = document.getElementById('voiceAudioPlayer');
  const btnVoicePlay = document.getElementById('btnVoicePlay');
  const voicePlayIcon = document.getElementById('voicePlayIcon');
  const voiceTitleDisplay = document.getElementById('voiceTitleDisplay');
  const voiceDurationDisplay = document.getElementById('voiceDurationDisplay');
  const voiceProgressFill = document.getElementById('voiceProgressFill');
  const voiceProgressTrack = document.getElementById('voiceProgressTrack');

  if (!voiceNoteCard || !voiceAudioPlayer) return;

  function updateVoiceUI() {
    if (S.showVoiceNote !== false && S.voiceUrl && S.voiceUrl.trim()) {
      voiceNoteCard.style.display = 'block';
      if (voiceTitleDisplay) {
        voiceTitleDisplay.textContent = S.voiceTitle || 'A Special Message from the Heart 💖';
      }
      if (voiceAudioPlayer.src !== S.voiceUrl && !voiceAudioPlayer.src.endsWith(S.voiceUrl)) {
        voiceAudioPlayer.src = S.voiceUrl;
        voiceAudioPlayer.load();
      }
    } else {
      voiceNoteCard.style.display = 'none';
      if (!voiceAudioPlayer.paused) {
        voiceAudioPlayer.pause();
      }
    }
  }
  window.updateVoiceUI = updateVoiceUI;

  function fmtTime(secs) {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  btnVoicePlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!voiceAudioPlayer.src) return;

    if (voiceAudioPlayer.paused) {
      voiceAudioPlayer.play().then(() => {
        isVoicePlaying = true;
        voiceNoteCard.classList.add('playing');
        if (voicePlayIcon) voicePlayIcon.textContent = '⏸';
        if (typeof bgMusic !== 'undefined' && bgMusic && typeof gsap !== 'undefined') {
          gsap.to(bgMusic, { volume: 0.12, duration: 0.5 });
        }
      }).catch(err => console.log('Audio play error:', err));
    } else {
      voiceAudioPlayer.pause();
      isVoicePlaying = false;
      voiceNoteCard.classList.remove('playing');
      if (voicePlayIcon) voicePlayIcon.textContent = '▶';
      if (typeof bgMusic !== 'undefined' && bgMusic && typeof gsap !== 'undefined') {
        gsap.to(bgMusic, { volume: 0.65, duration: 0.5 });
      }
    }
  });

  voiceAudioPlayer.addEventListener('timeupdate', () => {
    const cur = voiceAudioPlayer.currentTime;
    const dur = voiceAudioPlayer.duration || 0;
    if (voiceDurationDisplay) {
      voiceDurationDisplay.textContent = dur > 0 ? `${fmtTime(cur)} / ${fmtTime(dur)}` : fmtTime(cur);
    }
    if (voiceProgressFill && dur > 0) {
      voiceProgressFill.style.width = `${(cur / dur) * 100}%`;
    }
  });

  voiceAudioPlayer.addEventListener('loadedmetadata', () => {
    if (voiceDurationDisplay) {
      voiceDurationDisplay.textContent = `0:00 / ${fmtTime(voiceAudioPlayer.duration)}`;
    }
  });

  voiceAudioPlayer.addEventListener('ended', () => {
    isVoicePlaying = false;
    voiceNoteCard.classList.remove('playing');
    if (voicePlayIcon) voicePlayIcon.textContent = '▶';
    if (voiceProgressFill) voiceProgressFill.style.width = '0%';
    if (typeof bgMusic !== 'undefined' && bgMusic && typeof gsap !== 'undefined') {
      gsap.to(bgMusic, { volume: 0.65, duration: 0.6 });
    }
  });

  voiceProgressTrack?.addEventListener('click', (e) => {
    if (!voiceAudioPlayer.duration) return;
    const rect = voiceProgressTrack.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    voiceAudioPlayer.currentTime = pos * voiceAudioPlayer.duration;
  });

  updateVoiceUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVoicePlayer);
} else {
  initVoicePlayer();
}

// Initial populate
applyLiveUpdate(S, true);

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


// ===== POPULATE ORBIT PHOTO CARDS (Scene 2 Cake) =====
function setupOrbitCards() {
  const orbitCards = document.querySelectorAll('#orbitRing3D .orbit-card');
  if (!orbitCards.length) return;

  const photosList = (S.photos && S.photos.length > 0) ? S.photos : (DEFAULT_SETTINGS.photos || []);

  orbitCards.forEach((card, idx) => {
    const img = card.querySelector('.oc-img');
    const placeholder = card.querySelector('.oc-placeholder');
    const src = photosList[idx % photosList.length];
    if (src && img) {
      img.src = src;
      img.style.display = 'block';
      img.alt = `Memory ${idx + 1}`;
      if (placeholder) placeholder.style.display = 'none';
    } else {
      if (img) img.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    }
  });
}
window.setupOrbitCards = setupOrbitCards;
setupOrbitCards();

// Populate Precious Memories Reel
function setupMemoriesReel() {
  const track = document.getElementById('memoriesReelTrack');
  if (!track) return;

  const photosList = (S.photos && S.photos.length > 0) ? S.photos : DEFAULT_SETTINGS.photos;
  if (!photosList || photosList.length === 0) return;

  track.innerHTML = '';
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
}
window.setupMemoriesReel = setupMemoriesReel;
setupMemoriesReel();

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


// ===== REAL-TIME SERVER-SENT EVENTS (SSE) & STORAGE SYNC =====
function initRealtimeSync() {
  // 1. Initial REST API Fetch
  fetch('/api/settings')
    .then(res => res.json())
    .then(json => {
      if (json.success && json.data) {
        applyLiveUpdate(json.data, true);
      }
    })
    .catch(err => console.log('Offline/Standalone mode:', err));

  // 2. Cross-tab LocalStorage Sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'birthdaySettings' && e.newValue) {
      try {
        const updated = JSON.parse(e.newValue);
        applyLiveUpdate(updated, false);
      } catch (err) {}
    }
  });

  // 3. Server-Sent Events (SSE) Live Stream
  let sseSource = null;
  let reconnectTimer = null;

  function connectSSE() {
    if (typeof EventSource === 'undefined') return;
    try {
      if (sseSource) sseSource.close();
      sseSource = new EventSource('/api/events');

      sseSource.addEventListener('initial', (e) => {
        try {
          const data = JSON.parse(e.data);
          applyLiveUpdate(data, true);
        } catch (err) {}
      });

      sseSource.addEventListener('settings_updated', (e) => {
        try {
          const data = JSON.parse(e.data);
          applyLiveUpdate(data, false);
        } catch (err) {}
      });

      sseSource.onerror = () => {
        sseSource.close();
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connectSSE, 3500);
      };
    } catch (e) {
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connectSSE, 4000);
    }
  }

  connectSSE();
}

initRealtimeSync();

// Initialize Three Scene on DOM Ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initThreeScene();
} else {
  document.addEventListener('DOMContentLoaded', initThreeScene);
}

// ===== 📸 ROYAL KEEPSAKE SOUVENIR CARD GENERATOR (1080x1920 HD STORY CARD) =====
async function generateRoyalSouvenirCard() {
  const btn = document.getElementById('btnDownloadSouvenir');
  const origBtnHTML = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `
      <span class="souvenir-icon-wrap" style="animation: spin 1s linear infinite;">⏳</span>
      <span class="souvenir-text-group">
        <span class="souvenir-title">Generating 4K Royal Card...</span>
        <span class="souvenir-sub">Crafting your golden keepsake ✨</span>
      </span>
    `;
  }

  try {
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1. Background Gradient (Deep Majestic Cosmic Velvet)
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a0314');
    bgGrad.addColorStop(0.35, '#19062b');
    bgGrad.addColorStop(0.7, '#2a0845');
    bgGrad.addColorStop(1, '#0e021a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Cosmic Nebula Radial Glow
    const radGlow1 = ctx.createRadialGradient(W / 2, 450, 50, W / 2, 450, 500);
    radGlow1.addColorStop(0, 'rgba(236, 72, 153, 0.35)');
    radGlow1.addColorStop(0.5, 'rgba(168, 85, 247, 0.18)');
    radGlow1.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow1;
    ctx.fillRect(0, 0, W, H);

    const radGlow2 = ctx.createRadialGradient(W / 2, 1400, 50, W / 2, 1400, 600);
    radGlow2.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
    radGlow2.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow2;
    ctx.fillRect(0, 0, W, H);

    // 3. Stardust Particles & Sparkles
    for (let i = 0; i < 220; i++) {
      const px = Math.random() * W;
      const py = Math.random() * H;
      const pr = Math.random() * 2.2 + 0.5;
      const alpha = Math.random() * 0.7 + 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();

      // Mini golden starlight crosses
      if (i % 15 === 0) {
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(px - 6, py);
        ctx.lineTo(px + 6, py);
        ctx.moveTo(px, py - 6);
        ctx.lineTo(px, py + 6);
        ctx.stroke();
      }
    }

    // 4. Double Royal Gold Border
    const pad = 50;
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 40);
    ctx.stroke();

    // Inner delicate frame
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    roundRect(ctx, pad + 18, pad + 18, W - (pad + 18) * 2, H - (pad + 18) * 2, 30);
    ctx.stroke();
    ctx.restore();

    // Corner Ornaments
    drawCornerStar(ctx, pad + 35, pad + 35);
    drawCornerStar(ctx, W - pad - 35, pad + 35);
    drawCornerStar(ctx, pad + 35, H - pad - 35);
    drawCornerStar(ctx, W - pad - 35, H - pad - 35);

    // 5. Crown Header
    ctx.font = '54px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 25;
    ctx.fillText('👑', W / 2, 160);

    ctx.font = 'bold 24px "Outfit", "Segoe UI", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillStyle = '#fef08a';
    ctx.shadowBlur = 15;
    ctx.fillText('✦ A ROYAL BIRTHDAY CELEBRATION ✦', W / 2, 215);

    // 6. Recipient Photo in Gold Medallion
    const photoUrl = (typeof getSurpriseGiftPhoto === 'function') ? getSurpriseGiftPhoto() : (S.giftPhoto || S.photo || (S.photos && S.photos[0]) || '');
    let imgLoaded = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    if (photoUrl) {
      await new Promise((resolve) => {
        img.onload = () => { imgLoaded = true; resolve(); };
        img.onerror = () => { resolve(); };
        img.src = photoUrl;
      });
    }

    const photoCenterX = W / 2;
    const photoCenterY = 560;
    const photoRadius = 220;

    // Glowing photo frame halo
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius + 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 40;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Clip circular photo
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
    ctx.clip();

    if (imgLoaded) {
      const aspect = img.width / img.height;
      let drawW, drawH, drawX, drawY;
      if (aspect > 1) {
        drawH = photoRadius * 2;
        drawW = drawH * aspect;
        drawX = photoCenterX - drawW / 2;
        drawY = photoCenterY - photoRadius;
      } else {
        drawW = photoRadius * 2;
        drawH = drawW / aspect;
        drawX = photoCenterX - photoRadius;
        drawY = photoCenterY - drawH / 2;
      }
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#3b0764';
      ctx.fillRect(photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2);
      ctx.font = 'bold 90px "Cinzel", Georgia, serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText((S.name ? S.name.charAt(0).toUpperCase() : '👑'), photoCenterX, photoCenterY + 30);
    }
    ctx.restore();

    // 7. "HAPPY BIRTHDAY" Royal Title
    ctx.save();
    ctx.font = 'bold 84px "Cinzel Decorative", "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    const titleGrad = ctx.createLinearGradient(W / 2 - 300, 0, W / 2 + 300, 0);
    titleGrad.addColorStop(0, '#ffffff');
    titleGrad.addColorStop(0.3, '#fef08a');
    titleGrad.addColorStop(0.7, '#f59e0b');
    titleGrad.addColorStop(1, '#ffd700');
    ctx.fillStyle = titleGrad;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 30;
    ctx.fillText('HAPPY BIRTHDAY', W / 2, 885);
    ctx.restore();

    // 8. Recipient Name Script Calligraphy
    ctx.save();
    ctx.font = 'italic 76px "Playfair Display", "Great Vibes", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 25;
    ctx.fillText(S.name || 'Your Name', W / 2, 975);
    ctx.restore();

    // 9. Special Subtitle / Date Pill
    const birthdateFormatted = S.birthdate ? formatDate(S.birthdate) : 'A Day of Boundless Joy & Magic';
    ctx.save();
    const pillW = Math.min(740, ctx.measureText(birthdateFormatted).width + 120);
    const pillH = 50;
    const pillX = (W - pillW) / 2;
    const pillY = 1015;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, pillX, pillY, pillW, pillH, 25);
    ctx.fill();
    ctx.stroke();

    ctx.font = '600 22px "Outfit", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText(`🎂 ${birthdateFormatted} ✨`, W / 2, pillY + 33);
    ctx.restore();

    // 10. Heartfelt Birthday Note Box
    ctx.save();
    const boxPad = 100;
    const boxW = W - boxPad * 2;
    const boxH = 360;
    const boxY = 1110;

    // Frosted card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 30;
    roundRect(ctx, boxPad, boxY, boxW, boxH, 24);
    ctx.fill();
    ctx.stroke();

    // Quotation Marks
    ctx.font = 'bold 65px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.textAlign = 'left';
    ctx.fillText('“', boxPad + 25, boxY + 60);

    // Note Text Wrapped
    const noteText = S.birthdayNote || S.specialText || 'May this special birthday bring you unlimited happiness, radiant health, and every blessing your heart desires!';
    ctx.font = 'italic 28px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';

    wrapText(ctx, noteText, W / 2, boxY + 95, boxW - 80, 44);
    ctx.restore();

    // 11. Wisher Signature (if enabled)
    if (S.showWisher && S.wisherName) {
      ctx.save();
      ctx.font = 'italic 30px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.fillText(`With endless love & blessings, ${S.wisherName} 💖`, W / 2, 1545);
      ctx.restore();
    }

    // 12. Bottom Watermark & Story Sharing Badge
    ctx.save();
    ctx.font = 'bold 20px "Outfit", "Segoe UI", sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fillText('✨ FOREVER CHERISHED & CELEBRATED ✨', W / 2, 1720);

    ctx.font = '16px "Outfit", "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('Made with love for your special day', W / 2, 1755);
    ctx.restore();

    // 13. Convert Canvas to High-Res Blob & Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (S.name || 'Birthday').replace(/[^\w\s-]/gi, '').trim().replace(/\s+/g, '-');
      a.download = `Royal-Birthday-Keepsake-${safeName}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Confetti & Toast
      launchConfetti(250);
      showLiveToast('📸 Royal Keepsake Card downloaded! Share it on your story! ✨');
    }, 'image/png', 1.0);

  } catch (err) {
    console.error('Error generating souvenir card:', err);
    showLiveToast('⚠️ Could not generate card. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origBtnHTML;
    }
  }
}

// Helper: Round Rectangle for Canvas
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper: Draw Corner Star Filigree
function drawCornerStar(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#ffd700';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 15;
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', x, y);
  ctx.restore();
}

// Helper: Word-Wrap Text
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = (text || '').split(' ');
  let line = '';
  let currentY = y;
  const maxLines = 6;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1 && n < words.length - 1) {
        line += '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

// Attach event listener for Souvenir download button
const btnDownloadSouvenir = document.getElementById('btnDownloadSouvenir');
if (btnDownloadSouvenir) {
  btnDownloadSouvenir.addEventListener('click', generateRoyalSouvenirCard);
}

// ===== 🎆 INTERACTIVE SPARKLE & HEART FIREWORKS (SCREEN TAP BURST) =====
const BURST_SYMBOLS = ['💖', '✨', '🌸', '💕', '🌟', '💎', '💗', '⋆', '✦'];

function triggerTapFireworks(x, y) {
  if (typeof sfx !== 'undefined' && sfx.playSparklePop) {
    sfx.playSparklePop();
  }

  // 1. Shockwave Ripple Aura
  const ripple = document.createElement('div');
  ripple.className = 'tap-firework-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 750);

  // 2. Spawn 12 - 16 Floating Emojis & Sparkle Stars
  const particleCount = 14;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('span');
    p.className = 'tap-firework-particle';
    const symbol = BURST_SYMBOLS[Math.floor(Math.random() * BURST_SYMBOLS.length)];
    p.textContent = symbol;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    // Radial trajectory
    const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.4;
    const velocity = 50 + Math.random() * 95;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity - 25;
    const rot = (Math.random() - 0.5) * 120;
    const scale = 0.6 + Math.random() * 0.8;

    p.style.setProperty('--dx', `${destX}px`);
    p.style.setProperty('--dy', `${destY}px`);
    p.style.setProperty('--rot', `${rot}deg`);
    p.style.setProperty('--scale', `${scale}`);

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }

  // 3. Mini Canvas Confetti Shower
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 16,
      angle: 90,
      spread: 360,
      startVelocity: 18,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: currentTheme ? currentTheme.confetti : ['#ec4899', '#f43f5e', '#ffd700', '#38bdf8', '#ffffff'],
      ticks: 80,
      gravity: 0.8,
      scalar: 0.75,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true
    });
  }
}

// Global click/touch listener for tap burst fireworks
window.addEventListener('pointerdown', (e) => {
  // Ignore clicks on buttons, inputs, links, or specific UI controls
  if (e.target.closest('button, input, textarea, a, select, .theme-opt-btn, .nav-dot, .lightbox-card, .reel-card')) {
    return;
  }
  triggerTapFireworks(e.clientX, e.clientY);
}, { passive: true });


