/**
 * PolygonDrawing Component
 * Renders polygons and markers on the map
 */

import React from 'react';
import { Polygon, Marker } from 'react-native-maps';
import { POLYGON_STYLE } from '../constants/mapConfig';

const PolygonDrawing = ({ currentPolygon, savedPolygons, isDrawing }) => {
  return (
    <>
      {/* Render saved polygons */}
      {savedPolygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          coordinates={polygon.coordinates}
          strokeColor={POLYGON_STYLE.strokeColor}
          strokeWidth={POLYGON_STYLE.strokeWidth}
          fillColor={POLYGON_STYLE.fillColor}
        />
      ))}

      {/* Render current polygon being drawn */}
      {isDrawing && currentPolygon.length >= 2 && (
        <Polygon
          coordinates={currentPolygon}
          strokeColor={POLYGON_STYLE.strokeColor}
          strokeWidth={POLYGON_STYLE.strokeWidth}
          fillColor={POLYGON_STYLE.fillColor}
        />
      )}

      {/* Render markers for current polygon points */}
      {isDrawing && currentPolygon.map((coordinate, index) => (
        <Marker
          key={`point-${index}`}
          coordinate={coordinate}
          pinColor={POLYGON_STYLE.strokeColor}
        />
      ))}
    </>
  );
};

export default PolygonDrawing;

