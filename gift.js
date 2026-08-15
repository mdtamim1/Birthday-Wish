/* ============================================================
   GIFT.JS — VIP Gift Opening + Photo Gallery + Settings
   ============================================================ */

// ===== SETTINGS =====
const DEFAULT = {
  name: 'Your Name',
  giftMessage: 'This gift is wrapped with all my love for you! 💝',
  giftPhoto: '',
  photos: [],
  themeColor1: '#da5ec9',
  themeColor2: '#ec4899',
  themeAccent: '#fd8ae0',
  wisherName: '',
  showWisher: false,
};
function loadSettings() {
  let result = { ...DEFAULT };
  try {
    const s = localStorage.getItem('birthdaySettings');
    if (s) {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === 'object') result = { ...result, ...parsed };
    }
  } catch (e) {}

  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
      const raw = urlParams.get('data');
      if (raw) {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(raw))));
        if (decoded && typeof decoded === 'object') {
          const existingPhotos = (result.photos && result.photos.length > 0) ? result.photos : null;
          const existingGiftPhoto = result.giftPhoto || null;
          result = { ...result, ...decoded };
          if ((!decoded.photos || decoded.photos.length === 0) && existingPhotos) {
            result.photos = existingPhotos;
          }
          if (!decoded.giftPhoto && existingGiftPhoto) {
            result.giftPhoto = existingGiftPhoto;
          }
        }
      }
    } else {
      if (urlParams.has('name')) result.name = urlParams.get('name');
      if (urlParams.has('giftMessage')) result.giftMessage = urlParams.get('giftMessage');
      if (urlParams.has('wisherName')) { result.wisherName = urlParams.get('wisherName'); result.showWisher = true; }
    }
  } catch (e) {}

  return result;
}
let S = loadSettings();

function applyGiftLiveUpdate(newSettings) {
  if (!newSettings || typeof newSettings !== 'object') return;
  S = { ...DEFAULT, ...S, ...newSettings };

  // Apply theme
  const root = document.documentElement;
  root.style.setProperty('--p', S.themeColor1 || '#da5ec9');
  root.style.setProperty('--s', S.themeColor2 || '#ec4899');
  root.style.setProperty('--a', S.themeAccent || '#fd8ae0');

  // Populate content
  const msgEl = document.getElementById('revealMessage');
  if (msgEl) msgEl.textContent = S.giftMessage || DEFAULT.giftMessage;

  const fromLine = S.showWisher && S.wisherName ? `— with love from ${S.wisherName} 💕` : `— ${S.name || 'Your Name'}`;
  const fromEl = document.getElementById('revealFrom');
  if (fromEl) fromEl.textContent = fromLine;

  const headingEl = document.getElementById('preHeading');
  if (headingEl) headingEl.textContent = `${S.name || 'Your Name'}'s Gift`;

  if (typeof setupGallery === 'function') {
    setupGallery();
  }
}

applyGiftLiveUpdate(S);

// Real-time live sync for Gift page
function initGiftRealtime() {
  fetch('/api/settings')
    .then(r => r.json())
    .then(json => {
      if (json.success && json.data) applyGiftLiveUpdate(json.data);
    })
    .catch(() => {});

  window.addEventListener('storage', (e) => {
    if (e.key === 'birthdaySettings' && e.newValue) {
      try { applyGiftLiveUpdate(JSON.parse(e.newValue)); } catch (err) {}
    }
  });

  if (typeof EventSource !== 'undefined') {
    let es;
    function connect() {
      if (es) es.close();
      es = new EventSource('/api/events');
      es.addEventListener('settings_updated', (e) => {
        try { applyGiftLiveUpdate(JSON.parse(e.data)); } catch (err) {}
      });
      es.onerror = () => {
        es.close();
        setTimeout(connect, 4000);
      };
    }
    connect();
  }
}
initGiftRealtime();

// ===== FLOATING PARTICLES =====
const giftParticles = document.getElementById('giftParticles');
const emojis = ['✨','💫','⭐','🌟','🎀','💕','🎊','🎉','🌸','💝'];
function spawnGP() {
  const el = document.createElement('div');
  el.className = 'gp';
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
  const dur = 10 + Math.random() * 12;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = -(Math.random() * dur) + 's';
  giftParticles.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 * 1.5);
}
for (let i = 0; i < 18; i++) spawnGP();
setInterval(spawnGP, 2000);

// ===== BACKGROUND =====
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
function resizeBg() { bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight; }
resizeBg(); window.addEventListener('resize', resizeBg);

const bgStars = [];
for (let i = 0; i < 200; i++) {
  bgStars.push({ x: Math.random(), y: Math.random(), r: Math.random()*1.5+0.3, phase: Math.random()*Math.PI*2, speed: 0.002+Math.random()*0.007 });
}
function animBg(ts) {
  const W = bgCanvas.width, H = bgCanvas.height;
  bgCtx.clearRect(0, 0, W, H);
  const g = bgCtx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.8);
  g.addColorStop(0, '#0f0720'); g.addColorStop(0.5, '#080412'); g.addColorStop(1, '#030208');
  bgCtx.fillStyle = g; bgCtx.fillRect(0, 0, W, H);

  // Aurora glow
  const aurora = bgCtx.createRadialGradient(W*0.5, H*0.3, 0, W*0.5, H*0.3, W*0.6);
  aurora.addColorStop(0, 'rgba(120,30,200,0.06)');
  aurora.addColorStop(0.5, 'rgba(200,80,150,0.03)');
  aurora.addColorStop(1, 'transparent');
  bgCtx.fillStyle = aurora; bgCtx.fillRect(0, 0, W, H);

  bgStars.forEach(s => {
    const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(ts * s.speed + s.phase));
    bgCtx.beginPath(); bgCtx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
    bgCtx.fillStyle = `rgba(255,255,255,${a})`; bgCtx.fill();
  });
  requestAnimationFrame(animBg);
}
requestAnimationFrame(animBg);

// ===== CONFETTI =====
const confCanvas = document.getElementById('confettiCanvas');
const confCtx = confCanvas.getContext('2d');
function resizeConf() { confCanvas.width = window.innerWidth; confCanvas.height = window.innerHeight; }
resizeConf(); window.addEventListener('resize', resizeConf);
const CONF_COLORS = ['#c084fc','#f472b6','#fbbf24','#34d399','#60a5fa','#fb7185','#e879f9'];
const pieces = [];

function spawnConfetti(n, fromX, fromY) {
  for (let i = 0; i < n; i++) {
    const x = fromX !== undefined ? fromX + (Math.random()-0.5)*200 : Math.random()*confCanvas.width;
    const y = fromY !== undefined ? fromY : -20;
    pieces.push({
      x, y,
      w: 8 + Math.random()*12, h: 4+Math.random()*7,
      color: CONF_COLORS[Math.floor(Math.random()*CONF_COLORS.length)],
      angle: Math.random()*Math.PI*2,
      spin: (Math.random()-.5)*0.25,
      speed: 1.5+Math.random()*3.5,
      drift: (Math.random()-.5)*2,
      alpha: 1, life: 1,
    });
  }
}
function animConf() {
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  pieces.forEach((p, i) => {
    p.y += p.speed; p.x += p.drift; p.angle += p.spin;
    if (p.y > confCanvas.height + 20) { pieces.splice(i,1); return; }
    confCtx.save();
    confCtx.globalAlpha = p.alpha;
    confCtx.translate(p.x, p.y); confCtx.rotate(p.angle);
    confCtx.fillStyle = p.color;
    confCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    confCtx.restore();
  });
  requestAnimationFrame(animConf);
}
animConf();

// ===== FIREWORKS =====
const fwC = document.getElementById('fireworkCanvas');
const fwX = fwC.getContext('2d');
function resizeFW() { fwC.width = window.innerWidth; fwC.height = window.innerHeight; }
resizeFW(); window.addEventListener('resize', resizeFW);
let rockets = [], fwParts = [];

class Rocket {
  constructor(tx, ty) {
    this.x = tx || window.innerWidth/2 + (Math.random()-.5)*400;
    this.y = window.innerHeight + 10;
    this.tx = tx || 80+Math.random()*(window.innerWidth-160);
    this.ty = ty || 60+Math.random()*(window.innerHeight*0.45);
    const ang = Math.atan2(this.ty-this.y, this.tx-this.x);
    const spd = 13+Math.random()*5;
    this.vx = Math.cos(ang)*spd; this.vy = Math.sin(ang)*spd;
    this.color = `hsl(${Math.random()*360},100%,65%)`;
    this.trail = []; this.alive = true;
  }
  update() {
    this.trail.push({x:this.x,y:this.y});
    if (this.trail.length > 14) this.trail.shift();
    this.x += this.vx; this.y += this.vy; this.vy += 0.22;
    if (Math.hypot(this.tx-this.x,this.ty-this.y) < 22) { this.burst(); this.alive=false; }
  }
  burst() {
    const cnt = 90+Math.floor(Math.random()*50);
    for (let i = 0; i < cnt; i++) {
      const a = (Math.PI*2/cnt)*i + Math.random()*0.3;
      const spd = 1.5+Math.random()*6.5;
      const color2 = Math.random() > 0.5 ? this.color : `hsl(${Math.random()*360},100%,70%)`;
      fwParts.push({x:this.x,y:this.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,alpha:1,color:color2,g:0.09,f:0.96,sz:1.5+Math.random()*2.5});
    }
    // Gold sparkles
    for (let i = 0; i < 20; i++) {
      const a = Math.random()*Math.PI*2, spd = 0.5+Math.random()*3;
      fwParts.push({x:this.x,y:this.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,alpha:1,color:'#fbbf24',g:0.05,f:0.98,sz:2.5+Math.random()*3});
    }
  }
  draw() {
    fwX.beginPath();
    this.trail.forEach((p,i) => {
      fwX.globalAlpha = (i/this.trail.length)*0.85;
      i===0 ? fwX.moveTo(p.x,p.y) : fwX.lineTo(p.x,p.y);
    });
    fwX.strokeStyle = this.color; fwX.lineWidth = 2.5; fwX.stroke();
    fwX.globalAlpha = 1;
    fwX.beginPath(); fwX.arc(this.x,this.y,3.5,0,Math.PI*2);
    fwX.fillStyle = '#fff'; fwX.fill();
  }
}

function animFW() {
  fwX.clearRect(0, 0, fwC.width, fwC.height);
  rockets = rockets.filter(r => r.alive);
  rockets.forEach(r => { r.update(); r.draw(); });
  fwParts = fwParts.filter(p => p.alpha > 0.01);
  fwParts.forEach(p => {
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.g; p.vx*=p.f; p.vy*=p.f; p.alpha-=0.016;
    fwX.globalAlpha = p.alpha;
    fwX.beginPath(); fwX.arc(p.x,p.y,p.sz,0,Math.PI*2);
    fwX.fillStyle = p.color; fwX.fill();
  });
  fwX.globalAlpha = 1;
  requestAnimationFrame(animFW);
}
animFW();

function launchRockets(n, spread) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => rockets.push(new Rocket()), i * 220);
  }
}

// ===== PHOTO GALLERY SETUP =====
function setupGallery() {
  const allPhotos = [];
  if (S.giftPhoto) allPhotos.push(S.giftPhoto);
  if (S.photos && S.photos.length > 0) {
    S.photos.forEach(p => {
      if (p && p !== S.giftPhoto) allPhotos.push(p);
    });
  }
  if (!S.giftPhoto && S.photo && !allPhotos.includes(S.photo)) {
    allPhotos.push(S.photo);
  }

  const revealGallery = document.getElementById('revealGallery');
  const revealSinglePhoto = document.getElementById('revealSinglePhoto');
  const track = document.getElementById('galleryTrack');
  const dotsEl = document.getElementById('galleryDots');

  if (revealGallery) revealGallery.style.display = 'none';
  if (revealSinglePhoto) revealSinglePhoto.style.display = 'none';
  if (track) track.innerHTML = '';
  if (dotsEl) dotsEl.innerHTML = '';

  if (allPhotos.length > 1 && revealGallery && track && dotsEl) {
    // Multi-photo gallery
    revealGallery.style.display = 'block';
    let currentSlide = 0;

    allPhotos.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      const img = document.createElement('img');
      img.src = src; img.alt = `Photo ${i+1}`;
      img.loading = 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);

      const dot = document.createElement('div');
      dot.className = 'gallery-dot' + (i===0?' active':'');
      dot.addEventListener('click', () => goToSlide(i));
      dotsEl.appendChild(dot);
    });

    function goToSlide(n) {
      currentSlide = (n + allPhotos.length) % allPhotos.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      document.querySelectorAll('.gallery-dot').forEach((d,i) => d.classList.toggle('active', i===currentSlide));
    }

    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (prevBtn) prevBtn.onclick = () => goToSlide(currentSlide-1);
    if (nextBtn) nextBtn.onclick = () => goToSlide(currentSlide+1);

  } else if (allPhotos.length >= 1 && revealSinglePhoto) {
    // Single photo (displays giftPhoto)
    revealSinglePhoto.style.display = 'block';
    const photoEl = document.getElementById('revealPhoto');
    if (photoEl) photoEl.src = allPhotos[0];
  }
}
setupGallery();

// ===== GIFT OPEN LOGIC =====
let opened = false;
const giftScene = document.getElementById('giftScene');
const lidWrap = document.getElementById('lidWrap');
const bow3d = document.getElementById('bow3d');
const preGift = document.getElementById('preGift');
const postGift = document.getElementById('postGift');
const lightBurst = document.getElementById('lightBurst');
const clickHint = document.getElementById('clickHint');

// Hover shake
giftScene?.addEventListener('mouseenter', () => {
  if (opened) return;
  if (typeof gsap !== 'undefined') {
    gsap.to('#gift3d', { rotateY: 15, duration: 0.15, yoyo: true, repeat: 5,
      ease: 'power1.inOut', onComplete: () => gsap.set('#gift3d', { rotateY: 0 }) });
  }
});

function handleGiftOpenClick(e) {
  if (e) e.stopPropagation();
  if (opened) return;
  opened = true;
  if (clickHint) {
    clickHint.style.pointerEvents = 'none';
    clickHint.style.opacity = '0';
  }

  // Get center position for burst
  const rect = (giftScene || document.body).getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  if (typeof gsap !== 'undefined') {
    // Step 1: Vigorous shake
    gsap.to('#gift3d', {
      x: 12, duration: 0.06, yoyo: true, repeat: 11, ease: 'power1.inOut',
      onComplete: () => {
        gsap.set('#gift3d', { x: 0 });
        openGift(cx, cy);
      }
    });
  } else {
    openGift(cx, cy);
  }
}

giftScene?.addEventListener('click', handleGiftOpenClick);
clickHint?.addEventListener('click', handleGiftOpenClick);
preGift?.addEventListener('click', handleGiftOpenClick);

function openGift(cx, cy) {
  // Pause float animation
  giftScene.style.animation = 'none';

  // Step 2: Bow spins and flies up
  if (typeof gsap !== 'undefined') {
    gsap.to('#bow3d', {
      y: -80, rotation: 360, scale: 0.3, opacity: 0,
      duration: 0.5, ease: 'power2.in'
    });
  }

  // Step 3: Lid flips open with delay
  setTimeout(() => {
    lidWrap.classList.add('open');
  }, 400);

  // Step 4: Particle burst from gift center
  setTimeout(() => {
    spawnConfetti(60, cx, cy-100);

    // Step 5: Light burst
    if (typeof gsap !== 'undefined') {
      gsap.to(lightBurst, {
        width: '250vw', height: '250vw', opacity: 1,
        duration: 0.35, ease: 'power3.out',
        onComplete: () => {
          gsap.to(lightBurst, { opacity: 0, duration: 0.6, ease: 'power2.in' });
        }
      });
    }

    // Launch fireworks!
    launchRockets(8);

    // Step 6: Reveal post-gift
    setTimeout(() => {
      preGift.style.display = 'none';
      postGift.style.display = 'flex';

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(postGift, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          onStart: () => {
            gsap.from('.gift-reveal-icon', { scale: 0, rotation: -180, duration: 1, ease: 'back.out(2)', delay: 0.1 });
            gsap.from('.reveal-title', { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.25 });
            gsap.from('.reveal-card', { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
            gsap.from('.reveal-gallery, .reveal-single-photo', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.5)', delay: 0.15 });
            gsap.from('.reveal-back-btn', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.6 });
          }
        });
      } else {
        postGift.style.opacity = '1';
      }

      // More fireworks celebration
      setTimeout(() => launchRockets(5), 600);
      setTimeout(() => { spawnConfetti(100); launchRockets(4); }, 1400);
      setTimeout(() => launchRockets(3), 2500);

    }, 550);
  }, 750);
}
