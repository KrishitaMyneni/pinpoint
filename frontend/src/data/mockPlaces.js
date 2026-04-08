const mockPlaces = [
  { 
      _id: 'mock1', name: 'Elite Workspace Hub', category: 'Study Spots', rating: 4.8, description: 'Modern cubicles with ergonomic seating.',
      location: { type: 'Point', coordinates: [78.384, 17.448] }, address: 'Hitech City, HYD',
      openTime: '08:00', closeTime: '22:00', tags: ['focus', 'quiet', 'work', 'study']
  },
  { 
      _id: 'mock2', name: 'The Park at Lotus Lake', category: 'Parks', rating: 4.9, description: 'Quiet trails and natural gardens.',
      location: { type: 'Point', coordinates: [78.410, 17.410] }, address: 'Jubilee Hills, HYD',
      openTime: '05:00', closeTime: '21:00', tags: ['scenic', 'quiet', 'nature']
  },
  { 
      _id: 'mock3', name: 'Burger Junction', category: 'Fast Food', rating: 4.4, description: 'Famous for its spicy chicken burgers.',
      location: { type: 'Point', coordinates: [78.380, 17.450] }, address: 'Kondapur, HYD',
      openTime: '11:00', closeTime: '00:00', tags: ['food', 'burger', 'quick']
  },
  { 
      _id: 'mock4', name: 'Bakery Central', category: 'Bakeries', rating: 4.7, description: 'Freshly baked artisanal breads.',
      location: { type: 'Point', coordinates: [78.374, 17.458] }, address: 'Whitefields, HYD',
      openTime: '07:00', closeTime: '19:00', tags: ['pastries', 'morning', 'artisanal']
  },
  { 
      _id: 'mock5', name: 'The Designer Boutique', category: 'Shopping Spots', rating: 4.8, description: 'Exclusive local designer collections.',
      location: { type: 'Point', coordinates: [78.391, 17.434] }, address: 'Madhapur Road, HYD',
      openTime: '10:00', closeTime: '22:00', tags: ['fashion', 'mall', 'unique']
  }
];

export default mockPlaces;
