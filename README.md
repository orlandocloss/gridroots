# GridRoots

A React Native mobile application that enables users to draw polygons on a map and view them as 3D clipped textures using Three.js.

![React Native](https://img.shields.io/badge/React_Native-0.81.4-blue)
![Expo](https://img.shields.io/badge/Expo-~54.0.0-000020)
![Three.js](https://img.shields.io/badge/Three.js-0.166.0-black)

### Project Structure

```
src/
├── components/
│   ├── MapView.js              # Main map with drawing capabilities
│   ├── PolygonDrawing.js       # Polygon rendering on map
│   ├── DrawingControls.js      # UI controls for drawing
│   ├── MapSnapshotCapture.js   # Snapshot capture screen
│   └── ThreeDScene.js          # 3D rendering with Three.js
├── screens/
│   ├── HomeScreen.js           # Home screen with map
│   ├── MapSnapshotScreen.js    # Snapshot capture flow
│   └── ThreeDViewScreen.js     # 3D visualization screen
├── utils/
│   ├── polygonUtils.js         # Polygon calculations & normalization
│   ├── geometryUtils.js        # 3D geometry creation & triangulation
│   └── mapSnapshotUtils.js     # Map snapshot utilities
├── hooks/
│   └── usePolygonDrawing.js    # Polygon state management
├── constants/
│   └── mapConfig.js            # Map configuration
└── navigation/
    └── AppNavigator.js         # Navigation structure
```

