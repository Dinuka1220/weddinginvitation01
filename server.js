import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wedding_db';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const rsvpSchema = new mongoose.Schema({
  id: { type: Number, default: Date.now },
  side: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, default: '' },
  attendance: { type: String, required: true },
  guests: { type: String, default: '1' },
  timestamp: { type: Date, default: Date.now }
});

const RSVP = mongoose.model('RSVP', rsvpSchema);

// Backup JSON file path
const BACKUP_FILE = path.join(__dirname, 'rsvps_backup.json');

// Check if MongoDB is connected (readyState 1 = connected)
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Read local backup RSVPs
async function readLocalRSVPs() {
  try {
    if (existsSync(BACKUP_FILE)) {
      const data = await fs.readFile(BACKUP_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading backup file:', err);
  }
  return [];
}

// Save RSVP to local backup JSON
async function saveLocalRSVP(entry) {
  try {
    const list = await readLocalRSVPs();
    list.push(entry);
    await fs.writeFile(BACKUP_FILE, JSON.stringify(list, null, 2), 'utf8');
    console.log('RSVP saved to local backup file successfully.');
  } catch (err) {
    console.error('Failed to save to local backup file:', err);
  }
}

// Merge MongoDB list and local backup list by ID or Name+Phone, sort by timestamp descending
function mergeRSVPs(mongoList, localList) {
  const map = new Map();
  for (const item of mongoList) {
    const cleanItem = item.toObject ? item.toObject() : item;
    map.set(cleanItem.id || `${cleanItem.name}-${cleanItem.phone}`, cleanItem);
  }
  for (const item of localList) {
    const key = item.id || `${item.name}-${item.phone}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// API Routes
// 1. Get all RSVPs
app.get('/api/rsvps', async (req, res) => {
  try {
    let mongoRsvps = [];
    if (isMongoConnected()) {
      mongoRsvps = await RSVP.find().sort({ timestamp: -1 });
    }
    const localRsvps = await readLocalRSVPs();
    const allRsvps = mergeRSVPs(mongoRsvps, localRsvps);
    res.json(allRsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    try {
      const localRsvps = await readLocalRSVPs();
      res.json(localRsvps.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to retrieve RSVPs' });
    }
  }
});

// 2. Save a new RSVP
app.post('/api/rsvps', async (req, res) => {
  try {
    const { id, side, name, phone, message, attendance, guests, timestamp } = req.body;
    
    // Simple validation
    if (!side || !name || !phone || !attendance) {
      return res.status(400).json({ error: 'Missing required fields: side, name, phone, or attendance' });
    }

    const entry = {
      id: id || Date.now(),
      side,
      name,
      phone,
      message,
      attendance,
      guests: guests || '1',
      timestamp: timestamp ? new Date(timestamp) : new Date()
    };

    if (isMongoConnected()) {
      try {
        const newRSVP = new RSVP(entry);
        const saved = await newRSVP.save();
        // Also save to local backup to keep in sync
        await saveLocalRSVP(entry);
        return res.status(201).json(saved);
      } catch (mongoError) {
        console.error('Error saving to MongoDB, falling back to local storage:', mongoError);
      }
    }

    // Fallback if MongoDB is not connected or save failed
    console.warn('Saving RSVP to local JSON fallback file.');
    await saveLocalRSVP(entry);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Failed to save RSVP record' });
  }
});

// 3. Delete all RSVPs
app.delete('/api/rsvps', async (req, res) => {
  try {
    let clearedMongo = false;
    if (isMongoConnected()) {
      await RSVP.deleteMany({});
      clearedMongo = true;
    }
    if (existsSync(BACKUP_FILE)) {
      await fs.unlink(BACKUP_FILE);
    }
    res.json({ message: `All RSVPs cleared successfully${clearedMongo ? '' : ' (local only)'}` });
  } catch (error) {
    console.error('Error clearing RSVPs:', error);
    res.status(500).json({ error: 'Failed to clear RSVPs' });
  }
});

// 4. Delete single RSVP by id
app.delete('/api/rsvps/:id', async (req, res) => {
  try {
    const rsvpId = Number(req.params.id);
    let deletedCount = 0;
    if (isMongoConnected()) {
      const result = await RSVP.deleteOne({ id: rsvpId });
      deletedCount += result.deletedCount;
    }
    
    // Also delete from local file
    const localList = await readLocalRSVPs();
    const updatedList = localList.filter(item => Number(item.id) !== rsvpId);
    if (localList.length !== updatedList.length) {
      await fs.writeFile(BACKUP_FILE, JSON.stringify(updatedList, null, 2), 'utf8');
      deletedCount += 1;
    }
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'RSVP not found' });
    }
    res.json({ message: 'RSVP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ error: 'Failed to delete RSVP' });
  }
});

// Serve frontend assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
