const mongoose = require('mongoose');

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const placeSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
      },
    },
    address: { type: String, required: true, trim: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    imageUrl: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    vibes: { type: [String], default: [] },
    intents: { type: [String], default: [] },
    priceLevel: { type: Number, default: 2, min: 1, max: 4 },
    avgVisitMinutes: { type: Number, default: 60, min: 10, max: 300 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        ret.latitude = ret.location?.coordinates?.[1] ?? null;
        ret.longitude = ret.location?.coordinates?.[0] ?? null;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

placeSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

module.exports = mongoose.model('Place', placeSchema);
