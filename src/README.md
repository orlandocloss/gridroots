# GridRoots - Project Structure

## 📁 Directory Structure

```
src/
├── constants/
│   └── mapConfig.js             # Map configuration and styling
├── hooks/
│   └── usePolygonDrawing.js     # Polygon state management
├── utils/
│   ├── polygonUtils.js          # Polygon calculations & normalization
│   ├── geometryUtils.js         # 3D geometry creation & triangulation
│   └── mapSnapshotUtils.js      # Map snapshot capture
├── navigation/
│   └── AppNavigator.js          # Navigation configuration
├── components/
│   ├── MapView.js               # Main map with drawing
│   ├── PolygonDrawing.js        # Polygon rendering
│   ├── DrawingControls.js       # UI controls
│   ├── MapSnapshotCapture.js    # Snapshot capture
│   └── ThreeDScene.js           # 3D rendering
└── screens/
    ├── HomeScreen.js            # Map drawing screen
    ├── MapSnapshotScreen.js     # Snapshot screen
    └── ThreeDViewScreen.js      # 3D view screen
```

## 🎯 Features

### Flow
1. Draw polygon on UK map
2. Auto-capture map snapshot with boundary (3 seconds)
3. View as rotating 3D clipped polygon with map texture

### Controls
- **Start Drawing** → Add points by tapping map
- **Finish** (min 3 points) → Navigate to 3D view
- **Cancel** → Discard polygon

### 3D View
- **Clipped polygon geometry** - only the drawn area is visible
- Map texture properly mapped to polygon shape
- Aspect ratio preserved to prevent distortion
- Smooth rotation animation
- Back button to return to map

## 🏗️ Architecture

- **Modular**: Each file has single responsibility
- **Clean**: Minimal code, no complexity
- **Documented**: JSDoc comments throughout
- **Maintainable**: Easy to understand and extend

## 🔧 Technical Details

### Polygon Clipping Implementation

The 3D view now renders only the polygon area (not the full rectangular snapshot) using the following approach:

#### 1. Coordinate Normalization (`polygonUtils.js`)
- Converts geographic lat/lng coordinates to normalized [0,1] range
- Normalizes relative to the bounding box of the polygon
- These normalized coordinates serve dual purpose:
  - 3D vertex positions (scaled and centered)
  - UV texture coordinates (direct mapping)

#### 2. Geometry Creation (`geometryUtils.js`)
- **Triangulation**: Uses ear clipping algorithm to convert polygon to triangles
  - Handles concave polygons
  - Creates proper face indices for Three.js
- **Vertex Positions**: Transforms normalized coords to 3D space
  - Centers polygon around origin
  - Applies aspect ratio to prevent distortion
- **UV Mapping**: Applies texture coordinates
  - Uses normalized coordinates directly (already in [0,1] range)
  - Flips Y-axis for texture coordinate system compatibility

#### 3. Rendering (`ThreeDScene.js`)
- Creates custom `BufferGeometry` using triangulated polygon
- Applies map snapshot texture with proper UV mapping
- Result: Only the polygon area is visible, perfectly textured

### Key Benefits
- **Clean separation**: Geometry logic isolated in `geometryUtils.js`
- **Robust**: Handles various polygon shapes (convex, concave)
- **Efficient**: Direct UV mapping without additional transformations
- **Maintainable**: Well-documented, single-responsibility functions

