import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { artworks, stations, getStation, filterArtworks, floors } from './data';
import './styles.css';

const Gallery = lazy(() => import('./Gallery'));

function Detail({ work, onClose }) {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    const opener = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  return <dialog ref={ref} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }} className={zoom ? 'detail zoomed' : 'detail'} aria-labelledby="detail-title">
    <button className="close" onClick={onClose} aria-label="Close artwork details" autoFocus>✕</button>
    <button className="art-enlarge" onClick={() => setZoom(!zoom)} aria-label={zoom ? 'Return to artwork notes' : 'Enlarge artwork image'}><img src={work.image} alt={`Original geometric placeholder: ${work.title}`} /><span>{zoom ? 'Return to notes ↙' : 'Enlarge image ↗'}</span></button>
    {!zoom && <div className="detail-copy"><p className="eyebrow">Placeholder study / {work.number}</p><h2 id="detail-title">{work.title}</h2><p>{work.description}</p><div className="rule" /><h3>Looking closer</h3><p>{work.analysis}</p><div className="notice">Original geometric demo graphic. This is not a museum artwork. Verified artwork images, attribution, and historical context will be added after the museum visit.</div></div>}
    {zoom && <h2 id="detail-title" className="sr-only">{work.title}, enlarged</h2>}
  </dialog>;
}

function FloorPlan() {
  const [floor, setFloor] = useState(2);
  const [failed, setFailed] = useState(false);
  const selected = floors.find(item => item.id === floor);
  return <div className="floor-content">
    <div><p className="eyebrow">Three levels. Many stories.</p><h1>The shape of<br /><em>a future visit.</em></h1><p>The museum’s official floor plans will guide the reconstruction. For now, explore the references while we document a first gallery.</p><div className="floor-tabs" aria-label="Exhibition floor">{floors.map(item => <button key={item.id} aria-pressed={floor === item.id} onClick={() => { setFloor(item.id); setFailed(false); }}>0{item.id}<span>{item.name}</span></button>)}</div><p className="notice">Reference only · This floor has not been reconstructed. The sample room is an independent navigation study.</p><a href={selected.page} target="_blank" rel="noreferrer">View official {selected.name.toLowerCase()} source ↗</a></div>
    <div className="floor-sheet"><div className="sheet-label">National Museum of Fine Arts <span>0{floor}</span></div>{!failed ? <a href={selected.image} target="_blank" rel="noreferrer" aria-label={`Open full ${selected.name.toLowerCase()} plan`}><img key={floor} src={selected.image} alt={`Official ${selected.name.toLowerCase()} plan of the National Museum of Fine Arts`} onError={() => setFailed(true)} /></a> : <p className="image-error">The linked plan could not load. Use the official source link to view it.</p>}<p>Floor plan © National Museum of the Philippines · linked reference</p></div>
  </div>;
}

function App() {
  const [page, setPage] = useState('home');
  const [destination, setDestination] = useState('arrival');
  const [work, setWork] = useState(null);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('All');
  const reducedMotion = useReducedMotion();
  const main = useRef(null);
  const visible = filterArtworks(query, theme);
  function navigate(next) { setPage(next); requestAnimationFrame(() => { main.current?.focus(); window.scrollTo(0, 0); }); }
  function selectWork(item) { setWork(item); }
  return <MotionConfig reducedMotion="user"><a className="skip" href="#main">Skip to content</a><div className="site-shell">
    <header><button className="wordmark" onClick={() => navigate('home')} aria-label="Within home">within<span>↗</span></button><nav aria-label="Main navigation">{[['explore', 'Visit'], ['collection', 'Collection'], ['floors', 'Floor plans'], ['about', 'About']].map(([id, label]) => <button key={id} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}>{label}</button>)}</nav><span className="header-note">Philippine art,<br />within reach.</span></header>
    <main id="main" tabIndex={-1} ref={main}>
      {page === 'home' && <section className="home">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}><p className="eyebrow"><span className="small-line" /> A digital museum experience</p><h1>Art has a place.<br /><em>You do, too.</em></h1><p className="intro">A different way to step inside.<br />Explore Philippine art, one room<br className="desktop-break" /> and one story at a time.</p><button className="primary" onClick={() => navigate('explore')}>Step inside <span>↗</span></button><button className="text-button" onClick={() => navigate('collection')}>Or browse the collection →</button><div className="hero-foot"><span>National Museum<br />of Fine Arts, Manila</span><span>Student project<br />Navigation prototype / 01</span></div></motion.div>
        <div className="hero-visual"><div className="visual-top"><span>THE VIRTUAL VISIT</span><span>01 / STUDY ROOM</span></div><Suspense fallback={<div className="loading">Preparing the gallery…</div>}><Gallery destination="arrival" onMove={() => navigate('explore')} onSelect={selectWork} reducedMotion={reducedMotion} /></Suspense><div className="visual-caption"><span>A glimpse beyond the frame.</span><button onClick={() => navigate('explore')} aria-label="Enter the sample gallery">↗</button></div><span className="prototype-label">Illustrative room · original placeholder studies</span></div>
      </section>}
      {page === 'explore' && <section className="explorer"><div className="section-heading"><div><p className="eyebrow">The virtual visit / prototype 01</p><h1>A room to <em>look closer.</em></h1></div><button className="outline" onClick={() => navigate('floors')}>Official floor plans ↗</button></div><div className="visit-layout"><div className="scene-wrap"><Suspense fallback={<div className="loading">Preparing the gallery…</div>}><Gallery destination={destination} onMove={setDestination} onSelect={selectWork} reducedMotion={reducedMotion} /></Suspense><div className="scene-label">SAMPLE GALLERY <span>Illustrative architecture</span></div><div className="scene-instructions">Choose a floor marker or a viewing point below.</div></div><aside className="wayfinding"><p className="eyebrow">Find your perspective</p><h2>Take your time.</h2><p>Choose where to stand. Select a framed study to open its notes.</p><div className="mini-map" aria-label="Sample room navigation diagram">{stations.map(station => <button key={station.id} className={destination === station.id ? 'map-point selected' : 'map-point'} style={{ left: `${station.map[0]}%`, top: `${station.map[1]}%` }} onClick={() => setDestination(station.id)} aria-label={`Move to ${station.label}`} aria-pressed={destination === station.id}>{stations.indexOf(station) + 1}</button>)}<span className="map-wall">STUDY ROOM</span></div><p className="current-location" role="status">Selected viewpoint: {getStation(destination).label}</p><div className="destination-list">{stations.map((station, index) => <button key={station.id} onClick={() => setDestination(station.id)} aria-pressed={destination === station.id}><span>0{index + 1}</span>{station.label}<span>↗</span></button>)}</div><button className="text-button" onClick={() => navigate('collection')}>View studies without 3D →</button></aside></div><div className="visit-bottom"><span>CLICK TO MOVE · NO KEYBOARD MOVEMENT REQUIRED</span><p>A navigation study, not a reconstructed museum gallery. <button onClick={() => navigate('about')}>Read about this prototype ↗</button></p></div></section>}
      {page === 'collection' && <section className="collection"><div className="section-heading"><div><p className="eyebrow">Beyond the frame</p><h1>Space to <em>see more.</em></h1></div><p>Three original placeholder studies.<br />A preview of how artworks will be explored.</p></div><div className="collection-tools"><label>Search the studies<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title or theme…" /></label><label>Theme<select value={theme} onChange={e => setTheme(e.target.value)}>{['All', 'Light', 'Landscape', 'Form'].map(item => <option key={item}>{item}</option>)}</select></label><span role="status">{visible.length} {visible.length === 1 ? 'study' : 'studies'}</span></div><div className="art-grid">{visible.map(item => <button className="art-card" key={item.id} onClick={() => selectWork(item)}><div className="art-card-image"><img src={item.image} alt={`Geometric placeholder: ${item.title}`} /><span>Look closer ↗</span></div><div className="art-card-title"><h2>{item.title}</h2><span>{item.number}</span></div><p>{item.theme} / Original demo study</p></button>)}</div>{visible.length === 0 && <div className="empty"><h2>No studies found.</h2><p>Try another title or theme.</p><button className="outline" onClick={() => { setQuery(''); setTheme('All'); }}>Reset search and filter</button></div>}</section>}
      {page === 'floors' && <FloorPlan />}
      {page === 'about' && <section className="about"><p className="eyebrow">About the project</p><h1>A museum,<br /><em>within reach.</em></h1><div className="about-grid"><p className="large-copy">Philippine art deserves to be encountered, even from a distance.</p><div><h2>What we are exploring</h2><p>Within is a student cultural heritage interface project inspired by the National Museum of Fine Arts. It explores how deliberate movement, close looking, and clear interpretation can make a virtual visit meaningful.</p><h2>This first prototype</h2><p>One illustrative room tests click-to-move viewing points, artwork panels, search, filtering, and accessible collection browsing. Its geometry and artwork locations do not represent an actual museum gallery.</p><h2>Credits & next steps</h2><p>The three geometric studies are original demo graphics. They are not works from the museum collection. Museum photographs, factual labels, image credits, and the group’s interpretations will be added after a research visit.</p><p>Official floor-plan references are provided by the National Museum of the Philippines. This student project is not affiliated with or endorsed by the museum.</p><ul className="source-list">{floors.map(floor => <li key={floor.id}><a href={floor.page} target="_blank" rel="noreferrer">{floor.name} plan — National Museum ↗</a></li>)}</ul><p>Interface inspiration: <a href="https://reactbits.dev/" target="_blank" rel="noreferrer">React Bits</a> and <a href="https://motion.dev/" target="_blank" rel="noreferrer">Motion</a>. Built with React, React Three Fiber, Three.js, and Motion.</p></div></div></section>}
    </main><footer><span>WITHIN / A STUDENT CULTURAL HERITAGE PROJECT</span><span>Made for looking. Open to everyone.</span></footer>
    {work && <Detail work={work} onClose={() => setWork(null)} />}
  </div></MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App />);
