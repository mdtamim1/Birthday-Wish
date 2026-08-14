/* ============================================================
   ADMIN.JS — Admin Panel Logic
   ============================================================ */

// ===== SETTINGS =====
const DEFAULT_SETTINGS = {
  name: 'Your Name',
  birthdate: '',
  specialText: 'May all your dreams come true today and always 🌸',
  birthdayNote: "On this special day, I just want you to know how truly amazing you are. Every moment with you is a gift, and I am so grateful you were born. Here's to a year filled with joy, laughter, and all the love you deserve!",
  photo: '',
  photos: [],
  showFloatingMemories: true,
  showWisher: false,
  wisherName: '',
  musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-155461.mp3',
  musicEnabled: true,
  themeId: 'galaxy-violet',
  themeColor1: '#da5ec9',
  themeColor2: '#ec4899',
  themeAccent: '#fd8ae0',
  giftMessage: 'This gift is wrapped with all my love for you! 💝',
  giftPhoto: '',
  showBirthdate: true,
  showGift: true,
  adminPassword: 'birthday123',
};

function loadSettings() {
  try {
    const s = localStorage.getItem('birthdaySettings');
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

function saveSettings(data) {
  localStorage.setItem('birthdaySettings', JSON.stringify(data));
}

let S = loadSettings();

// ===== INITIALIZE ADMIN PANEL DIRECTLY =====
document.addEventListener('DOMContentLoaded', populateForm);
populateForm();

// ===== POPULATE FORM =====
function populateForm() {
  document.getElementById('nameInput').value = S.name;
  document.getElementById('birthdateInput').value = S.birthdate;
  document.getElementById('specialTextInput').value = S.specialText;
  document.getElementById('birthdayNoteInput').value = S.birthdayNote;
  updateCharCount();
  document.getElementById('wisherNameInput').value = S.wisherName;
  document.getElementById('showWisherToggle').checked = S.showWisher;
  document.getElementById('wisherNameGroup').style.display = S.showWisher ? 'flex' : 'none';
  document.getElementById('giftMessageInput').value = S.giftMessage;
  document.getElementById('musicUrlInput').value = S.musicUrl;
  document.getElementById('musicEnabledToggle').checked = S.musicEnabled;
  document.getElementById('color1Input').value = S.themeColor1;
  document.getElementById('color1Text').value = S.themeColor1;
  document.getElementById('color2Input').value = S.themeColor2;
  document.getElementById('color2Text').value = S.themeColor2;
  document.getElementById('colorAccentInput').value = S.themeAccent;
  document.getElementById('colorAccentText').value = S.themeAccent;
  document.getElementById('showBirthdateToggle').checked = S.showBirthdate;
  const floatToggle = document.getElementById('showFloatingMemoriesToggle');
  if (floatToggle) floatToggle.checked = S.showFloatingMemories !== false;
  document.getElementById('showGiftToggle').checked = S.showGift;
  updateThemePreview();

  // Photos
  if (S.photo) showPhotoPreview(S.photo, 'main');
  if (S.giftPhoto) showPhotoPreview(S.giftPhoto, 'gift');
}

// ===== COLLECT FORM DATA =====
function collectFormData() {
  const floatToggle = document.getElementById('showFloatingMemoriesToggle');
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
  };
}

function doSave() {
  S = collectFormData();
  saveSettings(S);
  showToast('✅ Changes saved successfully!', 'success');
  document.getElementById('saveStatus').textContent = '✓ Saved just now';
  setTimeout(() => { document.getElementById('saveStatus').textContent = ''; }, 4000);
}

document.getElementById('saveBtn').addEventListener('click', doSave);
document.getElementById('saveBtnTop').addEventListener('click', doSave);

// ===== SHAREABLE WISH LINK GENERATOR =====
function generateShareableLink() {
  S = collectFormData();
  saveSettings(S);

  const sharePayload = {
    name: S.name,
    birthdate: S.birthdate,
    specialText: S.specialText,
    birthdayNote: S.birthdayNote,
    wisherName: S.wisherName,
    showWisher: S.showWisher,
    giftMessage: S.giftMessage,
    musicUrl: S.musicUrl,
    themeId: S.themeId,
    showBirthdate: S.showBirthdate
  };

  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(sharePayload))));
  const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '').replace('admin', '') + 'index.html';
  const fullUrl = `${baseUrl}?data=${encoded}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullUrl).then(() => {
      showToast('📋 Shareable Wish Link copied to clipboard!', 'success');
    }).catch(() => {
      prompt('Copy your customized wish link:', fullUrl);
    });
  } else {
    prompt('Copy your customized wish link:', fullUrl);
  }
}

const shareBtn = document.getElementById('shareWishLinkBtn');
if (shareBtn) shareBtn.addEventListener('click', generateShareableLink);

// Auto-save hint on input
let autoSaveTimer;
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    document.getElementById('saveStatus').textContent = '● Unsaved changes';
    document.getElementById('saveStatus').style.color = '#fbbf24';
  });
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all settings to default? This cannot be undone.')) {
    const adminPw = S.adminPassword;
    S = { ...DEFAULT_SETTINGS, adminPassword: adminPw };
    saveSettings(S);
    populateForm();
    showToast('🔄 Reset to defaults', 'success');
  }
});

// ===== PHOTO UPLOADS =====
function setupPhotoUpload(uploadAreaId, inputId, previewWrapId, previewImgId, placeholderId, removeId, storageKey) {
  const area = document.getElementById(uploadAreaId);
  const input = document.getElementById(inputId);
  const previewWrap = document.getElementById(previewWrapId);
  const previewImg = document.getElementById(previewImgId);
  const placeholder = document.getElementById(placeholderId);
  const removeBtn = document.getElementById(removeId);

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

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    S[storageKey] = '';
    previewWrap.style.display = 'none';
    placeholder.style.display = 'flex';
    input.value = '';
  });
}

function processImageFile(file, storageKey, previewWrap, previewImg, placeholder) {
  if (file.size > 5 * 1024 * 1024) { showToast('❌ File too large (max 5MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    S[storageKey] = e.target.result;
    previewImg.src = e.target.result;
    previewWrap.style.display = 'block';
    placeholder.style.display = 'none';
    showToast('📸 Photo uploaded!', 'success');
  };
  reader.readAsDataURL(file);
}

function showPhotoPreview(src, type) {
  if (type === 'main') {
    document.getElementById('photoPreview').src = src;
    document.getElementById('photoPreviewWrap').style.display = 'block';
    document.getElementById('photoPlaceholder').style.display = 'none';
  } else {
    document.getElementById('giftPhotoPreview').src = src;
    document.getElementById('giftPhotoPreviewWrap').style.display = 'block';
    document.getElementById('giftPhotoPlaceholder').style.display = 'none';
  }
}

setupPhotoUpload('photoUploadArea','photoInput','photoPreviewWrap','photoPreview','photoPlaceholder','photoRemoveBtn','photo');
setupPhotoUpload('giftPhotoUploadArea','giftPhotoInput','giftPhotoPreviewWrap','giftPhotoPreview','giftPhotoPlaceholder','giftPhotoRemoveBtn','giftPhoto');

// ===== WISHER TOGGLE =====
document.getElementById('showWisherToggle').addEventListener('change', function() {
  document.getElementById('wisherNameGroup').style.display = this.checked ? 'flex' : 'none';
});

// ===== CHARACTER COUNTER =====
function updateCharCount() {
  const note = document.getElementById('birthdayNoteInput');
  document.getElementById('noteCharCount').textContent = note.value.length;
}
document.getElementById('birthdayNoteInput').addEventListener('input', updateCharCount);

// ===== COLOR PICKERS =====
function syncColor(pickerId, textId) {
  const picker = document.getElementById(pickerId);
  const text = document.getElementById(textId);
  picker.addEventListener('input', () => { text.value = picker.value; updateThemePreview(); });
  text.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(text.value)) { picker.value = text.value; updateThemePreview(); }
  });
}
syncColor('color1Input','color1Text');
syncColor('color2Input','color2Text');
syncColor('colorAccentInput','colorAccentText');

function updateThemePreview() {
  const c1 = document.getElementById('color1Input').value;
  const c2 = document.getElementById('color2Input').value;
  const ca = document.getElementById('colorAccentInput').value;
  document.getElementById('themePreviewBar').style.background = `linear-gradient(135deg, ${c1}, ${c2}, ${ca})`;
}

// Theme presets
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const c1 = btn.dataset.c1, c2 = btn.dataset.c2, ca = btn.dataset.ca;
    if (btn.dataset.theme) S.themeId = btn.dataset.theme;
    document.getElementById('color1Input').value = c1;
    document.getElementById('color1Text').value = c1;
    document.getElementById('color2Input').value = c2;
    document.getElementById('color2Text').value = c2;
    document.getElementById('colorAccentInput').value = ca;
    document.getElementById('colorAccentText').value = ca;
    updateThemePreview();
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});


// ===== SIDEBAR NAV (scroll highlight + mobile) =====
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));

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
    if (window.innerWidth < 900) sidebar.classList.remove('open');
  });
});

// Close sidebar on outside click
document.addEventListener('click', (e) => {
  if (window.innerWidth < 900 && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && e.target !== hamburger) {
      sidebar.classList.remove('open');
    }
  }
});

// Intersection observer for active nav
const sections = document.querySelectorAll('.admin-section');
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

// ===== TOAST =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Shake animation for password error
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  .shake { animation: shake 0.5s ease; }
`;
document.head.appendChild(style);

// ===== MULTI PHOTO GALLERY UPLOAD =====
(function() {
  var multiDrop = document.getElementById('multiPhotoDrop');
  var multiInput = document.getElementById('multiPhotoInput');
  var multiGrid = document.getElementById('multiPhotoGrid');
  var multiPlaceholder = document.getElementById('multiPhotoPlaceholder');

  if (!multiDrop) return;

  function refreshGrid() {
    multiGrid.innerHTML = '';
    if (!S.photos || S.photos.length === 0) {
      multiPlaceholder.style.display = 'block';
      return;
    }
    multiPlaceholder.style.display = 'none';
    S.photos.forEach(function(src, i) {
      var thumb = document.createElement('div');
      thumb.className = 'multi-photo-thumb';
      var img = document.createElement('img');
      img.src = src;
      var removeBtn = document.createElement('button');
      removeBtn.className = 'thumb-remove';
      removeBtn.textContent = 'x';
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        S.photos.splice(i, 1);
        saveSettings(S);
        refreshGrid();
        showToast('Photo removed', 'success');
      });
      var numEl = document.createElement('span');
      numEl.className = 'thumb-num';
      numEl.textContent = (i + 1);
      thumb.appendChild(img);
      thumb.appendChild(removeBtn);
      thumb.appendChild(numEl);
      multiGrid.appendChild(thumb);
    });
  }

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

  function processMultiFiles(files) {
    if (!S.photos) S.photos = [];
    var remaining = 10 - S.photos.length;
    var toProcess = Math.min(files.length, remaining);
    if (toProcess <= 0) { showToast('Max 10 photos allowed', 'error'); return; }
    var loaded = 0;
    for (var i = 0; i < toProcess; i++) {
      (function(file) {
        if (file.size > 5 * 1024 * 1024) { showToast('File too large: ' + file.name, 'error'); return; }
        var reader = new FileReader();
        reader.onload = function(ev) {
          S.photos.push(ev.target.result);
          loaded++;
          if (loaded === toProcess) {
            saveSettings(S);
            refreshGrid();
            showToast('Added ' + toProcess + ' photo(s)!', 'success');
          }
        };
        reader.readAsDataURL(file);
      })(files[i]);
    }
    multiInput.value = '';
  }

  // Populate on load
  if (!S.photos) S.photos = [];
  refreshGrid();
})();