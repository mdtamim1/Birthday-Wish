require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Database = require('better-sqlite3');
const { supabase, isSupabaseConfigured, SUPABASE_SCHEMA_SQL } = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists (local fallback)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve uploads with explicit CORS and caching headers for Canvas export compatibility
app.use('/uploads', cors(), express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

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
  adminPassword: '01905'
};

const fallbackJsonPath = path.join(dataDir, 'settings.json');

// Helper to safely read JSON file
function readSettingsFromJson() {
  try {
    if (fs.existsSync(fallbackJsonPath)) {
      const fileData = fs.readFileSync(fallbackJsonPath, 'utf8');
      const parsed = JSON.parse(fileData);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading JSON settings:', e.message);
  }
  return null;
}

// ===== DATABASE INITIALIZATION (SQLite with multi-wish support) =====
let db;
try {
  const dbPath = path.join(dataDir, 'birthday.sqlite');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Create settings table (legacy default)
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create wishes table for multi-wish unique slugs
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check existing SQLite data vs fallback JSON
  const row = db.prepare('SELECT id, data FROM settings WHERE id = 1').get();
  const jsonSettings = readSettingsFromJson();

  let initialSettings = { ...DEFAULT_SETTINGS };

  if (row && row.data) {
    try {
      const dbParsed = JSON.parse(row.data);
      initialSettings = { ...DEFAULT_SETTINGS, ...dbParsed };
    } catch (e) {}
  } else if (jsonSettings) {
    initialSettings = { ...DEFAULT_SETTINGS, ...jsonSettings };
    db.prepare('INSERT INTO settings (id, data) VALUES (1, ?)').run(JSON.stringify(initialSettings));
  } else {
    db.prepare('INSERT INTO settings (id, data) VALUES (1, ?)').run(JSON.stringify(DEFAULT_SETTINGS));
  }

  // Seed default and hasif wish slugs in wishes table
  db.prepare("INSERT OR REPLACE INTO wishes (id, data) VALUES ('default', ?)").run(JSON.stringify(initialSettings));
  db.prepare("INSERT OR REPLACE INTO wishes (id, data) VALUES ('hasif', ?)").run(JSON.stringify(initialSettings));

  // Ensure JSON file is also in sync with initialSettings
  fs.writeFileSync(fallbackJsonPath, JSON.stringify(initialSettings), 'utf8');
  console.log('✅ SQLite & JSON storage synchronized & initialized');
} catch (err) {
  console.error('⚠️ SQLite Init Error, falling back to JSON storage:', err.message);
}

// ===== UNIFIED CLOUD & LOCAL DATA ADAPTER =====
async function getWishById(slug = 'default') {
  const cleanId = (slug || 'default').toLowerCase().trim();

  // 1. Try Supabase Cloud Database if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('birthday_wishes')
        .select('*')
        .eq('id', cleanId)
        .maybeSingle();

      if (!error && data) {
        const payload = data.data && typeof data.data === 'object' ? data.data : data;
        return { ...DEFAULT_SETTINGS, ...payload, id: cleanId };
      }
    } catch (err) {
      console.warn('Supabase fetch error, falling back to local:', err.message);
    }
  }

  // 2. Local SQLite lookup
  if (db) {
    try {
      const row = db.prepare('SELECT data FROM wishes WHERE id = ?').get(cleanId);
      if (row && row.data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(row.data), id: cleanId };
      }
      // If default, check legacy table
      if (cleanId === 'default') {
        const legacyRow = db.prepare('SELECT data FROM settings WHERE id = 1').get();
        if (legacyRow && legacyRow.data) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(legacyRow.data), id: 'default' };
        }
      }
    } catch (e) {
      console.error('Error reading wish from SQLite:', e.message);
    }
  }

  // 3. Fallback to settings.json
  if (cleanId === 'default') {
    const jsonSettings = readSettingsFromJson();
    if (jsonSettings) {
      return { ...DEFAULT_SETTINGS, ...jsonSettings, id: 'default' };
    }
  }

  return { ...DEFAULT_SETTINGS, id: cleanId };
}

async function saveWishById(slug = 'default', newSettings = {}) {
  const cleanId = (slug || 'default').toLowerCase().trim();
  const current = await getWishById(cleanId);
  const merged = { ...DEFAULT_SETTINGS, ...current, ...newSettings, id: cleanId };
  const jsonStr = JSON.stringify(merged);

  // 1. Save to Supabase Cloud Database
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('birthday_wishes')
        .upsert({
          id: cleanId,
          name: merged.name || 'Your Name',
          birthdate: merged.birthdate || '',
          special_text: merged.specialText || '',
          birthday_note: merged.birthdayNote || '',
          wisher_name: merged.wisherName || '',
          show_wisher: !!merged.showWisher,
          gift_message: merged.giftMessage || '',
          photo: merged.photo || '',
          photos: merged.photos || [],
          gift_photo: merged.giftPhoto || '',
          voice_url: merged.voiceUrl || '',
          voice_title: merged.voiceTitle || '',
          show_voice_note: merged.showVoiceNote !== false,
          music_url: merged.musicUrl || '',
          music_enabled: merged.musicEnabled !== false,
          theme_id: merged.themeId || 'galaxy-violet',
          theme_color1: merged.themeColor1 || '#da5ec9',
          theme_color2: merged.themeColor2 || '#ec4899',
          theme_accent: merged.themeAccent || '#fd8ae0',
          show_birthdate: merged.showBirthdate !== false,
          show_floating_memories: merged.showFloatingMemories !== false,
          show_gift: merged.showGift !== false,
          data: merged,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase save error:', error.message);
      } else {
        console.log(`⚡ Wish "${cleanId}" saved permanently to Supabase Cloud Database`);
      }
    } catch (err) {
      console.warn('Supabase upsert failed:', err.message);
    }
  }

  // 2. Save to Local SQLite
  if (db) {
    try {
      db.prepare(`
        INSERT INTO wishes (id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
      `).run(cleanId, jsonStr);

      if (cleanId === 'default') {
        db.prepare(`
          INSERT INTO settings (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
        `).run(jsonStr);
      }
    } catch (e) {
      console.error('Error saving wish to SQLite:', e.message);
    }
  }

  // 3. Backup settings.json for default
  if (cleanId === 'default') {
    try {
      fs.writeFileSync(fallbackJsonPath, jsonStr, 'utf8');
    } catch (e) {}
  }

  return merged;
}

async function listAllWishes() {
  const wishes = [];
  const seenIds = new Set();

  // 1. Fetch from Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('birthday_wishes')
        .select('id, name, wisher_name, updated_at, data')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        data.forEach(item => {
          seenIds.add(item.id);
          wishes.push({
            id: item.id,
            name: item.name || (item.data && item.data.name) || 'Birthday Wish',
            wisherName: item.wisher_name || (item.data && item.data.wisherName) || '',
            updatedAt: item.updated_at
          });
        });
      }
    } catch (err) {
      console.warn('Supabase list error:', err.message);
    }
  }

  // 2. Fetch from Local SQLite
  if (db) {
    try {
      const rows = db.prepare('SELECT id, data, updated_at FROM wishes ORDER BY updated_at DESC').all();
      rows.forEach(r => {
        if (!seenIds.has(r.id)) {
          seenIds.add(r.id);
          let parsed = {};
          try { parsed = JSON.parse(r.data); } catch (e) {}
          wishes.push({
            id: r.id,
            name: parsed.name || 'Birthday Wish',
            wisherName: parsed.wisherName || '',
            updatedAt: r.updated_at
          });
        }
      });
    } catch (e) {}
  }

  if (wishes.length === 0) {
    wishes.push({ id: 'default', name: 'Default Wish', wisherName: '', updatedAt: new Date().toISOString() });
  }

  return wishes;
}

async function deleteWishById(slug) {
  const cleanId = (slug || '').toLowerCase().trim();
  if (!cleanId || cleanId === 'default') return false;

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('birthday_wishes').delete().eq('id', cleanId);
    } catch (e) {}
  }

  if (db) {
    try {
      db.prepare('DELETE FROM wishes WHERE id = ?').run(cleanId);
    } catch (e) {}
  }

  return true;
}

// ===== REAL-TIME SSE (Server-Sent Events) BROADCASTER =====
const sseClients = new Set();

function broadcastLiveUpdate(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.res.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

// SSE Connection Endpoint
app.get('/api/events', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const wishId = req.query.id || 'default';
  const current = await getWishById(wishId);
  res.write(`event: initial\ndata: ${JSON.stringify(current)}\n\n`);

  const client = { id: Date.now() + Math.random(), res, wishId };
  sseClients.add(client);

  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (e) {
      clearInterval(heartbeat);
      sseClients.delete(client);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(client);
  });
});

// ===== FILE UPLOAD CONFIGURATION (Multer with Supabase Storage Support) =====
const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Helper: Upload file to Supabase Storage Bucket or Local Disk
async function processAndSaveFile(file) {
  const ext = path.extname(file.originalname) || '.jpg';
  const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${safeBase}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

  // 1. Try uploading to Supabase Storage bucket 'birthday-uploads'
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('birthday-uploads')
        .upload(filename, file.buffer, {
          contentType: file.mimetype || 'image/jpeg',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('birthday-uploads')
          .getPublicUrl(filename);

        if (publicUrlData && publicUrlData.publicUrl) {
          console.log('⚡ File uploaded to Supabase Storage CDN:', publicUrlData.publicUrl);
          return { url: publicUrlData.publicUrl, filename, isCloud: true };
        }
      } else {
        console.warn('Supabase storage upload error:', error ? error.message : 'Unknown error');
      }
    } catch (storageErr) {
      console.warn('Supabase storage exception:', storageErr.message);
    }
  }

  // 2. Fallback to local disk storage in /uploads
  const localFilePath = path.join(uploadsDir, filename);
  fs.writeFileSync(localFilePath, file.buffer);
  return { url: `/uploads/${filename}`, filename, isCloud: false };
}

// Upload Single File API
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  try {
    const result = await processAndSaveFile(req.file);
    res.json({
      success: true,
      url: result.url,
      filename: result.filename,
      isCloud: result.isCloud,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('File processing error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload Multiple Files API
app.post('/api/upload-multiple', upload.array('files', 12), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files uploaded' });
  }
  try {
    const urls = [];
    for (const file of req.files) {
      const result = await processAndSaveFile(file);
      urls.push(result.url);
    }
    res.json({
      success: true,
      urls,
      count: req.files.length
    });
  } catch (err) {
    console.error('Multiple files upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== REST API ENDPOINTS =====

// 1. Get Settings / Wish (supports ?id=slug)
app.get('/api/settings', async (req, res) => {
  const wishId = req.query.id || 'default';
  const settings = await getWishById(wishId);
  res.json({ success: true, data: settings, wishId });
});

// 2. Save Settings / Wish
app.post('/api/settings', async (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings payload' });
    }

    const wishId = incoming.id || req.query.id || 'default';
    const saved = await saveWishById(wishId, incoming);

    // Broadcast live SSE update
    broadcastLiveUpdate('settings_updated', saved);

    res.json({
      success: true,
      message: 'Wish saved permanently to Supabase Cloud Database',
      data: saved,
      wishId
    });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Multi-Wish Management Endpoints
app.get('/api/wishes', async (req, res) => {
  try {
    const wishes = await listAllWishes();
    res.json({ success: true, wishes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/wishes/:id', async (req, res) => {
  try {
    const wish = await getWishById(req.params.id);
    res.json({ success: true, data: wish });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/wishes/:id', async (req, res) => {
  try {
    const saved = await saveWishById(req.params.id, req.body);
    broadcastLiveUpdate('settings_updated', saved);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/wishes/:id', async (req, res) => {
  try {
    const success = await deleteWishById(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Supabase Status & SQL Schema Helper
app.get('/api/supabase-status', (req, res) => {
  res.json({
    configured: isSupabaseConfigured(),
    url: process.env.SUPABASE_URL || null,
    schemaSql: SUPABASE_SCHEMA_SQL
  });
});

// 5. Reset Settings
app.post('/api/reset', async (req, res) => {
  try {
    const wishId = req.query.id || 'default';
    const saved = await saveWishById(wishId, DEFAULT_SETTINGS);
    broadcastLiveUpdate('settings_updated', saved);
    res.json({
      success: true,
      message: 'Settings reset to defaults',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend static files with anti-cache headers
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Multi-Wish dynamic URL routes (/wish/:id, /w/:id)
app.get(['/wish/:id', '/w/:id', '/wish', '/w'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicit page routes
app.get(['/', '/index', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get(['/gift', '/gift.html', '/gift/:id'], (req, res) => {
  res.sendFile(path.join(__dirname, 'gift.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  🎉 Birthday Wish Cloud Server running!
  --------------------------------------------------
  ➜ Live Website:       http://localhost:${PORT}/
  ➜ Unique Wish URL:    http://localhost:${PORT}/wish/hasif
  ➜ Admin Panel:        http://localhost:${PORT}/admin.html
  ➜ Gift Page:          http://localhost:${PORT}/gift.html
  ➜ Supabase Status:    ${isSupabaseConfigured() ? '⚡ Connected to Cloud DB' : '📁 Local Storage (Set SUPABASE_URL in .env to connect)'}
  --------------------------------------------------
  `);
});

