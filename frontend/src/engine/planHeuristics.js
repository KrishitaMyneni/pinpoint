export const PLAN_SEQUENCES = [
  { 
    name: 'Relaxed Afternoon',
    flow: ['Cafe', 'Parks', 'Bakeries'],
    startTime: 15 // 3 PM
  },
  { 
    name: 'Evening Explorer',
    flow: ['Restaurants', 'Scenic Places', 'Dessert Places'],
    startTime: 17 // 5 PM
  },
  { 
    name: 'Deep Work Flow',
    flow: ['Study Spots', 'Cafe'],
    startTime: 10 // 10 AM
  },
  {
    name: 'Hidden City Trail',
    flow: ['Hidden Gems', 'Parks', 'Cafe'],
    startTime: 16 // 4 PM
  },
  {
    name: 'Fun with Friends',
    flow: ['Hangout Places', 'Fast Food', 'Shopping Spots'],
    startTime: 18 // 6 PM
  },
  {
    name: 'Early Bird',
    flow: ['Bakeries', 'Parks'],
    startTime: 7
  },
  {
    name: 'Date Night',
    flow: ['Scenic Places', 'Restaurants', 'Dessert Places'],
    startTime: 19
  },
  {
    name: 'Quick Snack Break',
    flow: ['Fast Food', 'Cafe'],
    startTime: 16
  }
];

export const getEstimateTimeLabel = (index, startHour) => {
  const currentHour = (startHour + index) % 24;
  const ampm = currentHour >= 12 ? 'PM' : 'AM';
  const displayHour = currentHour % 12 || 12;
  return `${displayHour}:30 ${ampm}`;
};

