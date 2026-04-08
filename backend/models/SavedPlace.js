const mongoose = require('mongoose');

const savedPlaceSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_user_1' },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedPlace', savedPlaceSchema);
