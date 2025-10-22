/**
 * MapSnapshotScreen
 * Intermediate screen for capturing map snapshot before 3D view
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapSnapshotCapture from '../components/MapSnapshotCapture';
import { getPolygonBounds } from '../utils/polygonUtils';

const MapSnapshotScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { polygon } = route.params || {};
  const [error, setError] = useState(null);

  const bounds = React.useMemo(() => {
    if (polygon && polygon.length > 0) {
      return getPolygonBounds(polygon);
    }
    return null;
  }, [polygon]);

  const handleSnapshotReady = (snapshotUri, actualBounds) => {
    // Navigate to 3D view with snapshot and actual bounds used for the snapshot
    navigation.replace('ThreeDView', {
      polygon,
      mapSnapshotUri: snapshotUri,
      snapshotBounds: actualBounds || bounds, // Use actual bounds if provided
    });
  };

  const handleSnapshotError = (err) => {
    setError(err.message || 'Failed to capture map');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!polygon || !bounds) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No polygon data</Text>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <MapSnapshotCapture
      polygon={polygon}
      bounds={bounds}
      onSnapshotReady={handleSnapshotReady}
      onSnapshotError={handleSnapshotError}
    />
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapSnapshotScreen;
