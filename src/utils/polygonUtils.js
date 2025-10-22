/**
 * Polygon Utilities
 * Helper functions for polygon operations
 */

/**
 * Calculates the bounding box of a polygon
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @returns {Object} - {minLat, maxLat, minLng, maxLng, center}
 */
export const getPolygonBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  const lats = coordinates.map((coord) => coord.latitude);
  const lngs = coordinates.map((coord) => coord.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
    center: {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
    },
    latitudeDelta: (maxLat - minLat),
    longitudeDelta: (maxLng - minLng),
  };
};

/**
 * Converts lat/lng coordinates to normalized coordinates for 3D space
 * Normalized coordinates are in the range [0, 1] relative to the bounding box
 * These coordinates can be used directly as UV coordinates for texture mapping
 * 
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @param {Object} bounds - Bounding box from getPolygonBounds
 * @returns {Array} - Normalized coordinates {x, y} in range [0, 1]
 */
export const normalizePolygonCoordinates = (coordinates, bounds) => {
  if (!coordinates || coordinates.length === 0) {
    return [];
  }
  
  if (!bounds) {
    console.warn('No bounds provided for normalization');
    return [];
  }
  
  const lngRange = bounds.maxLng - bounds.minLng;
  const latRange = bounds.maxLat - bounds.minLat;
  
  // Prevent division by zero for degenerate cases
  if (lngRange === 0 || latRange === 0) {
    console.warn('Degenerate polygon bounds detected');
    return coordinates.map(() => ({ x: 0.5, y: 0.5 }));
  }
  
  return coordinates.map((coord) => ({
    x: (coord.longitude - bounds.minLng) / lngRange,
    y: (coord.latitude - bounds.minLat) / latRange,
  }));
};

/**
 * Validates that polygon has at least 3 points
 * @param {Array} coordinates - Array of coordinate objects
 * @returns {boolean}
 */
export const isValidPolygon = (coordinates) => {
  return coordinates && Array.isArray(coordinates) && coordinates.length >= 3;
};

