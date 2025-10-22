/**
 * HomeScreen
 * Main screen displaying the UK map with polygon drawing
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import UKMapView from '../components/MapView';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <UKMapView navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;

