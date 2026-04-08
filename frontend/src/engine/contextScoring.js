export const calculateContextScore = (place, context) => {
  let score = 0;
  let chipLabel = null;

  switch (context) {
    case 'solo':
      if (['Cafe', 'Libraries', 'Study Spots', 'Parks'].includes(place.category)) score += 30;
      if (place.vibes?.includes('quiet') || place.vibes?.includes('productive')) score += 20;
      chipLabel = 'Better for solo';
      break;
    
    case 'friends':
      if (['Hangout Places', 'Fast Food', 'Shopping Spots', 'Restaurants'].includes(place.category)) score += 30;
      if (place.vibes?.includes('social') || place.vibes?.includes('vibrant')) score += 20;
      chipLabel = 'Good for groups';
      break;

    case 'date':
      if (['Scenic Places', 'Bakeries', 'Cafe', 'Restaurants'].includes(place.category)) score += 30;
      if (place.vibes?.includes('scenic') || place.vibes?.includes('unique') || place.tags?.includes('aesthetic')) score += 20;
      chipLabel = 'Nice date vibe';
      break;

    case 'study':
      if (['Libraries', 'Study Spots', 'Cafe'].includes(place.category)) score += 40;
      if (place.vibes?.includes('productive') || place.vibes?.includes('quiet')) score += 20;
      chipLabel = 'Quiet enough to focus';
      break;

    case 'family':
      if (['Parks', 'Shopping Spots', 'Hangout Places'].includes(place.category)) score += 30;
      if (place.tags?.includes('family') || score > 0) score += 10;
      chipLabel = 'Family friendly';
      break;
  }

  return { score, chipLabel };
};

