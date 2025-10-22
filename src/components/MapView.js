/**
 * MapView Component
 * Displays an interactive map centered on the UK with polygon drawing capabilities
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { UK_CENTER } from '../constants/mapConfig';
import PolygonDrawing from './PolygonDrawing';
import DrawingControls from './DrawingControls';
import { usePolygonDrawing } from '../hooks/usePolygonDrawing';

const INITIAL_REGION = {
  latitude: 54.5,
  longitude: -2.0,
  latitudeDelta: 25.0,
  longitudeDelta: 25.0,
};

const UKMapView = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [mapKey, setMapKey] = useState(0);
  const isFirstRender = React.useRef(true);
  
  // Reset map when screen comes into focus (when navigating back)
  useEffect(() => {
    // Skip the first render to avoid double mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (isFocused) {
      setMapKey(prev => prev + 1);
      console.log('Resetting map, new key:', mapKey + 1);
    }
  }, [isFocused]);
  
  useEffect(() => {
    console.log('MapView rendering with key:', mapKey);
    console.log('Initial region:', INITIAL_REGION);
  }, [mapKey]);
  
  const mapRef = React.useRef(null);
  const hasSetInitialRegion = React.useRef(false);
  
  const {
    isDrawing,
    currentPolygon,
    savedPolygons,
    startDrawing,
    addPoint,
    finishPolygon,
    cancelDrawing,
  } = usePolygonDrawing();
  
  const handleMapReady = () => {
    console.log('Map ready, setting region');
    // Force the region when map is ready
    if (mapRef.current && !hasSetInitialRegion.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(INITIAL_REGION, 100);
        hasSetInitialRegion.current = true;
      }, 100);
    }
  };
  
  const handleRegionChange = (region) => {
    console.log('Map region changed to:', region);
  };

  /**
   * Handles map press events to add polygon points
   */
  const handleMapPress = (event) => {
    if (isDrawing) {
      addPoint(event.nativeEvent.coordinate);
    }
  };

  /**
   * Handles finishing polygon and navigating to snapshot capture
   */
  const handleFinishPolygon = () => {
    if (currentPolygon.length >= 3) {
      // Navigate to map snapshot screen first
      navigation.navigate('MapSnapshot', {
        polygon: currentPolygon,
      });
      
      // Finish the polygon (saves it)
      finishPolygon();
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        key={`map-${mapKey}`}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
        onPress={handleMapPress}
        onMapReady={handleMapReady}
        onRegionChangeComplete={handleRegionChange}
        minZoomLevel={3}
        maxZoomLevel={18}
      >
        <PolygonDrawing
          currentPolygon={currentPolygon}
          savedPolygons={savedPolygons}
          isDrawing={isDrawing}
        />
      </MapView>

      <DrawingControls
        isDrawing={isDrawing}
        pointCount={currentPolygon.length}
        onStartDrawing={startDrawing}
        onFinishPolygon={handleFinishPolygon}
        onCancelDrawing={cancelDrawing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default UKMapView;

