import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

function NodeCluster({ radius = 5, speed = 0.1, color = 0x06b6d4, nodeCount = 12, size = 0.12, layerIndex = 0 }) {
  const groupRef = useRef();
  const instRef = useRef();
  const linesRef = useRef([]);
  
  // Create nodes with uneven spacing and drift parameters
  const nodes = useMemo(() => {
    const nodeArray = [];
    for (let i = 0; i < nodeCount; i++) {
      // Uneven angular spacing
      const baseAngle = (i / nodeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      nodeArray.push({
        baseAngle,
        baseRadius: radius + (Math.random() - 0.5) * (radius * 0.18),
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.1 + Math.random() * 0.22,
        driftRadius: 0.25 + Math.random() * 0.6,
        connectThreshold: 2.4 + Math.random() * 1.2,
      });
    }
    return nodeArray;
  }, [radius, nodeCount]);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const nodePositions = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Compute node positions with drift and slow orbital motion
    const positions = nodes.map((node, i) => {
      // Slow orbital motion
      const orbitalAngle = node.baseAngle + t * speed * 0.5;
      const orbitalR = node.baseRadius;
      
      // Drift motion (random walk)
      const driftX = Math.sin(t * node.driftSpeed + node.phase) * node.driftRadius;
      const driftY = Math.cos(t * node.driftSpeed * 1.3 + node.phase * 0.7) * node.driftRadius;
      const driftZ = Math.sin(t * node.driftSpeed * 0.8 + node.phase * 1.5) * (node.driftRadius * 0.5);
      
      const x = Math.cos(orbitalAngle) * orbitalR + driftX;
      const y = Math.sin(orbitalAngle) * orbitalR + driftY;
      const z = driftZ + layerIndex * 0.08;
      
      return new THREE.Vector3(x, y, z);
    });
    
    nodePositions.current = positions;

    // Update instanced mesh for nodes
    if (instRef.current) {
      positions.forEach((pos, i) => {
        tempMatrix.identity();
        tempMatrix.setPosition(pos.x, pos.y, pos.z);
        instRef.current.setMatrixAt(i, tempMatrix);
      });
      instRef.current.instanceMatrix.needsUpdate = true;
    }

    // Dynamic connections: lines appear/disappear based on distance
    if (groupRef.current) {
      // Remove old lines
      linesRef.current.forEach(line => {
        line.geometry.dispose();
        line.material.dispose();
        groupRef.current.remove(line);
      });
      linesRef.current = [];

      // Create new connections based on proximity
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dist = positions[i].distanceTo(positions[j]);
          const threshold = (nodes[i].connectThreshold + nodes[j].connectThreshold) / 2;
          
          if (dist < threshold) {
            const geometry = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
            const opacity = Math.max(0, 1 - (dist / threshold)) * 0.7;
            const material = new THREE.LineBasicMaterial({ 
              color, 
              transparent: true, 
              opacity,
            });
            const line = new THREE.Line(geometry, material);
            groupRef.current.add(line);
            linesRef.current.push(line);
          }
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={instRef} args={[null, null, nodeCount]}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </instancedMesh>
    </group>
  );
}

export default function AbstractSystemHalo({ theme = 'dark' }) {
  const primaryColor = theme === 'dark' ? 0x06b6d4 : 0x0ea5e9;
  const accentColor = theme === 'dark' ? 0x8b5cf6 : 0x6366f1;
  const glowColor = theme === 'dark' ? 0x7c3aed : 0x8b5cf6;
  const isSmall = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 640px)').matches : false;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={0.6} />
        <NodeCluster radius={isSmall ? 6.0 : 9.0} speed={0.08} color={primaryColor} nodeCount={isSmall ? 10 : 20} size={isSmall ? 0.09 : 0.14} layerIndex={0} />
        <NodeCluster radius={isSmall ? 4.5 : 6.0} speed={-0.06} color={accentColor} nodeCount={isSmall ? 8 : 16} size={isSmall ? 0.08 : 0.12} layerIndex={1} />
        <NodeCluster radius={isSmall ? 2.8 : 3.8} speed={0.09} color={glowColor} nodeCount={isSmall ? 6 : 12} size={isSmall ? 0.07 : 0.1} layerIndex={2} />
        <NodeCluster radius={isSmall ? 1.6 : 2.0} speed={-0.07} color={primaryColor} nodeCount={isSmall ? 5 : 9} size={isSmall ? 0.06 : 0.08} layerIndex={3} />
      </Canvas>
    </div>
  );
}
