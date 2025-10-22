# GridRoots 🗺️

A React Native mobile application that enables users to draw polygons on a map and view them as 3D clipped textures using Three.js.

![React Native](https://img.shields.io/badge/React_Native-0.81.4-blue)
![Expo](https://img.shields.io/badge/Expo-~54.0.0-000020)
![Three.js](https://img.shields.io/badge/Three.js-0.166.0-black)

## ✨ Features

- **Interactive Map Drawing**: Draw custom polygons on an interactive map centered on the UK
- **Real-time Polygon Rendering**: See your polygon take shape as you tap points on the map
- **Map Snapshot Capture**: Automatically captures high-quality map snapshots with your polygon
- **3D Visualization**: View your polygon as a rotating 3D plane with the map texture
- **Advanced Polygon Clipping**: Only the polygon area is rendered (not the full rectangle)
- **Accurate Texture Mapping**: Normalized UV coordinates ensure perfect texture alignment
- **Complex Polygon Support**: Handles both convex and concave polygons using ear clipping algorithm

## 🎥 How It Works

1. **Draw**: Tap "Start Drawing" and tap points on the map to create a polygon
2. **Capture**: App automatically captures a snapshot with the polygon boundary
3. **Visualize**: View your polygon as a 3D textured plane that rotates smoothly

## 🏗️ Architecture

### Key Technologies

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build toolchain
- **react-native-maps** - Interactive map component
- **Three.js** - 3D graphics rendering
- **expo-gl** - WebGL bindings for React Native
- **expo-three** - Three.js integration for Expo

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

## 🔧 Technical Highlights

### Polygon Clipping Implementation

The app uses a sophisticated approach to render only the polygon area in 3D:

1. **Coordinate Normalization** - Converts geographic lat/lng to [0,1] normalized space
2. **Ear Clipping Triangulation** - Breaks polygon into triangles for GPU rendering
3. **UV Mapping** - Maps texture coordinates to polygon vertices for accurate alignment
4. **Three.js BufferGeometry** - Creates custom geometry matching polygon shape

### Coordinate Systems

```
Geographic Space          Normalized Space         UV Texture Space
(lat/lng degrees)         (0 to 1)                 (0 to 1)
     ↓                         ↓                         ↓
   Bounds              Normalization              Direct Mapping
  Calculation          (relative to              (with flipY)
                       snapshot bounds)
```

### Triangulation Algorithm

Uses **ear clipping** to convert polygons to triangles:
- Handles concave polygons
- Validates ears using cross-product test
- Performs point-in-triangle checks using barycentric coordinates

## 📱 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gridroots.git
   cd gridroots
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in terminal

## 🎮 Usage

1. **Start Drawing**
   - Open the app
   - Tap "Start Drawing" button
   - Tap on the map to add points (minimum 3 points)

2. **Complete Polygon**
   - Tap "Finish" when done
   - App captures snapshot (3 seconds)

3. **View in 3D**
   - Automatically navigates to 3D view
   - Watch your polygon rotate with the map texture
   - Tap "← Back to Map" to return

## 🛠️ Development

### Key Configuration

**Map Initial View** (`src/constants/mapConfig.js`)
```javascript
export const UK_CENTER = {
  latitude: 54.5,
  longitude: -2.0,
  latitudeDelta: 25.0,
  longitudeDelta: 25.0,
};
```

**3D Scene Settings** (`src/components/ThreeDScene.js`)
- Camera position: `(0, 3, 5)`
- Rotation speed: `0.005 rad/frame`
- Background: Sky blue (`0x87ceeb`)

### Clearing Cache

If you encounter issues after updates:
```bash
npx expo start --clear
```

## 📝 Code Quality

- ✅ Modular architecture with single responsibility principle
- ✅ Comprehensive JSDoc comments
- ✅ Clean separation of concerns
- ✅ Error handling and validation
- ✅ Efficient algorithms and minimal re-renders

## 🐛 Known Issues

- Android MapView may cache initial region (workaround implemented)
- Snapshot capture requires 3-second delay for tile loading

## 🚀 Future Enhancements

- [ ] Polygon editing (add/remove/move points)
- [ ] Multiple polygon support
- [ ] 3D extrusion for terrain effect
- [ ] Save/load polygons
- [ ] Export 3D model
- [ ] Interactive camera controls in 3D view
- [ ] Different map styles (satellite, terrain)

## 📄 License

MIT License - feel free to use this project for learning and development

## 👤 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- **react-native-maps** - Excellent map component
- **Three.js** - Powerful 3D graphics library
- **Expo** - Amazing development experience

---

**Star ⭐ this repo if you find it useful!**

