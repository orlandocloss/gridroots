/**
 * Geometry Utilities
 * Helper functions for creating Three.js geometries
 */

import * as THREE from 'three';

/**
 * Triangulates a polygon using ear clipping algorithm
 * @param {Array} vertices - Array of {x, y} normalized coordinates
 * @returns {Array} - Array of triangle indices [i0, i1, i2, ...]
 */
const triangulatePolygon = (vertices) => {
  const indices = [];
  
  // Create a list of remaining vertex indices
  const remaining = vertices.map((_, i) => i);
  
  // Ear clipping algorithm
  while (remaining.length > 3) {
    let earFound = false;
    
    for (let i = 0; i < remaining.length; i++) {
      const prevIdx = remaining[(i - 1 + remaining.length) % remaining.length];
      const currIdx = remaining[i];
      const nextIdx = remaining[(i + 1) % remaining.length];
      
      const prev = vertices[prevIdx];
      const curr = vertices[currIdx];
      const next = vertices[nextIdx];
      
      // Check if this forms a valid ear (convex and contains no other points)
      if (isEar(prev, curr, next, vertices, remaining)) {
        // Add triangle
        indices.push(prevIdx, currIdx, nextIdx);
        
        // Remove the ear vertex
        remaining.splice(i, 1);
        earFound = true;
        break;
      }
    }
    
    // Prevent infinite loop for degenerate polygons
    if (!earFound) {
      console.warn('Could not triangulate polygon completely');
      break;
    }
  }
  
  // Add the final triangle
  if (remaining.length === 3) {
    indices.push(remaining[0], remaining[1], remaining[2]);
  }
  
  return indices;
};

/**
 * Checks if three consecutive vertices form a valid ear
 * @param {Object} prev - Previous vertex {x, y}
 * @param {Object} curr - Current vertex {x, y}
 * @param {Object} next - Next vertex {x, y}
 * @param {Array} allVertices - All polygon vertices
 * @param {Array} remaining - Remaining vertex indices
 * @returns {boolean}
 */
const isEar = (prev, curr, next, allVertices, remaining) => {
  // Check if the angle is convex (cross product test)
  const cross = (next.x - curr.x) * (prev.y - curr.y) - 
                (next.y - curr.y) * (prev.x - curr.x);
  
  if (cross <= 0) {
    return false; // Concave or collinear
  }
  
  // Check if any other vertex is inside this triangle
  for (let idx of remaining) {
    const vertex = allVertices[idx];
    
    // Skip the three vertices of the potential ear
    if (vertex === prev || vertex === curr || vertex === next) {
      continue;
    }
    
    if (isPointInTriangle(vertex, prev, curr, next)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Checks if a point is inside a triangle using barycentric coordinates
 * @param {Object} point - Point to test {x, y}
 * @param {Object} v1 - Triangle vertex 1
 * @param {Object} v2 - Triangle vertex 2
 * @param {Object} v3 - Triangle vertex 3
 * @returns {boolean}
 */
const isPointInTriangle = (point, v1, v2, v3) => {
  const sign = (p1, p2, p3) => {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  };
  
  const d1 = sign(point, v1, v2);
  const d2 = sign(point, v2, v3);
  const d3 = sign(point, v3, v1);
  
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  
  return !(hasNeg && hasPos);
};

/**
 * Creates a polygon-shaped geometry with proper UV mapping
 * @param {Array} normalizedCoords - Array of {x, y} normalized coordinates (0-1 range)
 * @param {number} aspectRatio - Height/width ratio to maintain proper proportions
 * @param {number} scale - Base scale for the geometry
 * @returns {THREE.BufferGeometry}
 */
export const createPolygonGeometry = (normalizedCoords, aspectRatio, scale) => {
  if (!normalizedCoords || normalizedCoords.length < 3) {
    throw new Error('Invalid polygon: need at least 3 vertices');
  }
  
  const geometry = new THREE.BufferGeometry();
  
  // Convert normalized coordinates to 3D positions
  // Center the polygon around origin and apply aspect ratio
  const positions = [];
  const uvs = [];
  
  normalizedCoords.forEach((coord) => {
    // Convert from [0,1] range to centered coordinates
    // X: -scale/2 to +scale/2
    // Y: -scale*aspectRatio/2 to +scale*aspectRatio/2
    const x = (coord.x - 0.5) * scale;
    const y = (coord.y - 0.5) * scale * aspectRatio;
    const z = 0; // Flat in the XY plane
    
    positions.push(x, y, z);
    
    // UV coordinates map texture to geometry
    // coord.x maps longitude (0=west to 1=east) → u (0=left to 1=right)
    // coord.y maps latitude (0=south to 1=north) → v (0=bottom to 1=top)
    // Three.js UV (0,0) is bottom-left, (1,1) is top-right
    // This matches our normalized coordinate system directly
    uvs.push(coord.x, coord.y);
  });
  
  // Triangulate the polygon
  const indices = triangulatePolygon(normalizedCoords);
  
  // Set geometry attributes
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  
  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute(uvs, 2)
  );
  
  geometry.setIndex(indices);
  
  // Compute normals for proper lighting
  geometry.computeVertexNormals();
  
  return geometry;
};

/**
 * Calculates the centroid of a polygon
 * @param {Array} normalizedCoords - Array of {x, y} normalized coordinates
 * @returns {Object} - Centroid {x, y}
 */
export const getPolygonCentroid = (normalizedCoords) => {
  const sum = normalizedCoords.reduce(
    (acc, coord) => ({
      x: acc.x + coord.x,
      y: acc.y + coord.y,
    }),
    { x: 0, y: 0 }
  );
  
  return {
    x: sum.x / normalizedCoords.length,
    y: sum.y / normalizedCoords.length,
  };
};

