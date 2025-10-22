/**
 * MapSnapshotCapture Component
 * Handles map snapshot capture before navigation
 */

import React, { useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { POLYGON_STYLE } from '../constants/mapConfig';
import { captureMapSnapshot } from '../utils/mapSnapshotUtils';

const MapSnapshotCapture = ({ 
  polygon, 
  bounds, 
  onSnapshotReady,
  onSnapshotError 
}) => {
  const mapRef = useRef(null);
  const [isCapturing, setIsCapturing] = React.useState(true);
  const [mapReady, setMapReady] = React.useState(false);
  const actualRegionRef = useRef(null);

  // Handle region change to capture actual visible region
  const handleRegionChangeComplete = (region) => {
    actualRegionRef.current = region;
  };

  React.useEffect(() => {
    if (!mapReady) return;
    
    // Delay to ensure map tiles are fully loaded and region is set
    const captureTimeout = setTimeout(async () => {
      try {
        // Get the actual visible region (MapView may have adjusted it)
        const actualRegion = actualRegionRef.current || {
          latitude: bounds.center.latitude,
          longitude: bounds.center.longitude,
          latitudeDelta: bounds.latitudeDelta,
          longitudeDelta: bounds.longitudeDelta,
        };
        
        // Calculate actual bounds from the visible region
        const actualBounds = {
          center: {
            latitude: actualRegion.latitude,
            longitude: actualRegion.longitude,
          },
          minLat: actualRegion.latitude - actualRegion.latitudeDelta / 2,
          maxLat: actualRegion.latitude + actualRegion.latitudeDelta / 2,
          minLng: actualRegion.longitude - actualRegion.longitudeDelta / 2,
          maxLng: actualRegion.longitude + actualRegion.longitudeDelta / 2,
          latitudeDelta: actualRegion.latitudeDelta,
          longitudeDelta: actualRegion.longitudeDelta,
        };
        
        // Capture snapshot
        const snapshot = await captureMapSnapshot(mapRef, bounds);
        
        // Pass snapshot and the ACTUAL visible bounds for proper normalization
        onSnapshotReady(snapshot, actualBounds);
      } catch (error) {
        console.error('Snapshot capture failed:', error.message);
        onSnapshotError(error);
      } finally {
        setIsCapturing(false);
      }
    }, 3000);

    return () => clearTimeout(captureTimeout);
  }, [polygon, bounds, mapReady]);

  const handleMapReady = () => {
    setMapReady(true);
  };

  // Calculate aspect ratio to match geographic bounds
  // aspectRatio = width / height
  const geoAspect = bounds.longitudeDelta / bounds.latitudeDelta;
  
  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { aspectRatio: geoAspect }]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={{
            latitude: bounds.center.latitude,
            longitude: bounds.center.longitude,
            latitudeDelta: bounds.latitudeDelta,
            longitudeDelta: bounds.longitudeDelta,
          }}
          mapType="standard"
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          onMapReady={handleMapReady}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {/* Polygon removed - no visible boundary in snapshot */}
        </MapView>
      </View>

      {isCapturing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Loading map tiles...</Text>
            <Text style={styles.loadingSubtext}>Please wait 3 seconds</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: '95%',
    maxWidth: 800,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // Don't block map rendering
  },
  loadingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default MapSnapshotCapture;
