import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { KEY_LAYOUT } from '../constants';
import Key3D from './Key3D';

interface KeyboardCanvasProps {
  activeKeys: Set<string>;
  activeColor: string;
  rgbMode: boolean;
  onKeyClick: (code: string) => void;
}

const KeyboardCanvas: React.FC<KeyboardCanvasProps> = ({ activeKeys, activeColor, rgbMode, onKeyClick }) => {
  // Center the keyboard
  const centerOffset = { x: -7.5, z: -2.5 };

  return (
    <div className="w-full h-full bg-neutral-900 relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 8, 6]} fov={45} />
        
        {/* Lighting & Environment */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <Environment preset="night" />

        <group position={[centerOffset.x, 0, centerOffset.z]}>
          {KEY_LAYOUT.map((row, rIndex) => (
             <group key={`row-${rIndex}`}>
                {/* Manual row offset calculation adjustment for visual perfection */}
                <group position={[rIndex === 1 ? 0.25 : rIndex === 2 ? 0.5 : rIndex === 3 ? 0.75 : 0, 0, 0]}> 
                {/* Note: The simple row offset logic in Key3D is supplemented here if needed, 
                    but Key3D handles internal offset. Let's reset group pos and trust Key3D math or fix it there.
                    Actually, for this demo, let's rely on Key3D's x-calculation. 
                    We just render the list flatly. 
                */}
                </group>
                
                {row.map((keyConfig) => (
                  <Key3D
                    key={keyConfig.id}
                    config={keyConfig}
                    isPressed={activeKeys.has(keyConfig.code)}
                    isActive={activeKeys.has(keyConfig.code)}
                    colorMode={rgbMode ? 'rgb' : 'static'}
                    baseColor={activeColor}
                    onClick={onKeyClick}
                  />
                ))}
             </group>
          ))}
          
          {/* The Keyboard Case / Base */}
          <mesh position={[7.5, -0.35, 2]} receiveShadow>
             <boxGeometry args={[16, 0.2, 6]} />
             <meshPhysicalMaterial 
                color="#222" 
                roughness={0.2}
                metalness={0.8}
                clearcoat={1}
             />
          </mesh>
        </group>

        <ContactShadows position={[0, -0.4, 0]} opacity={0.5} scale={20} blur={2} far={4} />
        <OrbitControls 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2} 
            enablePan={true}
            minDistance={5}
            maxDistance={20}
        />
      </Canvas>
      
      {/* Overlay Instructions for 3D Nav */}
      <div className="absolute bottom-4 left-4 text-white/30 text-xs pointer-events-none select-none">
        Left Click: Rotate • Right Click: Pan • Scroll: Zoom
      </div>
    </div>
  );
};

export default KeyboardCanvas;
