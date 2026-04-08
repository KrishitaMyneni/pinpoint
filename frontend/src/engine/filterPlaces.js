export const filterPlaces = (places, context) => {
  console.log('🚀 [PIPELINE] Stage 2', context);
  
  const filtered = places.filter(place => {
    // 1. Distance filter (if maxDistance is set and distance is available)
    if (context.maxDistance && place.distance !== undefined) {
      const distKm = place.distance / 1000;
      if (distKm > context.maxDistance) return false;
    }
    
    // 2. Budget filter (priceLevel 1-4)
    if (context.maxBudget && place.priceLevel > context.maxBudget) return false;
    
    // 3. Open Now filter
    if (context.openOnly && place.isOpenNow === false) return false;
    
    return true;
  });
  
  console.log(`📊 [PIPELINE] Filters applied. ${places.length} -> ${filtered.length}`);
  return filtered;
};

