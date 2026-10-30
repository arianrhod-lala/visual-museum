import React, { Component, Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, SRGBColorSpace, Vector3 } from 'three';
import { artworks, stations, getStation } from './data';

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children; }
}

function SceneFallback() {
  return <div className="scene-fallback"><span className="eyebrow">The collection is still open</span><h2>Explore at your own pace.</h2><p>The 3D view is unavailable on this device. Use the Collection tab to view all studies and their notes.</p></div>;
}

function Box({ position, scale, color, ...rest }) {
  return <mesh position={position} scale={scale} {...rest}><boxGeometry /><meshStandardMaterial color={color} roughness={0.85} /></mesh>;
}

function Artwork({ work, onSelect }) {
  const texture = useLoader(TextureLoader, work.image);
  texture.colorSpace = SRGBColorSpace;
  return <group position={work.position} rotation={work.rotation}>
    <Box position={[0, 0, -0.06]} scale={[work.width + 0.22, work.height + 0.22, 0.12]} color="#a58045" />
    <mesh onClick={e => { e.stopPropagation(); onSelect(work); }}>
      <planeGeometry args={[work.width, work.height]} /><meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
    <Box position={[work.width / 2 - 0.15, -work.height / 2 - 0.25, 0]} scale={[0.36, 0.14, 0.025]} color="#e7dfce" />
  </group>;
}

function CameraJourney({ destination, reducedMotion }) {
  const target = getStation(destination);
  const look = useRef(new Vector3(...stations[0].look));
  const journey = useRef(null);
  useEffect(() => { journey.current = null; }, [destination, reducedMotion]);
  useFrame(({ camera }, delta) => {
    if (!journey.current) journey.current = { from: camera.position.clone(), look: look.current.clone(), elapsed: 0 };
    const step = journey.current;
    step.elapsed += delta;
    const t = reducedMotion ? 1 : Math.min(step.elapsed / 1.45, 1);
    const eased = t * t * (3 - 2 * t);
    camera.position.lerpVectors(step.from, new Vector3(...target.position), eased);
    look.current.lerpVectors(step.look, new Vector3(...target.look), eased);
    camera.lookAt(look.current);
  });
  return null;
}

function Room({ destination, onMove, onSelect, reducedMotion }) {
  const tiles = useMemo(() => Array.from({ length: 13 }, (_, i) => i - 6), []);
  return <>
    <color attach="background" args={['#eee7d7']} />
    <ambientLight intensity={1.6} />
    <hemisphereLight args={['#fff5db', '#776850', 1.6]} />
    <pointLight position={[0, 5.3, -3]} intensity={60} decay={1.5} />
    <Box position={[0, -0.12, 0]} scale={[14, 0.24, 18]} color="#d9d0bc" />
    {tiles.map(x => <Box key={`x${x}`} position={[x, 0.006, 0]} scale={[0.012, 0.005, 18]} color="#bcb39f" />)}
    {Array.from({ length: 17 }, (_, i) => <Box key={i} position={[0, 0.008, i - 8]} scale={[14, 0.005, 0.012]} color="#bcb39f" />)}
    <Box position={[0, 3, -9]} scale={[14, 6, 0.3]} color="#723e3b" />
    <Box position={[-7, 3, 0]} scale={[0.3, 6, 18]} color="#824741" />
    <Box position={[7, 3, 0]} scale={[0.3, 6, 18]} color="#824741" />
    {[-6.79, 6.79].map(x => <group key={x}>
      <Box position={[x, 0.28, 0]} scale={[0.13, 0.56, 18]} color="#e2d6bc" />
      <Box position={[x, 5.2, 0]} scale={[0.2, 0.22, 18]} color="#e2d6bc" />
    </group>)}
    <Box position={[0, 0.28, -8.78]} scale={[14, 0.56, 0.13]} color="#e2d6bc" />
    <Box position={[0, 5.2, -8.78]} scale={[14, 0.22, 0.2]} color="#e2d6bc" />
    {[-6, 6].map(x => [-6.5, 3.5].map(z => <group key={`${x}${z}`} position={[x, 0, z]}>
      <Box position={[0, 0.22, 0]} scale={[0.65, 0.44, 0.65]} color="#e2d6bc" />
      <mesh position={[0, 2.65, 0]}><cylinderGeometry args={[0.21, 0.27, 4.5, 20]} /><meshStandardMaterial color="#ded3bb" /></mesh>
      <Box position={[0, 5, 0]} scale={[0.65, 0.24, 0.65]} color="#e2d6bc" />
    </group>))}
    <Box position={[0, 5.65, 0]} scale={[14, 0.2, 18]} color="#eee7d7" />
    {[-6.5, -1, 4].map(z => <Box key={z} position={[0, 5.4, z]} scale={[14, 0.25, 0.3]} color="#d2c5ab" />)}
    {artworks.map(work => <Suspense key={work.id} fallback={null}><Artwork work={work} onSelect={onSelect} /></Suspense>)}
    {stations.map(station => <mesh key={station.id} position={[station.position[0], 0.035, station.position[2]]} rotation={[-Math.PI / 2, 0, 0]} onClick={e => { e.stopPropagation(); onMove(station.id); }}>
      <ringGeometry args={[0.22, station.id === destination ? 0.34 : 0.29, 48]} />
      <meshBasicMaterial color={station.id === destination ? '#fff6db' : '#8f7044'} />
    </mesh>)}
    <CameraJourney destination={destination} reducedMotion={reducedMotion} />
  </>;
}

export default function Gallery(props) {
  return <SceneBoundary><Canvas dpr={[1, 1.5]} camera={{ position: stations[0].position, fov: 65, near: 0.1, far: 70 }} fallback={<SceneFallback />} aria-label="Illustrative 3D gallery. Use the named viewing-point buttons to navigate; artwork cards are also available in Collection.">
    <Room {...props} />
  </Canvas></SceneBoundary>;
}
