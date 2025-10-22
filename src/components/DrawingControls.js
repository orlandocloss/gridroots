/**
 * DrawingControls Component
 * UI controls for polygon drawing operations
 */

import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const DrawingControls = ({
  isDrawing,
  pointCount,
  onStartDrawing,
  onFinishPolygon,
  onCancelDrawing,
}) => {
  return (
    <View style={styles.container}>
      {!isDrawing ? (
        <TouchableOpacity style={styles.button} onPress={onStartDrawing}>
          <Text style={styles.buttonText}>Start Drawing</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.drawingControls}>
          <Text style={styles.pointCounter}>Points: {pointCount}</Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancelDrawing}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.finishButton,
                pointCount < 3 && styles.disabledButton,
              ]}
              onPress={onFinishPolygon}
              disabled={pointCount < 3}
            >
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawingControls: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pointCounter: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  finishButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
});

export default DrawingControls;

