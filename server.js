import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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

// API Routes
// 1. Get all RSVPs
app.get('/api/rsvps', async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ timestamp: -1 });
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve RSVPs' });
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

    const newRSVP = new RSVP({
      id: id || Date.now(),
      side,
      name,
      phone,
      message,
      attendance,
      guests: guests || '1',
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    const saved = await newRSVP.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Failed to save RSVP record' });
  }
});

// 3. Delete all RSVPs
app.delete('/api/rsvps', async (req, res) => {
  try {
    await RSVP.deleteMany({});
    res.json({ message: 'All RSVPs cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear RSVPs' });
  }
});

// 4. Delete single RSVP by id
app.delete('/api/rsvps/:id', async (req, res) => {
  try {
    const result = await RSVP.deleteOne({ id: Number(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'RSVP not found' });
    }
    res.json({ message: 'RSVP deleted successfully' });
  } catch (error) {
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
