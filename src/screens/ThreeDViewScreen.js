/**
 * ThreeDViewScreen
 * Screen displaying the 3D view with map-textured clipped polygon
 */

import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ThreeDScene from '../components/ThreeDScene';
import { getPolygonBounds, normalizePolygonCoordinates } from '../utils/polygonUtils';

const ThreeDViewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { polygon, mapSnapshotUri, snapshotBounds } = route.params || {};

  // Calculate normalized coordinates using the actual snapshot bounds
  const normalizedCoords = useMemo(() => {
    if (!polygon || polygon.length === 0) {
      return [];
    }

    // Use snapshot bounds if available (more accurate), otherwise calculate from polygon
    const bounds = snapshotBounds || getPolygonBounds(polygon);
    const normalizedCoords = normalizePolygonCoordinates(polygon, bounds);

    return normalizedCoords;
  }, [polygon, snapshotBounds]);

  const handleBack = () => {
    // Navigate back to home, skipping the snapshot screen
    navigation.navigate('Home');
  };

  if (!polygon || polygon.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No polygon data available</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThreeDScene 
        polygon={polygon}
        normalizedCoordinates={normalizedCoords}
        mapSnapshotUri={mapSnapshotUri}
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back to Map</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.infoText}>3D Map View</Text>
          <Text style={styles.infoSubtext}>
            {mapSnapshotUri ? 'Textured' : 'No texture'} • {polygon.length} points
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  controls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default ThreeDViewScreen;

