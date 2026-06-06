import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezdfaxxdbhgabzoedtoy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_pH7zszYEIU1MpLjHQ9vHlA_lWgOscJ4';
const supabase = createClient(supabaseUrl, supabaseKey);

// API Routes
// 1. Get all RSVPs
app.get('/api/rsvps', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching RSVPs from Supabase:', error);
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

    const { data, error } = await supabase
      .from('rsvps')
      .insert([entry])
      .select();

    if (error) throw error;
    res.status(201).json(data[0] || entry);
  } catch (error) {
    console.error('Error saving RSVP to Supabase:', error);
    res.status(500).json({ error: 'Failed to save RSVP record' });
  }
});

// 3. Delete all RSVPs
app.delete('/api/rsvps', async (req, res) => {
  try {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .neq('id', 0); // Delete all by filtering where id != 0

    if (error) throw error;
    res.json({ message: 'All RSVPs cleared successfully' });
  } catch (error) {
    console.error('Error clearing RSVPs:', error);
    res.status(500).json({ error: 'Failed to clear RSVPs' });
  }
});

// 4. Delete single RSVP by id
app.delete('/api/rsvps/:id', async (req, res) => {
  try {
    const rsvpId = Number(req.params.id);
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', rsvpId);

    if (error) throw error;
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

// Start Server if not running in a serverless environment like Vercel
if (process.env.NODE_ENV !== 'production' || process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
