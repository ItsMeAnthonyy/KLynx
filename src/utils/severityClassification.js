/**
 * Classification Rules:
 * - Low: 0-5 barangay cases, no street with >3 cases
 * - Medium: 6-15 barangay cases, 1-2 streets with 4-7 cases
 * - High: 16+ barangay cases OR any street with 8+ cases
 */

export function calculateSeverity(barangayCases, streetCaseMap) {
  const streetCounts = Object.values(streetCaseMap || {});
  
  // HIGH: Barangay total >= 16 cases
  if (barangayCases >= 16) {
    return {
      level: 'high',
      color: '#dc2626',
      glowColor: 'rgba(220, 38, 38, 0.6)',
      label: 'High',
      priority: 3,
      description: 'Critical: Barangay has 16+ total cases',
      style: { lineWidth: 6, opacity: 0.9, pulse: true, glow: true }
    };
  }
  
  // HIGH: Any street with >= 8 cases
  const highCaseStreets = streetCounts.filter(count => count >= 8);
  if (highCaseStreets.length > 0) {
    return {
      level: 'high',
      color: '#dc2626',
      glowColor: 'rgba(220, 38, 38, 0.6)',
      label: 'High',
      priority: 3,
      description: `Critical: ${highCaseStreets.length} street(s) with 8+ cases`,
      style: { lineWidth: 6, opacity: 0.9, pulse: true, glow: true }
    };
  }
  
  // MEDIUM: 6-15 total AND 1-2 streets with 4-7 cases
  if (barangayCases >= 6 && barangayCases <= 15) {
    const mediumCaseStreets = streetCounts.filter(count => count >= 4 && count <= 7);
    if (mediumCaseStreets.length >= 1 && mediumCaseStreets.length <= 2) {
      return {
        level: 'medium',
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        label: 'Medium',
        priority: 2,
        description: `Warning: ${mediumCaseStreets.length} street(s) with 4-7 cases`,
        style: { lineWidth: 4, opacity: 0.85, pulse: false, glow: false }
      };
    }
  }
  
  // LOW: Default
  return {
    level: 'low',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    label: 'Low',
    priority: 1,
    description: 'Monitored: Low case density',
    style: { lineWidth: 3, opacity: 0.75, pulse: false, glow: false }
  };
}

export function calculateStreetSeverity(streetCases) {
  if (streetCases >= 8) {
    return {
      level: 'high',
      color: '#dc2626',
      label: 'High',
      style: { lineWidth: 6, opacity: 0.9, pulse: true, glow: true }
    };
  }
  
  if (streetCases >= 4 && streetCases <= 7) {
    return {
      level: 'medium',
      color: '#f59e0b',
      label: 'Medium',
      style: { lineWidth: 4, opacity: 0.85, pulse: false, glow: false }
    };
  }
  
  return {
    level: 'low',
    color: '#10b981',
    label: 'Low',
    style: { lineWidth: 3, opacity: 0.75, pulse: false, glow: false }
  };
}

export function aggregateCaseData(diseaseData) {
  const barangays = {};
  
  diseaseData.forEach(entry => {
    const barangay = entry.Barangay || entry.Municipality || 'Karangalan Village';
    const street = entry.Street || 'Unknown';
    
    if (!barangays[barangay]) {
      barangays[barangay] = {
        totalCases: 0,
        streets: {},
        diseases: {},
        coordinates: []
      };
    }
    
    barangays[barangay].totalCases++;
    barangays[barangay].streets[street] = (barangays[barangay].streets[street] || 0) + 1;
    barangays[barangay].diseases[entry.DiagnosisName] = 
      (barangays[barangay].diseases[entry.DiagnosisName] || 0) + 1;
    
    if (entry.longitude && entry.latitude) {
      barangays[barangay].coordinates.push({
        lng: Number(entry.longitude),
        lat: Number(entry.latitude),
        street: street,
        disease: entry.DiagnosisName
      });
    }
  });
  
  Object.keys(barangays).forEach(barangayName => {
    const barangay = barangays[barangayName];
    barangay.severity = calculateSeverity(barangay.totalCases, barangay.streets);
    
    if (barangay.coordinates.length > 0) {
      const avgLng = barangay.coordinates.reduce((sum, c) => sum + c.lng, 0) / barangay.coordinates.length;
      const avgLat = barangay.coordinates.reduce((sum, c) => sum + c.lat, 0) / barangay.coordinates.length;
      barangay.center = [avgLng, avgLat];
    }
  });
  
  return { barangays };
}

export function getSeverityColor(level) {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#dc2626',
    none: '#9ca3af'
  };
  return colors[level] || colors.none;
}
