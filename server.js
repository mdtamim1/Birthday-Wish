require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
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

  // Create wishes table for multi-wish unique slugs and tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      slug TEXT,
      status TEXT DEFAULT 'approved',
      customer_name TEXT,
      customer_contact TEXT,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Ensure columns exist if table was previously created without them
  try { db.exec("ALTER TABLE wishes ADD COLUMN slug TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE wishes ADD COLUMN status TEXT DEFAULT 'approved';"); } catch (e) {}
  try { db.exec("ALTER TABLE wishes ADD COLUMN customer_name TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE wishes ADD COLUMN customer_contact TEXT;"); } catch (e) {}

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
  db.prepare("INSERT OR REPLACE INTO wishes (id, slug, status, data) VALUES ('default', 'default', 'approved', ?)").run(JSON.stringify(initialSettings));
  db.prepare("INSERT OR REPLACE INTO wishes (id, slug, status, data) VALUES ('hasif', 'hasif', 'approved', ?)").run(JSON.stringify(initialSettings));

  // Ensure JSON file is also in sync with initialSettings
  fs.writeFileSync(fallbackJsonPath, JSON.stringify(initialSettings), 'utf8');
  console.log('✅ SQLite & JSON storage synchronized & initialized');
} catch (err) {
  console.error('⚠️ SQLite Init Error, falling back to JSON storage:', err.message);
}

// ===== UNIFIED CLOUD & LOCAL DATA ADAPTER =====
async function getWishByIdOrSlug(query = 'default') {
  const clean = (query || 'default').trim();
  const cleanLower = clean.toLowerCase();

  // 1. Try Supabase Cloud Database if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      // Look up by id first
      let { data, error } = await supabase
        .from('birthday_wishes')
        .select('*')
        .eq('id', clean)
        .maybeSingle();

      if (!data) {
        // Look up case-insensitively or by slug inside data JSONB
        const allRes = await supabase
          .from('birthday_wishes')
          .select('*');
        if (allRes.data) {
          data = allRes.data.find(item => {
            const p = item.data && typeof item.data === 'object' ? item.data : {};
            return (item.id && item.id.toLowerCase() === cleanLower) ||
                   (p.slug && p.slug.toLowerCase() === cleanLower) ||
                   (p.id && p.id.toLowerCase() === cleanLower);
          });
        }
      }

      if (data) {
        const payload = data.data && typeof data.data === 'object' ? data.data : data;
        return { 
          ...DEFAULT_SETTINGS, 
          ...payload, 
          id: data.id, 
          slug: payload.slug || data.id, 
          status: payload.status || 'approved',
          customerName: payload.customerName || data.customer_name || '',
          customerContact: payload.customerContact || data.customer_contact || ''
        };
      }
    } catch (err) {
      console.warn('Supabase fetch error, falling back to local:', err.message);
    }
  }

  // 2. Local SQLite lookup (by slug OR by id case-insensitively)
  if (db) {
    try {
      let row = db.prepare('SELECT id, slug, status, customer_name, customer_contact, data FROM wishes WHERE LOWER(slug) = LOWER(?) OR LOWER(id) = LOWER(?)').get(clean, clean);
      if (row && row.data) {
        const parsed = JSON.parse(row.data);
        return { 
          ...DEFAULT_SETTINGS, 
          ...parsed, 
          id: row.id, 
          slug: row.slug || row.id, 
          status: row.status || 'approved',
          customerName: row.customer_name || '',
          customerContact: row.customer_contact || ''
        };
      }
      // If default, check legacy table
      if (cleanLower === 'default') {
        const legacyRow = db.prepare('SELECT data FROM settings WHERE id = 1').get();
        if (legacyRow && legacyRow.data) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(legacyRow.data), id: 'default', slug: 'default', status: 'approved' };
        }
      }
    } catch (e) {
      console.error('Error reading wish from SQLite:', e.message);
    }
  }

  // 3. Fallback to settings.json
  if (cleanLower === 'default' || cleanLower === 'hasif') {
    const jsonSettings = readSettingsFromJson();
    if (jsonSettings) {
      return { ...DEFAULT_SETTINGS, ...jsonSettings, id: 'hasif', slug: 'hasif', status: 'approved' };
    }
  }

  return { ...DEFAULT_SETTINGS, id: clean, slug: clean, status: 'approved' };
}

async function saveWishRecord(wishData) {
  const rawId = wishData.id || wishData.slug || `BW-${Math.floor(1000 + Math.random() * 9000)}`;
  const id = rawId.trim();
  const slug = (wishData.slug || id).toLowerCase().trim().replace(/[^a-zA-Z0-9_-]/g, '-');
  const status = wishData.status || 'approved';
  const customerName = wishData.customerName || wishData.customer_name || '';
  const customerContact = wishData.customerContact || wishData.customer_contact || '';

  const merged = { ...DEFAULT_SETTINGS, ...wishData, id, slug, status, customerName, customerContact };
  const jsonStr = JSON.stringify(merged);

  // 1. Save to Supabase Cloud Database
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('birthday_wishes')
        .upsert({
          id,
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

      if (error) console.warn('Supabase save warning:', error.message);
      else console.log(`⚡ Wish "${id}" (${slug}) saved to Supabase Cloud Database [Status: ${status}]`);
    } catch (err) {
      console.warn('Supabase upsert failed:', err.message);
    }
  }

  // 2. Save to Local SQLite
  if (db) {
    try {
      db.prepare(`
        INSERT INTO wishes (id, slug, status, customer_name, customer_contact, data, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET 
          slug = excluded.slug, 
          status = excluded.status, 
          customer_name = excluded.customer_name, 
          customer_contact = excluded.customer_contact, 
          data = excluded.data, 
          updated_at = CURRENT_TIMESTAMP
      `).run(id, slug, status, customerName, customerContact, jsonStr);

      if (id === 'default' || slug === 'default') {
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
  if (id === 'default' || slug === 'default' || id === 'hasif') {
    try {
      fs.writeFileSync(fallbackJsonPath, jsonStr, 'utf8');
    } catch (e) {}
  }

  return merged;
}

async function listAllWishes(filterStatus = 'all') {
  const wishes = [];
  const seenIds = new Set();

  // 1. Fetch from Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('birthday_wishes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (filterStatus && filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (!error && data) {
        data.forEach(item => {
          seenIds.add(item.id);
          const p = item.data && typeof item.data === 'object' ? item.data : {};
          wishes.push({
            id: item.id,
            slug: item.slug || item.id,
            status: item.status || 'approved',
            name: item.name || p.name || 'Birthday Wish',
            wisherName: item.wisher_name || p.wisherName || '',
            customerName: item.customer_name || p.customerName || '',
            customerContact: item.customer_contact || p.customerContact || '',
            birthdayNote: item.birthday_note || p.birthdayNote || '',
            photo: item.photo || p.photo || '',
            photos: item.photos || p.photos || [],
            updatedAt: item.updated_at,
            createdAt: item.created_at
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
      let sql = 'SELECT id, slug, status, customer_name, customer_contact, data, updated_at FROM wishes';
      const params = [];
      if (filterStatus && filterStatus !== 'all') {
        sql += ' WHERE status = ?';
        params.push(filterStatus);
      }
      sql += ' ORDER BY updated_at DESC';

      const rows = db.prepare(sql).all(...params);
      rows.forEach(r => {
        if (!seenIds.has(r.id)) {
          seenIds.add(r.id);
          let parsed = {};
          try { parsed = JSON.parse(r.data); } catch (e) {}
          wishes.push({
            id: r.id,
            slug: r.slug || r.id,
            status: r.status || 'approved',
            name: parsed.name || 'Birthday Wish',
            wisherName: parsed.wisherName || '',
            customerName: r.customer_name || parsed.customerName || '',
            customerContact: r.customer_contact || parsed.customerContact || '',
            birthdayNote: parsed.birthdayNote || '',
            photo: parsed.photo || '',
            photos: parsed.photos || [],
            updatedAt: r.updated_at,
            createdAt: r.updated_at
          });
        }
      });
    } catch (e) {}
  }

  if (wishes.length === 0 && filterStatus === 'all') {
    wishes.push({ id: 'hasif', slug: 'hasif', status: 'approved', name: 'Hasif Hossen', wisherName: 'Md Tamim', updatedAt: new Date().toISOString() });
  }

  return wishes;
}

async function deleteWishById(idOrSlug) {
  const clean = (idOrSlug || '').toLowerCase().trim();
  if (!clean || clean === 'default' || clean === 'hasif') return false;

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('birthday_wishes').delete().or(`id.eq.${clean},slug.eq.${clean}`);
    } catch (e) {}
  }

  if (db) {
    try {
      db.prepare('DELETE FROM wishes WHERE id = ? OR slug = ?').run(clean, clean);
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
  const current = await getWishByIdOrSlug(wishId);
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

// Image Proxy Endpoint (Ensures 100% CORS-safe canvas rendering & zero tainted canvas errors)
app.get('/api/proxy-image', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('URL query parameter is required');

  try {
    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    client.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (upstream) => {
      if (upstream.statusCode >= 400) {
        return res.status(upstream.statusCode).send('Upstream image error');
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      const contentType = upstream.headers['content-type'] || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      upstream.pipe(res);
    }).on('error', (err) => {
      console.warn('Proxy image fetch error:', err.message);
      res.status(500).send('Proxy error: ' + err.message);
    });
  } catch (e) {
    res.status(400).send('Invalid URL format');
  }
});

// ===== REST API ENDPOINTS =====

// 1. PUBLIC: Customer Submit Wish Request
app.post('/api/wishes/request', async (req, res) => {
  try {
    const incoming = req.body || {};
    const trackingId = `BW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newWish = {
      ...DEFAULT_SETTINGS,
      ...incoming,
      id: trackingId,
      slug: (incoming.name ? incoming.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : trackingId),
      status: 'pending',
      customerName: incoming.customerName || incoming.wisherName || 'Customer',
      customerContact: incoming.customerContact || ''
    };

    const saved = await saveWishRecord(newWish);

    // Notify Admin live
    broadcastLiveUpdate('new_wish_request', {
      trackingId,
      name: saved.name,
      wisherName: saved.wisherName,
      customerContact: saved.customerContact
    });

    res.json({
      success: true,
      trackingId,
      status: 'pending',
      message: 'Your birthday wish request has been submitted for review! Keep your tracking ID safe.',
      data: saved
    });
  } catch (err) {
    console.error('Wish request submission error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. PUBLIC: Customer Track Wish Status
app.get('/api/wishes/track/:query', async (req, res) => {
  try {
    const rawQuery = (req.params.query || '').trim();
    const qLower = rawQuery.toLowerCase();
    const cleanDigits = rawQuery.replace(/\D/g, '');

    let wish = await getWishByIdOrSlug(rawQuery);

    // If direct slug/ID didn't match or contact didn't match, search list
    const isDirectMatch = wish && (
      wish.id?.toLowerCase() === qLower ||
      wish.slug?.toLowerCase() === qLower ||
      (wish.customerContact && wish.customerContact.toLowerCase() === qLower) ||
      (cleanDigits.length >= 6 && wish.customerContact && wish.customerContact.replace(/\D/g, '').includes(cleanDigits))
    );

    if (!isDirectMatch) {
      const allWishes = await listAllWishes('all');
      const foundInList = allWishes.find(w => {
        const idMatch = w.id && w.id.toLowerCase() === qLower;
        const slugMatch = w.slug && w.slug.toLowerCase() === qLower;
        const contactMatch = w.customerContact && (
          w.customerContact.toLowerCase() === qLower ||
          (cleanDigits.length >= 6 && w.customerContact.replace(/\D/g, '').includes(cleanDigits))
        );
        return idMatch || slugMatch || contactMatch;
      });

      if (foundInList) {
        wish = await getWishByIdOrSlug(foundInList.id);
      } else {
        wish = null;
      }
    }

    if (wish) {
      res.json({
        success: true,
        found: true,
        wish: {
          id: wish.id,
          slug: wish.slug || wish.id,
          status: wish.status || 'approved',
          name: wish.name,
          wisherName: wish.wisherName,
          liveUrl: wish.status === 'approved' ? `/wish/${wish.slug || wish.id}` : null,
          updatedAt: wish.updated_at
        }
      });
    } else {
      res.json({ success: true, found: false, message: 'No wish found matching this tracking ID or contact number.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. ADMIN: List all wishes (with status filtering: all, pending, approved)
app.get(['/api/wishes', '/api/wishes/all'], async (req, res) => {
  try {
    const statusFilter = req.query.status || 'all';
    const wishes = await listAllWishes(statusFilter);
    res.json({ success: true, wishes, filter: statusFilter });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. ADMIN: Approve Wish and Assign Live Slug
app.post('/api/wishes/approve/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { slug } = req.body || {};
    const existing = await getWishByIdOrSlug(id);
    
    const assignedSlug = (slug || existing.slug || existing.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || id).toLowerCase().trim();

    existing.status = 'approved';
    existing.slug = assignedSlug;

    const saved = await saveWishRecord(existing);
    broadcastLiveUpdate('wish_approved', { id, slug: assignedSlug });

    res.json({
      success: true,
      message: `Wish approved and live at /wish/${assignedSlug}`,
      data: saved,
      liveUrl: `/wish/${assignedSlug}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. ADMIN: Reject Wish
app.post('/api/wishes/reject/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getWishByIdOrSlug(id);
    existing.status = 'rejected';
    const saved = await saveWishRecord(existing);

    res.json({ success: true, message: 'Wish marked as rejected', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. ADMIN / SYSTEM: Create Direct Approved Wish
app.post('/api/wishes/create', async (req, res) => {
  try {
    const incoming = req.body || {};
    const slug = (incoming.slug || incoming.id || incoming.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `wish-${Date.now().toString().slice(-4)}`).toLowerCase().trim();
    const newWish = {
      ...DEFAULT_SETTINGS,
      ...incoming,
      id: slug,
      slug: slug,
      status: 'approved'
    };

    const saved = await saveWishRecord(newWish);
    broadcastLiveUpdate('settings_updated', saved);

    res.json({ success: true, message: 'New wish created and live', data: saved, liveUrl: `/wish/${slug}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Get Specific Wish (by slug or ID)
app.get('/api/wishes/:id', async (req, res) => {
  try {
    const wish = await getWishByIdOrSlug(req.params.id);
    res.json({ success: true, data: wish });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Update Wish
app.post('/api/wishes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const incoming = req.body || {};
    const existing = await getWishByIdOrSlug(id);
    const updated = { ...existing, ...incoming, id: existing.id || id };
    const saved = await saveWishRecord(updated);
    broadcastLiveUpdate('settings_updated', saved);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Delete Wish
app.delete('/api/wishes/:id', async (req, res) => {
  try {
    const success = await deleteWishById(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Legacy settings get/post compatibility
app.get('/api/settings', async (req, res) => {
  const wishId = req.query.id || 'default';
  const settings = await getWishByIdOrSlug(wishId);
  res.json({ success: true, data: settings, wishId });
});

app.post('/api/settings', async (req, res) => {
  try {
    const incoming = req.body;
    const wishId = incoming.id || req.query.id || 'default';
    const saved = await saveWishRecord({ ...incoming, id: wishId });
    broadcastLiveUpdate('settings_updated', saved);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Supabase Status & SQL Schema Helper
app.get('/api/supabase-status', (req, res) => {
  res.json({
    configured: isSupabaseConfigured(),
    url: process.env.SUPABASE_URL || null,
    schemaSql: SUPABASE_SCHEMA_SQL
  });
});

// 12. Reset Settings
app.post('/api/reset', async (req, res) => {
  try {
    const wishId = req.query.id || 'default';
    const saved = await saveWishRecord({ ...DEFAULT_SETTINGS, id: wishId, slug: wishId, status: 'approved' });
    broadcastLiveUpdate('settings_updated', saved);
    res.json({ success: true, message: 'Settings reset to defaults', data: saved });
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
