/**
 * ThreeDScene Component
 * Renders a 3D scene with a map-textured clipped polygon
 */

import React, { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { StyleSheet } from 'react-native';
import { createPolygonGeometry } from '../utils/geometryUtils';

const ThreeDScene = ({ polygon, normalizedCoordinates, mapSnapshotUri }) => {
  const timeoutRef = useRef(null);

  const onContextCreate = async (gl) => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Load and display map texture
    let geometry, material, mesh;
    
    if (mapSnapshotUri && normalizedCoordinates && normalizedCoordinates.length >= 3) {
      try {
        // Load texture from file URI
        const texture = await loadTextureFromFile(mapSnapshotUri);
        
        // Calculate aspect ratio from texture
        const textureAspect = texture.image.height / texture.image.width;
        
        // Create polygon-shaped geometry with proper UV mapping
        geometry = createPolygonGeometry(
          normalizedCoordinates,
          textureAspect,
          10 // Base scale
        );
        
        // Create material with texture
        material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
      } catch (error) {
        console.error('Failed to load map texture:', error.message);
        // Fallback to colored polygon without texture
        geometry = createPolygonGeometry(normalizedCoordinates, 1.0, 10);
        material = new THREE.MeshPhongMaterial({
          color: 0xff6b6b,
          side: THREE.DoubleSide,
        });
      }
    } else {
      // No snapshot or invalid polygon - show placeholder
      geometry = new THREE.PlaneGeometry(10, 10);
      material = new THREE.MeshPhongMaterial({
        color: 0x44aa88,
        side: THREE.DoubleSide,
      });
    }
    
    // Helper function to load texture
    async function loadTextureFromFile(fileUri) {
      return new Promise((resolve, reject) => {
        const texture = new THREE.Texture();
        const img = new Image();
        
        const timeout = setTimeout(() => {
          reject(new Error('Texture loading timeout'));
        }, 5000);
        
        img.onload = () => {
          clearTimeout(timeout);
          texture.image = img;
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          // Flip texture to match Three.js coordinate system
          // where UV (0,0) is bottom-left and (1,1) is top-right
          texture.flipY = true;
          resolve(texture);
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load image'));
        };
        
        img.src = fileUri;
      });
    }

    // Create and add mesh to scene
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // Lay flat (horizontal)
    scene.add(mesh);

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    // Animation loop with gentle rotation
    const animate = () => {
      timeoutRef.current = requestAnimationFrame(animate);
      mesh.rotation.z += 0.005;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        cancelAnimationFrame(timeoutRef.current);
      }
    };
  }, []);

  return (
    <GLView
      style={styles.glView}
      onContextCreate={onContextCreate}
    />
  );
};

const styles = StyleSheet.create({
  glView: {
    flex: 1,
  },
});

export default ThreeDScene;

