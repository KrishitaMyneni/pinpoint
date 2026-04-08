const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const placeRoutes = require('./routes/placeRoutes');
app.use('/api/places', placeRoutes);

app.get('/', (req, res) => {
  res.send('Place Discovery API is running...');
});

// Database Connection + Auto-seed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placeDiscovery';
const Place = require('./models/Place');
const { SEED_DATA } = require('./data/seedData');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB');

    // AUTO-SEED: If database is empty, populate it automatically
    const count = await Place.countDocuments();
    if (count === 0) {
      console.log('📦 Database empty — auto-seeding Hyderabad dataset...');
      try {
        const created = await Place.insertMany(SEED_DATA);
        console.log(`✅ Auto-seeded ${created.length} places across all categories.`);
      } catch (seedErr) {
        console.error('❌ Auto-seed failed:', seedErr.message);
      }
    } else {
      console.log(`📊 Database has ${count} places. Skipping auto-seed.`);
    }

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB', err);
  });
