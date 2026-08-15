/* ============================================================
   ADMIN.JS — Admin Panel Logic with Backend & SQLite Database Sync
   ============================================================ */

// ===== SETTINGS =====
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
  showFloatingMemories: true,
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
  showGift: true,
  voiceUrl: '',
  showVoiceNote: true,
  voiceTitle: 'A Special Voice Message from the Heart 💖',
  adminPassword: '01905',
};

let currentWishSlug = 'hasif';

function loadSettings() {
  try {
    const s = localStorage.getItem('birthdaySettings');
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

let S = loadSettings();

// Check Supabase Cloud Connection
async function checkSupabaseStatus() {
  try {
    const res = await fetch('/api/supabase-status');
    if (res.ok) {
      const json = await res.json();
      const statusText = document.getElementById('supabaseStatusText');
      const badge = document.getElementById('supabaseBadge');
      if (json.configured) {
        if (statusText) statusText.textContent = '⚡ Supabase Cloud Connected';
        if (badge) {
          badge.style.background = 'rgba(52,211,153,0.15)';
          badge.style.borderColor = 'rgba(52,211,153,0.45)';
          badge.style.color = '#34d399';
        }
      } else {
        if (statusText) statusText.textContent = '📁 Local Storage (Set SUPABASE_URL in .env to connect)';
        if (badge) {
          badge.style.background = 'rgba(251,191,36,0.12)';
          badge.style.borderColor = 'rgba(251,191,36,0.4)';
          badge.style.color = '#fbbf24';
        }
      }
    }
  } catch (e) {}
}

// Fetch all wishes for the dropdown
async function fetchWishesList() {
  try {
    const res = await fetch('/api/wishes');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.wishes) {
        populateWishSelector(json.wishes);
      }
    }
  } catch (e) {}
}

function populateWishSelector(wishes) {
  const selector = document.getElementById('wishSelector');
  if (!selector) return;
  selector.innerHTML = '';
  wishes.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.id;
    opt.textContent = `👑 ${w.name || 'Wish'} (${w.id})`;
    if (w.id === currentWishSlug) opt.selected = true;
    selector.appendChild(opt);
  });
  updateWishUrlPreview();
}

function updateWishUrlPreview() {
  const slugInput = document.getElementById('wishSlugInput');
  const slug = (slugInput ? slugInput.value : currentWishSlug || 'hasif').trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '-');
  const liveLink = document.getElementById('wishLiveLink');
  const deleteBtn = document.getElementById('btnDeleteWish');
  
  if (liveLink) {
    const fullUrl = `${window.location.origin}/wish/${slug || 'hasif'}`;
    liveLink.href = `/wish/${slug || 'hasif'}`;
    liveLink.textContent = fullUrl;
  }
  if (deleteBtn) {
    deleteBtn.style.display = (slug === 'default' || slug === 'hasif') ? 'none' : 'inline-block';
  }

  // Update sidebar preview links dynamically
  const previewLinks = document.querySelectorAll('.sidebar-preview-links a');
  if (previewLinks && previewLinks.length >= 2) {
    previewLinks[0].href = `/wish/${slug || 'hasif'}`;
    previewLinks[1].href = `/gift?id=${slug || 'hasif'}`;
  }
}

// Fetch latest settings / active wish from server on boot
async function fetchServerSettings(slug = currentWishSlug) {
  try {
    const res = await fetch(`/api/wishes/${slug}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        S = { ...DEFAULT_SETTINGS, ...json.data };
        localStorage.setItem('birthdaySettings', JSON.stringify(S));
        populateForm();
        if (typeof window.refreshMultiGrid === 'function') {
          window.refreshMultiGrid();
        }
        const slugInput = document.getElementById('wishSlugInput');
        if (slugInput) slugInput.value = slug;
        updateWishUrlPreview();
      }
    }
  } catch (err) {
    console.log('Using local cached settings (Server offline or standalone):', err);
  }
}

async function saveSettings(data) {
  const slugInput = document.getElementById('wishSlugInput');
  const slug = (slugInput ? slugInput.value : currentWishSlug || 'hasif').trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '-');
  currentWishSlug = slug;
  data.id = slug;

  try {
    localStorage.setItem('birthdaySettings', JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save warning:', err);
  }

  try {
    const res = await fetch(`/api/wishes/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      fetchWishesList();
      return true;
    }
  } catch (err) {
    console.warn('Backend save offline fallback:', err);
  }
  return true;
}

// ===== POPULATE FORM =====
function populateForm() {
  if (!document.getElementById('nameInput')) return;
  document.getElementById('nameInput').value = S.name || '';
  document.getElementById('birthdateInput').value = S.birthdate || '';
  document.getElementById('specialTextInput').value = S.specialText || '';
  document.getElementById('birthdayNoteInput').value = S.birthdayNote || '';
  updateCharCount();
  document.getElementById('wisherNameInput').value = S.wisherName || '';
  document.getElementById('showWisherToggle').checked = !!S.showWisher;
  document.getElementById('wisherNameGroup').style.display = S.showWisher ? 'flex' : 'none';
  document.getElementById('giftMessageInput').value = S.giftMessage || '';
  document.getElementById('musicUrlInput').value = S.musicUrl || '';
  document.getElementById('musicEnabledToggle').checked = S.musicEnabled !== false;
  document.getElementById('color1Input').value = S.themeColor1 || '#da5ec9';
  document.getElementById('color1Text').value = S.themeColor1 || '#da5ec9';
  document.getElementById('color2Input').value = S.themeColor2 || '#ec4899';
  document.getElementById('color2Text').value = S.themeColor2 || '#ec4899';
  document.getElementById('colorAccentInput').value = S.themeAccent || '#fd8ae0';
  document.getElementById('colorAccentText').value = S.themeAccent || '#fd8ae0';
  document.getElementById('showBirthdateToggle').checked = S.showBirthdate !== false;
  const floatToggle = document.getElementById('showFloatingMemoriesToggle');
  if (floatToggle) floatToggle.checked = S.showFloatingMemories !== false;
  document.getElementById('showGiftToggle').checked = S.showGift !== false;

  // Voice Note
  const showVoice = document.getElementById('showVoiceNoteToggle');
  if (showVoice) showVoice.checked = S.showVoiceNote !== false;
  const voiceTitle = document.getElementById('voiceTitleInput');
  if (voiceTitle) voiceTitle.value = S.voiceTitle || '';
  const voiceUrl = document.getElementById('voiceUrlInput');
  if (voiceUrl) voiceUrl.value = S.voiceUrl || '';

  const previewRow = document.getElementById('voicePreviewRow');
  const audioPrev = document.getElementById('voiceAudioPreview');
  if (S.voiceUrl && previewRow && audioPrev) {
    audioPrev.src = S.voiceUrl;
    previewRow.style.display = 'block';
  } else if (previewRow) {
    previewRow.style.display = 'none';
  }

  updateThemePreview();

  // Photos
  if (S.photo) {
    showPhotoPreview(S.photo, 'main');
  } else {
    document.getElementById('photoPreviewWrap').style.display = 'none';
    document.getElementById('photoPlaceholder').style.display = 'flex';
  }

  if (S.giftPhoto) {
    showPhotoPreview(S.giftPhoto, 'gift');
  } else {
    document.getElementById('giftPhotoPreviewWrap').style.display = 'none';
    document.getElementById('giftPhotoPlaceholder').style.display = 'flex';
  }
}

// ===== COLLECT FORM DATA =====
function collectFormData() {
  const floatToggle = document.getElementById('showFloatingMemoriesToggle');
  const showVoiceToggle = document.getElementById('showVoiceNoteToggle');
  const voiceTitleInput = document.getElementById('voiceTitleInput');
  const voiceUrlInput = document.getElementById('voiceUrlInput');

  return {
    ...S,
    name: document.getElementById('nameInput').value.trim() || 'Your Name',
    birthdate: document.getElementById('birthdateInput').value,
    specialText: document.getElementById('specialTextInput').value.trim(),
    birthdayNote: document.getElementById('birthdayNoteInput').value.trim(),
    wisherName: document.getElementById('wisherNameInput').value.trim(),
    showWisher: document.getElementById('showWisherToggle').checked,
    giftMessage: document.getElementById('giftMessageInput').value.trim(),
    musicUrl: document.getElementById('musicUrlInput').value.trim(),
    musicEnabled: document.getElementById('musicEnabledToggle').checked,
    themeColor1: document.getElementById('color1Input').value,
    themeColor2: document.getElementById('color2Input').value,
    themeAccent: document.getElementById('colorAccentInput').value,
    showBirthdate: document.getElementById('showBirthdateToggle').checked,
    showFloatingMemories: floatToggle ? floatToggle.checked : true,
    showGift: document.getElementById('showGiftToggle').checked,
    showVoiceNote: showVoiceToggle ? showVoiceToggle.checked : true,
    voiceTitle: voiceTitleInput ? voiceTitleInput.value.trim() : '',
    voiceUrl: voiceUrlInput ? voiceUrlInput.value.trim() : '',
  };
}

async function doSave() {
  S = collectFormData();
  const saveBtn = document.getElementById('saveBtn');
  const saveBtnTop = document.getElementById('saveBtnTop');
  const originalSaveText = saveBtn ? saveBtn.textContent : '';

  if (saveBtn) saveBtn.textContent = '⏳ Saving...';
  if (saveBtnTop) saveBtnTop.textContent = '⏳ Saving...';

  await saveSettings(S);

  if (saveBtn) saveBtn.textContent = originalSaveText || '💾 Save All Changes';
  if (saveBtnTop) saveBtnTop.textContent = '💾 Save';

  showToast('✅ Saved & Broadcasted Live to Frontend!', 'success');
  const statusEl = document.getElementById('saveStatus');
  if (statusEl) {
    statusEl.textContent = '✓ Live Synced';
    statusEl.style.color = '#34d399';
    setTimeout(() => { statusEl.textContent = ''; }, 4000);
  }
}

document.getElementById('saveBtn')?.addEventListener('click', doSave);
document.getElementById('saveBtnTop')?.addEventListener('click', doSave);

// Debounce timer for smooth auto-saving
let autoSaveTimer = null;
function triggerAutoSave() {
  const statusEl = document.getElementById('saveStatus');
  if (statusEl) {
    statusEl.textContent = '● Saving...';
    statusEl.style.color = '#fbbf24';
  }
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(async () => {
    S = collectFormData();
    await saveSettings(S);
    if (statusEl) {
      statusEl.textContent = '✓ Saved & Synced';
      statusEl.style.color = '#34d399';
      setTimeout(() => { if (statusEl.textContent.includes('Synced')) statusEl.textContent = ''; }, 3000);
    }
  }, 600);
}

// ===== SHAREABLE WISH LINK GENERATOR =====
function generateShareableLink() {
  S = collectFormData();
  saveSettings(S);

  const sharePayload = {
    name: S.name || '',
    birthdate: S.birthdate || '',
    specialText: S.specialText || '',
    birthdayNote: S.birthdayNote || '',
    wisherName: S.wisherName || '',
    showWisher: !!S.showWisher,
    giftMessage: S.giftMessage || '',
    giftPhoto: S.giftPhoto || '',
    photo: S.photo || '',
    photos: Array.isArray(S.photos) ? S.photos : [],
    musicUrl: S.musicUrl || '',
    musicEnabled: S.musicEnabled !== false,
    themeId: S.themeId || 'galaxy-violet',
    themeColor1: S.themeColor1 || '#da5ec9',
    themeColor2: S.themeColor2 || '#ec4899',
    themeAccent: S.themeAccent || '#fd8ae0',
    showBirthdate: S.showBirthdate !== false,
    showFloatingMemories: S.showFloatingMemories !== false,
    showGift: S.showGift !== false,
    showVoiceNote: S.showVoiceNote !== false,
    voiceTitle: S.voiceTitle || '',
    voiceUrl: S.voiceUrl || ''
  };

  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(sharePayload))));
  const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '').replace('admin', '') + 'index.html';
  const fullUrl = `${baseUrl}?data=${encoded}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullUrl).then(() => {
      showToast('📋 Complete Shareable Wish Link copied to clipboard!', 'success');
    }).catch(() => {
      prompt('Copy your customized wish link:', fullUrl);
    });
  } else {
    prompt('Copy your customized wish link:', fullUrl);
  }
}

const shareBtn = document.getElementById('shareWishLinkBtn');
if (shareBtn) shareBtn.addEventListener('click', generateShareableLink);

// Auto-save on input and change
document.querySelectorAll('input, textarea, select').forEach(el => {
  el.addEventListener('input', triggerAutoSave);
  el.addEventListener('change', triggerAutoSave);
});

// Reset to Defaults
document.getElementById('resetBtn')?.addEventListener('click', async () => {
  if (confirm('Reset all settings to default? This will update frontend in real time.')) {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.data) S = json.data;
      } else {
        S = { ...DEFAULT_SETTINGS };
      }
    } catch (e) {
      S = { ...DEFAULT_SETTINGS };
    }
    await saveSettings(S);
    populateForm();
    if (typeof window.refreshMultiGrid === 'function') window.refreshMultiGrid();
    showToast('🔄 Reset to defaults', 'success');
  }
});

// ===== SMART CLIENT-SIDE IMAGE COMPRESSION (Fallback) =====
function compressImage(file, maxWidth = 900, maxHeight = 900, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image decode error'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

// ===== SERVER FILE UPLOADER =====
async function uploadFileToServer(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    throw new Error('Server upload failed');
  }
  const json = await res.json();
  if (!json.success || !json.url) {
    throw new Error(json.error || 'Upload error');
  }
  return json.url;
}

// ===== PHOTO UPLOADS =====
function setupPhotoUpload(uploadAreaId, inputId, previewWrapId, previewImgId, placeholderId, removeId, storageKey) {
  const area = document.getElementById(uploadAreaId);
  const input = document.getElementById(inputId);
  const previewWrap = document.getElementById(previewWrapId);
  const previewImg = document.getElementById(previewImgId);
  const placeholder = document.getElementById(placeholderId);
  const removeBtn = document.getElementById(removeId);

  if (!area || !input) return;

  area.addEventListener('click', (e) => {
    if (e.target === removeBtn || removeBtn.contains(e.target)) return;
    input.click();
  });

  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor = 'var(--p)'; });
  area.addEventListener('dragleave', () => { area.style.borderColor = ''; });
  area.addEventListener('drop', e => {
    e.preventDefault(); area.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) processImageFile(file, storageKey, previewWrap, previewImg, placeholder);
  });

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) processImageFile(file, storageKey, previewWrap, previewImg, placeholder);
  });

  removeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    S[storageKey] = '';
    previewWrap.style.display = 'none';
    placeholder.style.display = 'flex';
    input.value = '';
    saveSettings(S);
    showToast('Photo removed', 'success');
  });
}

async function processImageFile(file, storageKey, previewWrap, previewImg, placeholder) {
  try {
    showToast('⏳ Uploading photo...', 'success');
    let photoUrl = '';
    try {
      photoUrl = await uploadFileToServer(file);
    } catch (uploadErr) {
      console.warn('Direct upload failed, using compressed fallback:', uploadErr);
      photoUrl = await compressImage(file, 800, 800, 0.82);
    }

    S[storageKey] = photoUrl;
    previewImg.src = photoUrl;
    previewWrap.style.display = 'block';
    placeholder.style.display = 'none';
    await saveSettings(S);
    showToast('📸 Photo uploaded & saved live!', 'success');
  } catch (err) {
    console.error(err);
    showToast('❌ Failed to process image', 'error');
  }
}

function showPhotoPreview(src, type) {
  if (type === 'main') {
    const preview = document.getElementById('photoPreview');
    const wrap = document.getElementById('photoPreviewWrap');
    const placeholder = document.getElementById('photoPlaceholder');
    if (preview && wrap && placeholder) {
      preview.src = src;
      wrap.style.display = 'block';
      placeholder.style.display = 'none';
    }
  } else {
    const preview = document.getElementById('giftPhotoPreview');
    const wrap = document.getElementById('giftPhotoPreviewWrap');
    const placeholder = document.getElementById('giftPhotoPlaceholder');
    if (preview && wrap && placeholder) {
      preview.src = src;
      wrap.style.display = 'block';
      placeholder.style.display = 'none';
    }
  }
}

setupPhotoUpload('photoUploadArea','photoInput','photoPreviewWrap','photoPreview','photoPlaceholder','photoRemoveBtn','photo');
setupPhotoUpload('giftPhotoUploadArea','giftPhotoInput','giftPhotoPreviewWrap','giftPhotoPreview','giftPhotoPlaceholder','giftPhotoRemoveBtn','giftPhoto');

// ===== WISHER TOGGLE =====
document.getElementById('showWisherToggle')?.addEventListener('change', function() {
  const group = document.getElementById('wisherNameGroup');
  if (group) group.style.display = this.checked ? 'flex' : 'none';
});

// ===== CHARACTER COUNTER =====
function updateCharCount() {
  const note = document.getElementById('birthdayNoteInput');
  const count = document.getElementById('noteCharCount');
  if (note && count) count.textContent = note.value.length;
}
document.getElementById('birthdayNoteInput')?.addEventListener('input', updateCharCount);

// ===== COLOR PICKERS =====
function syncColor(pickerId, textId) {
  const picker = document.getElementById(pickerId);
  const text = document.getElementById(textId);
  if (!picker || !text) return;
  picker.addEventListener('input', () => { text.value = picker.value; updateThemePreview(); });
  text.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(text.value)) { picker.value = text.value; updateThemePreview(); }
  });
}
syncColor('color1Input','color1Text');
syncColor('color2Input','color2Text');
syncColor('colorAccentInput','colorAccentText');

function updateThemePreview() {
  const c1 = document.getElementById('color1Input')?.value || '#da5ec9';
  const c2 = document.getElementById('color2Input')?.value || '#ec4899';
  const ca = document.getElementById('colorAccentInput')?.value || '#fd8ae0';
  const bar = document.getElementById('themePreviewBar');
  if (bar) bar.style.background = `linear-gradient(135deg, ${c1}, ${c2}, ${ca})`;
}

// Theme presets
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const c1 = btn.dataset.c1, c2 = btn.dataset.c2, ca = btn.dataset.ca;
    if (btn.dataset.theme) S.themeId = btn.dataset.theme;
    if (document.getElementById('color1Input')) document.getElementById('color1Input').value = c1;
    if (document.getElementById('color1Text')) document.getElementById('color1Text').value = c1;
    if (document.getElementById('color2Input')) document.getElementById('color2Input').value = c2;
    if (document.getElementById('color2Text')) document.getElementById('color2Text').value = c2;
    if (document.getElementById('colorAccentInput')) document.getElementById('colorAccentInput').value = ca;
    if (document.getElementById('colorAccentText')) document.getElementById('colorAccentText').value = ca;
    updateThemePreview();
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// ===== SIDEBAR NAV =====
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = 'section-' + item.dataset.section;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    if (window.innerWidth < 900 && sidebar) sidebar.classList.remove('open');
  });
});

// Close sidebar on outside click
document.addEventListener('click', (e) => {
  if (window.innerWidth < 900 && sidebar && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && e.target !== hamburger) {
      sidebar.classList.remove('open');
    }
  }
});

// Intersection observer for active nav
const sections = document.querySelectorAll('.admin-section');
if (sections.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('section-', '');
        document.querySelectorAll('.nav-item').forEach(n => {
          n.classList.toggle('active', n.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
}

// ===== TOAST =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== MULTI PHOTO GALLERY UPLOAD =====
(function() {
  const multiDrop = document.getElementById('multiPhotoDrop');
  const multiInput = document.getElementById('multiPhotoInput');
  const multiGrid = document.getElementById('multiPhotoGrid');
  const multiPlaceholder = document.getElementById('multiPhotoPlaceholder');

  if (!multiDrop) return;

  function refreshGrid() {
    if (!multiGrid) return;
    multiGrid.innerHTML = '';
    if (!S.photos || S.photos.length === 0) {
      if (multiPlaceholder) multiPlaceholder.style.display = 'block';
      return;
    }
    if (multiPlaceholder) multiPlaceholder.style.display = 'none';
    S.photos.forEach(function(src, i) {
      const thumb = document.createElement('div');
      thumb.className = 'multi-photo-thumb';
      const img = document.createElement('img');
      img.src = src;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'thumb-remove';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        S.photos.splice(i, 1);
        saveSettings(S);
        refreshGrid();
        showToast('Photo removed', 'success');
      });
      const numEl = document.createElement('span');
      numEl.className = 'thumb-num';
      numEl.textContent = (i + 1);
      thumb.appendChild(img);
      thumb.appendChild(removeBtn);
      thumb.appendChild(numEl);
      multiGrid.appendChild(thumb);
    });
  }
  window.refreshMultiGrid = refreshGrid;

  multiDrop.addEventListener('click', function(e) {
    if (e.target.classList.contains('thumb-remove')) return;
    multiInput.click();
  });
  multiDrop.addEventListener('dragover', function(e) { e.preventDefault(); multiDrop.style.borderColor = 'var(--p)'; });
  multiDrop.addEventListener('dragleave', function() { multiDrop.style.borderColor = ''; });
  multiDrop.addEventListener('drop', function(e) {
    e.preventDefault(); multiDrop.style.borderColor = '';
    processMultiFiles(e.dataTransfer.files);
  });
  multiInput.addEventListener('change', function() { processMultiFiles(multiInput.files); });

  async function processMultiFiles(files) {
    if (!S.photos) S.photos = [];
    const remaining = 12 - S.photos.length;
    const toProcess = Math.min(files.length, remaining);
    if (toProcess <= 0) { showToast('Max 12 photos allowed', 'error'); return; }

    showToast(`⏳ Uploading & optimizing ${toProcess} photo(s)...`, 'success');
    let added = 0;

    for (let i = 0; i < toProcess; i++) {
      try {
        let photoUrl = '';
        try {
          photoUrl = await uploadFileToServer(files[i]);
        } catch (e) {
          photoUrl = await compressImage(files[i], 800, 800, 0.82);
        }
        S.photos.push(photoUrl);
        added++;
      } catch (err) {
        console.error('Photo optimization error:', err);
      }
    }

    if (added > 0) {
      await saveSettings(S);
      refreshGrid();
      showToast(`📸 Added ${added} photo(s) live!`, 'success');
    }
    multiInput.value = '';
  }

  // Populate on load
  if (!S.photos) S.photos = [];
  refreshGrid();
})();

// ===== 🎙️ VOICE NOTE FILE UPLOADER & RECORDER =====
(function initVoiceAdmin() {
  const btnChooseVoice = document.getElementById('btnChooseVoiceFile');
  const voiceFileInput = document.getElementById('voiceFileInput');
  const voiceUrlInput = document.getElementById('voiceUrlInput');
  const voicePreviewRow = document.getElementById('voicePreviewRow');
  const voiceAudioPreview = document.getElementById('voiceAudioPreview');
  const btnRemoveVoice = document.getElementById('btnRemoveVoice');

  btnChooseVoice?.addEventListener('click', () => voiceFileInput?.click());

  voiceFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast('⏳ Uploading voice note...', 'info');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        S.voiceUrl = json.url;
        if (voiceUrlInput) voiceUrlInput.value = json.url;
        if (voiceAudioPreview) voiceAudioPreview.src = json.url;
        if (voicePreviewRow) voicePreviewRow.style.display = 'block';
        showToast('🎙️ Voice audio uploaded! Click Save to apply.', 'success');
      }
    } catch (err) {
      showToast('⚠️ Failed to upload audio.', 'error');
    }
  });

  btnRemoveVoice?.addEventListener('click', () => {
    S.voiceUrl = '';
    if (voiceUrlInput) voiceUrlInput.value = '';
    if (voiceAudioPreview) { voiceAudioPreview.src = ''; }
    if (voicePreviewRow) voicePreviewRow.style.display = 'none';
    showToast('Voice note removed. Click Save to apply.', 'info');
  });

  // Live Audio Recording
  let mediaRecorder = null;
  let audioChunks = [];
  let recordTimer = null;
  let recordSeconds = 0;

  const btnRecordVoice = document.getElementById('btnRecordVoice');
  const btnStopRecord = document.getElementById('btnStopRecord');
  const voiceRecordStatus = document.getElementById('voiceRecordStatus');
  const voiceRecordTime = document.getElementById('voiceRecordTime');

  btnRecordVoice?.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const file = new File([audioBlob], `voice-wish-${Date.now()}.webm`, { type: 'audio/webm' });

        showToast('⏳ Uploading recorded voice...', 'info');
        const fd = new FormData();
        fd.append('file', file);
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          const json = await res.json();
          if (json.success && json.url) {
            S.voiceUrl = json.url;
            if (voiceUrlInput) voiceUrlInput.value = json.url;
            if (voiceAudioPreview) voiceAudioPreview.src = json.url;
            if (voicePreviewRow) voicePreviewRow.style.display = 'block';
            showToast('🎙️ Recorded voice saved & ready! Click Save to apply.', 'success');
          }
        } catch (err) {
          showToast('⚠️ Error uploading recorded audio.', 'error');
        }
      };

      mediaRecorder.start();
      recordSeconds = 0;
      if (voiceRecordStatus) voiceRecordStatus.style.display = 'flex';
      if (btnRecordVoice) btnRecordVoice.style.display = 'none';

      recordTimer = setInterval(() => {
        recordSeconds++;
        const mins = Math.floor(recordSeconds / 60);
        const secs = recordSeconds % 60;
        if (voiceRecordTime) voiceRecordTime.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }, 1000);

      showToast('🔴 Recording voice... Speak clearly!', 'info');
    } catch (err) {
      showToast('⚠️ Microphone permission required to record.', 'error');
    }
  });

  btnStopRecord?.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    clearInterval(recordTimer);
    if (voiceRecordStatus) voiceRecordStatus.style.display = 'none';
    if (btnRecordVoice) btnRecordVoice.style.display = 'inline-flex';
  });
})();

// ===== 🔐 ADMIN VIP PASSCODE AUTHENTICATION (01905) =====
(function initAdminAuth() {
  const authOverlay = document.getElementById('adminAuthOverlay');
  const adminPanel = document.getElementById('adminPanel');
  const authForm = document.getElementById('authForm');
  const passcodeInput = document.getElementById('adminPasscodeInput');
  const authError = document.getElementById('authError');
  const btnTogglePwd = document.getElementById('btnTogglePwd');
  const authCard = document.getElementById('authCard');
  const btnLogout = document.getElementById('btnLogout');
  const btnLogoutSidebar = document.getElementById('btnLogoutSidebar');

  function checkAuthStatus() {
    const isAuthed = sessionStorage.getItem('adminAuth') === 'true';
    if (isAuthed) {
      if (authOverlay) authOverlay.style.display = 'none';
      if (adminPanel) adminPanel.style.display = 'flex';
      populateForm();
    } else {
      if (authOverlay) authOverlay.style.display = 'flex';
      if (adminPanel) adminPanel.style.display = 'none';
      if (passcodeInput) {
        passcodeInput.value = '';
        passcodeInput.focus();
      }
    }
  }

  // Toggle Password Mask
  btnTogglePwd?.addEventListener('click', () => {
    if (passcodeInput) {
      const isPwd = passcodeInput.type === 'password';
      passcodeInput.type = isPwd ? 'text' : 'password';
      btnTogglePwd.textContent = isPwd ? '🙈' : '👁️';
    }
  });

  // Handle Form Submit
  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = passcodeInput ? passcodeInput.value.trim() : '';
    const expected = (S && S.adminPassword) ? S.adminPassword : '01905';

    // Verify Passcode: accepts 01905, TAMIM0190527688, or current stored adminPassword
    if (entered === expected || entered === '01905' || entered === 'TAMIM0190527688') {
      sessionStorage.setItem('adminAuth', 'true');
      if (authError) authError.textContent = '';
      if (authOverlay) authOverlay.style.display = 'none';
      if (adminPanel) adminPanel.style.display = 'flex';
      populateForm();
      showToast('👑 Welcome Admin! Passcode Verified.', 'success');
    } else {
      if (authError) authError.textContent = '❌ Incorrect Passcode! Please enter 01905';
      if (passcodeInput) {
        passcodeInput.value = '';
        passcodeInput.focus();
      }
      // Shake Card Animation
      if (authCard) {
        authCard.style.transform = 'translateX(-12px)';
        setTimeout(() => { authCard.style.transform = 'translateX(12px)'; }, 80);
        setTimeout(() => { authCard.style.transform = 'translateX(-8px)'; }, 160);
        setTimeout(() => { authCard.style.transform = 'translateX(8px)'; }, 240);
        setTimeout(() => { authCard.style.transform = 'translateX(0)'; }, 320);
      }
    }
  });

  // Logout / Lock Action
  function doLogout() {
    sessionStorage.removeItem('adminAuth');
    if (adminPanel) adminPanel.style.display = 'none';
    if (authOverlay) authOverlay.style.display = 'flex';
    if (passcodeInput) {
      passcodeInput.value = '';
      passcodeInput.focus();
    }
    if (authError) authError.textContent = '';
    showToast('🔒 Admin Panel Locked.', 'info');
  }

  btnLogout?.addEventListener('click', doLogout);
  btnLogoutSidebar?.addEventListener('click', doLogout);

  // Sidebar Share Wish Link Button
  document.getElementById('shareWishLinkBtn')?.addEventListener('click', () => {
    const slug = (currentWishSlug || 'hasif').trim().toLowerCase();
    const fullUrl = `${window.location.origin}/wish/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        showToast(`📋 Copied Link: ${fullUrl}`, 'success');
      });
    } else {
      prompt('Copy Live Wish Link:', fullUrl);
    }
  });

  // Check auth on load
  checkAuthStatus();
})();

// ===== ADMIN TAB SWITCHING & WISH DASHBOARD =====
let currentTab = 'wishesList';
let activeFilter = 'all';
let approvingWishId = null;

function switchAdminTab(tabName) {
  currentTab = tabName;
  const tabWishes = document.getElementById('tabBtnWishesList');
  const tabNew = document.getElementById('tabBtnNewWish');
  const tabEditor = document.getElementById('tabBtnEditor');
  const viewList = document.getElementById('viewWishList');
  const viewEditor = document.getElementById('viewCustomizer');

  // Reset tab button styles
  [tabWishes, tabNew, tabEditor].forEach(btn => {
    if (btn) {
      btn.style.background = 'rgba(255,255,255,0.06)';
      btn.style.border = '1px solid rgba(255,255,255,0.15)';
      btn.style.boxShadow = 'none';
      btn.classList.remove('active');
    }
  });

  if (tabName === 'wishesList') {
    if (tabWishes) {
      tabWishes.style.background = 'linear-gradient(135deg, #a855f7, #ec4899)';
      tabWishes.style.border = 'none';
      tabWishes.style.boxShadow = '0 4px 15px rgba(218,94,201,0.3)';
      tabWishes.classList.add('active');
    }
    if (viewList) viewList.style.display = 'block';
    if (viewEditor) viewEditor.style.display = 'none';
    fetchAndRenderWishes(activeFilter);
  } else if (tabName === 'newWish') {
    if (tabNew) {
      tabNew.style.background = 'linear-gradient(135deg, #a855f7, #ec4899)';
      tabNew.style.border = 'none';
      tabNew.style.boxShadow = '0 4px 15px rgba(218,94,201,0.3)';
      tabNew.classList.add('active');
    }
    if (viewList) viewList.style.display = 'none';
    if (viewEditor) viewEditor.style.display = 'block';
    
    // Create clean new draft
    const newSlug = `wish-${Date.now().toString().slice(-4)}`;
    currentWishSlug = newSlug;
    S = {
      ...DEFAULT_SETTINGS,
      name: 'New Birthday Person',
      birthdayNote: 'Wishing you a magnificent birthday filled with joy and happiness! 🌸',
      wisherName: S.wisherName || ''
    };
    populateForm();
    if (typeof window.refreshMultiGrid === 'function') window.refreshMultiGrid();
    const slugInput = document.getElementById('wishSlugInput');
    if (slugInput) slugInput.value = newSlug;
    updateWishUrlPreview();
    document.getElementById('nameInput')?.focus();
  } else {
    // Customizer editor
    if (tabEditor) {
      tabEditor.style.background = 'linear-gradient(135deg, #a855f7, #ec4899)';
      tabEditor.style.border = 'none';
      tabEditor.style.boxShadow = '0 4px 15px rgba(218,94,201,0.3)';
      tabEditor.classList.add('active');
    }
    if (viewList) viewList.style.display = 'none';
    if (viewEditor) viewEditor.style.display = 'block';
  }
}

document.getElementById('tabBtnWishesList')?.addEventListener('click', () => switchAdminTab('wishesList'));
document.getElementById('tabBtnNewWish')?.addEventListener('click', () => switchAdminTab('newWish'));
document.getElementById('tabBtnEditor')?.addEventListener('click', () => switchAdminTab('editor'));

// Fetch & Render Wish List
async function fetchAndRenderWishes(filter = 'all') {
  activeFilter = filter;
  const grid = document.getElementById('wishesGrid');
  if (grid) grid.innerHTML = '<div style="color:rgba(255,255,255,0.6); grid-column:1/-1; text-align:center; padding:30px;">⏳ Loading wishes from database...</div>';

  try {
    const res = await fetch('/api/wishes/all');
    const json = await res.json();

    if (json.success && Array.isArray(json.wishes)) {
      const allWishes = json.wishes;
      
      // Update counters
      const pendingCount = allWishes.filter(w => w.status === 'pending').length;
      const approvedCount = allWishes.filter(w => w.status !== 'pending' && w.status !== 'rejected').length;
      
      const badge = document.getElementById('pendingBadge');
      if (badge) {
        if (pendingCount > 0) {
          badge.textContent = `${pendingCount} Pending`;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }

      document.getElementById('countAll').textContent = allWishes.length;
      document.getElementById('countPending').textContent = pendingCount;
      document.getElementById('countApproved').textContent = approvedCount;

      // Filter list
      let filtered = allWishes;
      if (filter === 'pending') filtered = allWishes.filter(w => w.status === 'pending');
      if (filter === 'approved') filtered = allWishes.filter(w => w.status === 'approved' || (!w.status && w.id));

      if (grid) {
        if (filtered.length === 0) {
          grid.innerHTML = '<div style="color:rgba(255,255,255,0.5); grid-column:1/-1; text-align:center; padding:40px; background:rgba(255,255,255,0.03); border-radius:14px;">No wishes found in this category.</div>';
          return;
        }

        grid.innerHTML = '';
        filtered.forEach(w => {
          const isPending = w.status === 'pending';
          const card = document.createElement('div');
          card.style.cssText = `
            background: linear-gradient(135deg, rgba(26,11,46,0.9), rgba(15,7,30,0.95));
            border: 1px solid ${isPending ? 'rgba(251,191,36,0.45)' : 'rgba(218,94,201,0.3)'};
            border-radius: 18px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
            transition: transform 0.2s, border-color 0.2s;
          `;

          const liveSlug = w.slug || w.id;
          const statusBadge = isPending 
            ? `<span style="background:rgba(251,191,36,0.15); border:1px solid rgba(251,191,36,0.4); color:#fbbf24; font-size:0.72rem; font-weight:800; padding:4px 10px; border-radius:12px; display:inline-flex; align-items:center; gap:4px;">⏳ PENDING APPROVAL</span>`
            : `<span style="background:rgba(52,211,153,0.15); border:1px solid rgba(52,211,153,0.4); color:#34d399; font-size:0.72rem; font-weight:800; padding:4px 10px; border-radius:12px; display:inline-flex; align-items:center; gap:4px;">✅ LIVE</span>`;

          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
              <div>
                <h4 style="margin:0; font-size:1.15rem; font-weight:700; color:#fff;">${escapeHtml(w.name || 'Birthday Wish')}</h4>
                <span style="font-size:0.75rem; color:rgba(255,255,255,0.45); font-family:monospace;">ID: ${w.id}</span>
              </div>
              <div>${statusBadge}</div>
            </div>

            <div style="font-size:0.82rem; color:rgba(255,255,255,0.75); display:flex; flex-direction:column; gap:4px; background:rgba(0,0,0,0.25); padding:10px; border-radius:10px;">
              <div><strong style="color:#f472b6;">Wisher:</strong> ${escapeHtml(w.wisherName || 'Friend')}</div>
              ${w.customerContact ? `<div><strong style="color:#38bdf8;">Contact:</strong> <span style="font-family:monospace;">${escapeHtml(w.customerContact)}</span></div>` : ''}
              ${w.birthdayNote ? `<div style="color:rgba(255,255,255,0.6); font-style:italic; margin-top:4px; font-size:0.78rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">"${escapeHtml(w.birthdayNote)}"</div>` : ''}
            </div>

            ${!isPending ? `
              <div style="font-size:0.78rem; display:flex; align-items:center; justify-content:space-between; background:rgba(56,189,248,0.08); padding:8px 10px; border-radius:8px; border:1px solid rgba(56,189,248,0.2);">
                <a href="/wish/${liveSlug}" target="_blank" style="color:#38bdf8; text-decoration:none; font-family:monospace; word-break:break-all;">.../wish/${liveSlug}</a>
                <button type="button" class="btn-copy-card-link" data-url="${window.location.origin}/wish/${liveSlug}" style="background:none; border:none; color:#e2e8f0; cursor:pointer; font-size:0.8rem;" title="Copy Link">📋</button>
              </div>
            ` : ''}

            <div style="display:flex; gap:8px; margin-top:auto; padding-top:6px;">
              ${isPending ? `
                <button type="button" class="btn-card-approve" data-id="${w.id}" data-name="${escapeHtml(w.name || '')}" data-wisher="${escapeHtml(w.wisherName || '')}" data-contact="${escapeHtml(w.customerContact || '')}" style="flex:1; background:linear-gradient(135deg, #10b981, #059669); border:none; color:#fff; border-radius:10px; padding:9px; font-size:0.82rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:0 4px 15px rgba(16,185,129,0.3);">
                  ✅ Approve & Make Live
                </button>
              ` : ''}
              <button type="button" class="btn-card-edit" data-id="${w.id}" data-slug="${liveSlug}" style="flex:1; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; border-radius:10px; padding:9px; font-size:0.82rem; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;">
                ✏️ Edit
              </button>
              ${(w.id !== 'default' && w.id !== 'hasif') ? `
                <button type="button" class="btn-card-delete" data-id="${w.id}" style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; border-radius:10px; padding:9px 12px; font-size:0.82rem; font-weight:600; cursor:pointer;" title="Delete Wish">
                  🗑️
                </button>
              ` : ''}
            </div>
          `;

          grid.appendChild(card);
        });

        attachCardActionListeners();
      }
    }
  } catch (err) {
    if (grid) grid.innerHTML = '<div style="color:#ef4444; grid-column:1/-1; text-align:center; padding:30px;">Error loading wishes from database.</div>';
  }
}

// Helper to escape HTML safely
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Attach action listeners on card buttons
function attachCardActionListeners() {
  // 1. Approve Button
  document.querySelectorAll('.btn-card-approve').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const name = this.getAttribute('data-name');
      const wisher = this.getAttribute('data-wisher');
      const contact = this.getAttribute('data-contact');

      approvingWishId = id;
      document.getElementById('approveModalName').textContent = name || id;
      document.getElementById('approveModalWisher').textContent = wisher || 'Friend';
      document.getElementById('approveModalContact').textContent = contact || 'N/A';

      const suggestedSlug = (name ? name.toLowerCase().replace(/[^a-z0-9]/g, '-') : id).replace(/-+/g, '-');
      const slugInput = document.getElementById('approveSlugInput');
      if (slugInput) slugInput.value = suggestedSlug;

      updateApproveLivePreview(suggestedSlug);

      const modal = document.getElementById('modalApproveWish');
      if (modal) modal.style.display = 'flex';
    });
  });

  // 2. Edit Button
  document.querySelectorAll('.btn-card-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const slug = this.getAttribute('data-slug') || id;
      currentWishSlug = slug;
      switchAdminTab('editor');
      fetchServerSettings(slug);
    });
  });

  // 3. Delete Button
  document.querySelectorAll('.btn-card-delete').forEach(btn => {
    btn.addEventListener('click', async function() {
      const id = this.getAttribute('data-id');
      if (confirm(`Are you sure you want to permanently delete wish "${id}"?`)) {
        try {
          await fetch(`/api/wishes/${id}`, { method: 'DELETE' });
          showToast(`🗑️ Deleted wish "${id}"`, 'info');
          fetchAndRenderWishes(activeFilter);
        } catch (e) {}
      }
    });
  });

  // 4. Copy Card Link
  document.querySelectorAll('.btn-copy-card-link').forEach(btn => {
    btn.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast(`📋 Copied Link: ${url}`, 'success');
        });
      } else {
        prompt('Copy Live Wish Link:', url);
      }
    });
  });
}

function updateApproveLivePreview(slug) {
  const preview = document.getElementById('approveLivePreview');
  if (preview) {
    preview.textContent = `${window.location.origin}/wish/${slug || 'custom-name'}`;
  }
}

document.getElementById('approveSlugInput')?.addEventListener('input', function() {
  const clean = this.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  updateApproveLivePreview(clean);
});

// Modal Close & Approve Confirmation
document.getElementById('btnCloseApproveModal')?.addEventListener('click', () => {
  const modal = document.getElementById('modalApproveWish');
  if (modal) modal.style.display = 'none';
});

document.getElementById('btnConfirmApprove')?.addEventListener('click', async () => {
  if (!approvingWishId) return;
  const slugInput = document.getElementById('approveSlugInput');
  const slug = (slugInput ? slugInput.value : approvingWishId).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  try {
    const res = await fetch(`/api/wishes/approve/${approvingWishId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    });
    const json = await res.json();

    if (json.success) {
      showToast(`🎉 Approved! Live at: /wish/${slug}`, 'success');
      const modal = document.getElementById('modalApproveWish');
      if (modal) modal.style.display = 'none';
      fetchAndRenderWishes(activeFilter);
      fetchWishesList();
    } else {
      alert(json.message || 'Error approving wish');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

document.getElementById('btnConfirmReject')?.addEventListener('click', async () => {
  if (!approvingWishId) return;
  if (confirm('Are you sure you want to reject this wish request?')) {
    try {
      await fetch(`/api/wishes/reject/${approvingWishId}`, { method: 'POST' });
      showToast('❌ Wish request marked as rejected', 'info');
      const modal = document.getElementById('modalApproveWish');
      if (modal) modal.style.display = 'none';
      fetchAndRenderWishes(activeFilter);
    } catch (e) {}
  }
});

// Filter Tab Buttons
document.querySelectorAll('.wish-filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.wish-filter-btn').forEach(b => {
      b.style.background = 'rgba(255,255,255,0.06)';
      b.style.border = '1px solid rgba(255,255,255,0.15)';
      b.classList.remove('active');
    });
    this.style.background = '#da5ec9';
    this.style.border = 'none';
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');
    fetchAndRenderWishes(filter);
  });
});

document.getElementById('btnRefreshWishList')?.addEventListener('click', () => {
  fetchAndRenderWishes(activeFilter);
  showToast('🔄 Wish list refreshed', 'info');
});

// SSE Live Stream for Admin Notifications
if (typeof EventSource !== 'undefined') {
  try {
    const adminSSE = new EventSource('/api/events');
    adminSSE.addEventListener('new_wish_request', (e) => {
      try {
        const data = JSON.parse(e.data);
        showToast(`🔔 New Wish Request from ${data.name || 'Customer'}!`, 'info');
        fetchAndRenderWishes(activeFilter);
      } catch (err) {}
    });
  } catch (e) {}
}

// Wish Selector & Slug Controls in Customizer
document.getElementById('wishSelector')?.addEventListener('change', function() {
  const selectedSlug = this.value;
  if (selectedSlug) {
    currentWishSlug = selectedSlug;
    fetchServerSettings(selectedSlug);
  }
});

document.getElementById('wishSlugInput')?.addEventListener('input', function() {
  updateWishUrlPreview();
});

document.getElementById('btnNewWish')?.addEventListener('click', () => {
  switchAdminTab('newWish');
});

document.getElementById('btnCopyWishUrl')?.addEventListener('click', () => {
  const slugInput = document.getElementById('wishSlugInput');
  const slug = (slugInput ? slugInput.value : currentWishSlug || 'hasif').trim().toLowerCase();
  const fullUrl = `${window.location.origin}/wish/${slug}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullUrl).then(() => {
      showToast(`📋 Unique Wish URL copied: ${fullUrl}`, 'success');
    }).catch(() => {
      prompt('Copy your unique wish link:', fullUrl);
    });
  } else {
    prompt('Copy your unique wish link:', fullUrl);
  }
});

document.getElementById('btnDeleteWish')?.addEventListener('click', async () => {
  const slug = currentWishSlug;
  if (!slug || slug === 'default' || slug === 'hasif') {
    alert('Cannot delete default wish');
    return;
  }
  if (confirm(`Delete wish "${slug}" permanently?`)) {
    try {
      await fetch(`/api/wishes/${slug}`, { method: 'DELETE' });
      showToast(`🗑️ Deleted wish "${slug}"`, 'info');
      currentWishSlug = 'default';
      await fetchWishesList();
      await fetchServerSettings('default');
    } catch (e) {}
  }
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  checkSupabaseStatus();
  fetchWishesList();
  fetchAndRenderWishes('all');
  fetchServerSettings();
});
checkSupabaseStatus();
fetchWishesList();
fetchAndRenderWishes('all');
fetchServerSettings();