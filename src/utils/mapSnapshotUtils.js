/**
 * Map Snapshot Utilities
 * Functions for capturing and processing map snapshots
 */

/**
 * Captures a snapshot of the map view
 * @param {Object} mapRef - Reference to MapView component
 * @param {Object} bounds - Bounding box with center and deltas
 * @returns {Promise<string>} - URI of the captured snapshot
 */
export const captureMapSnapshot = async (mapRef, bounds) => {
  if (!mapRef || !mapRef.current) {
    throw new Error('Map reference is not available');
  }

  try {
    // Capture the current map view as displayed
    const snapshot = await mapRef.current.takeSnapshot({
      format: 'png',
      quality: 0.8,
      result: 'file',
    });

    return snapshot;
  } catch (error) {
    console.error('Failed to capture map snapshot:', error.message);
    throw error;
  }
};

