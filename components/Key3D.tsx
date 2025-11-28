import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { KeyConfig } from '../types';

interface Key3DProps {
  config: KeyConfig;
  isPressed: boolean;
  isActive: boolean; // For visualizer persistence or mapper selection
  colorMode: 'rgb' | 'static';
  baseColor: string;
  onClick: (code: string) => void;
}

const Key3D: React.FC<Key3DProps> = ({ config, isPressed, isActive, colorMode, baseColor, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Calculate position based on row/col and width
  // Assuming standard key unit 1u = 1.9cm roughly, let's say 1 unit in 3D space
  const UNIT = 1.05; // 1.0 + gap
  const xPos = (config.col + config.width / 2) * UNIT; // Simplified relative layout
  
  // Adjust X for staggered layouts manually or assume the constants have correct accumulating offsets.
  // To keep it simple for this demo, we will calculate offsets dynamically in the parent or use a simple multiplier here.
  // Actually, standard keyboards have staggered rows. We will approximate row offsets.
  const rowOffsets = [0, 0.5, 0.75, 1.25, 0];
  const x = (config.col + (config.width - 1)/2) * UNIT + (rowOffsets[config.row] * UNIT);
  const z = config.row * UNIT;

  const targetY = isPressed ? -0.15 : 0;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth animation for key press
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.4);
    }
    
    if (lightRef.current) {
        // RGB Cycle effect if active
        if (isActive && colorMode === 'rgb') {
             const time = state.clock.getElapsedTime();
             const hue = (time * 0.5 + x * 0.1) % 1;
             lightRef.current.color.setHSL(hue, 1, 0.5);
             lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 2, 0.1);
        } else if (isActive) {
            lightRef.current.color.set(baseColor);
            lightRef.current.intensity = 2;
        } else {
            lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.1);
        }
    }
  });

  const width = config.width * 1 - 0.05; // Gap
  const depth = 1 - 0.05;

  return (
    <group position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onClick(config.code); }}>
      {/* The Keycap */}
      <RoundedBox
        ref={meshRef}
        args={[width, 0.5, depth]} // Width, Height, Depth
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={isActive ? (colorMode === 'rgb' ? '#ffffff' : baseColor) : '#ffffff'}
          transmission={0.95} // Glass
          opacity={1}
          metalness={0.1}
          roughness={0.15}
          ior={1.5}
          thickness={0.5}
          transparent
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Legend / Label */}
      <Text
        position={[0, targetY + 0.26, 0]} // Slightly above the key
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {config.label}
      </Text>

      {/* Underglow Light */}
      <pointLight
        ref={lightRef}
        position={[0, -0.2, 0]}
        distance={2}
        decay={2}
        intensity={0}
      />
      
      {/* Switch stem simulation (visible through glass) */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
};

export default Key3D;
