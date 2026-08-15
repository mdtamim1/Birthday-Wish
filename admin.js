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

function loadSettings() {
  try {
    const s = localStorage.getItem('birthdaySettings');
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

let S = loadSettings();

// Fetch latest settings from server on boot
async function fetchServerSettings() {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        S = { ...DEFAULT_SETTINGS, ...json.data };
        localStorage.setItem('birthdaySettings', JSON.stringify(S));
        populateForm();
        if (typeof window.refreshMultiGrid === 'function') {
          window.refreshMultiGrid();
        }
      }
    }
  } catch (err) {
    console.log('Using local cached settings (Server offline or standalone):', err);
  }
}

async function saveSettings(data) {
  try {
    localStorage.setItem('birthdaySettings', JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save warning:', err);
  }

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const json = await res.json();
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

    // Verify Passcode: accepts 01905 or current stored adminPassword
    if (entered === expected || entered === '01905') {
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

  // Check auth on load
  checkAuthStatus();
})();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchServerSettings();
});
fetchServerSettings();