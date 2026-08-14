const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

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
  adminPassword: 'birthday123'
};

// ===== DATABASE INITIALIZATION (SQLite) =====
let db;
try {
  const dbPath = path.join(dataDir, 'birthday.sqlite');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Create settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if initial row exists
  const row = db.prepare('SELECT id, data FROM settings WHERE id = 1').get();
  if (!row) {
    db.prepare('INSERT INTO settings (id, data) VALUES (1, ?)').run(JSON.stringify(DEFAULT_SETTINGS));
  }
  console.log('✅ SQLite Database connected & initialized');
} catch (err) {
  console.error('⚠️ SQLite Init Error, falling back to JSON storage:', err.message);
}

// Database helper functions
const fallbackJsonPath = path.join(dataDir, 'settings.json');

function getDbSettings() {
  if (db) {
    try {
      const row = db.prepare('SELECT data FROM settings WHERE id = 1').get();
      if (row && row.data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(row.data) };
      }
    } catch (e) {
      console.error('Error reading from DB:', e);
    }
  }

  // Fallback to JSON file
  try {
    if (fs.existsSync(fallbackJsonPath)) {
      const fileData = fs.readFileSync(fallbackJsonPath, 'utf8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(fileData) };
    }
  } catch (e) {}

  return { ...DEFAULT_SETTINGS };
}

function saveDbSettings(newSettings) {
  const merged = { ...DEFAULT_SETTINGS, ...newSettings };
  const jsonStr = JSON.stringify(merged);

  if (db) {
    try {
      db.prepare(`
        INSERT INTO settings (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
      `).run(jsonStr);
    } catch (e) {
      console.error('Error saving to DB:', e);
    }
  }

  // Also write backup JSON file
  try {
    fs.writeFileSync(fallbackJsonPath, jsonStr, 'utf8');
  } catch (e) {}

  return merged;
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
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  // Send initial ping & current settings
  const current = getDbSettings();
  res.write(`event: initial\ndata: ${JSON.stringify(current)}\n\n`);

  const client = { id: Date.now() + Math.random(), res };
  sseClients.add(client);

  // Heartbeat to prevent timeouts
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

// ===== FILE UPLOAD CONFIGURATION (Multer) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Upload Single File API
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Upload Multiple Files API
app.post('/api/upload-multiple', upload.array('files', 12), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files uploaded' });
  }
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({
    success: true,
    urls,
    count: req.files.length
  });
});

// ===== REST API ENDPOINTS =====

// 1. Get Settings
app.get('/api/settings', (req, res) => {
  const settings = getDbSettings();
  res.json({ success: true, data: settings });
});

// 2. Save Settings (and trigger real-time broadcast)
app.post('/api/settings', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings payload' });
    }

    const saved = saveDbSettings(incoming);

    // Broadcast to all active frontend pages immediately
    broadcastLiveUpdate('settings_updated', saved);

    res.json({
      success: true,
      message: 'Settings saved and broadcasted live to all clients',
      data: saved
    });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Reset Settings
app.post('/api/reset', (req, res) => {
  try {
    const saved = saveDbSettings(DEFAULT_SETTINGS);
    broadcastLiveUpdate('settings_updated', saved);
    res.json({
      success: true,
      message: 'Settings reset to defaults and broadcasted live',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend static files
app.use(express.static(__dirname));

// Explicit page routes
app.get(['/', '/index', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get(['/gift', '/gift.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'gift.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  🎉 Birthday Wish Server running successfully!
  --------------------------------------------------
  ➜ Live Website:     http://localhost:${PORT}/
  ➜ Admin Panel:      http://localhost:${PORT}/admin.html
  ➜ Gift Page:        http://localhost:${PORT}/gift.html
  ➜ SSE Live Sync:    http://localhost:${PORT}/api/events
  ➜ Database:         SQLite (${path.join(dataDir, 'birthday.sqlite')})
  --------------------------------------------------
  `);
});
