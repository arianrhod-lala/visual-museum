export const floors = [
  { id: 2, name: 'Second floor', page: 'https://www.nationalmuseum.gov.ph/exhibitions/fine-arts/second-floor-fine-arts-floor-plan/', image: 'https://weblinks.nationalmuseum.gov.ph/wp-content/uploads/2021/09/01120558/NMF2-scaled.jpg' },
  { id: 3, name: 'Third floor', page: 'https://www.nationalmuseum.gov.ph/exhibitions/fine-arts/third-floor-fine-arts-floor-plan/', image: 'https://weblinks.nationalmuseum.gov.ph/wp-content/uploads/2021/08/01124537/nmf3-scaled.jpg' },
  { id: 4, name: 'Fourth floor', page: 'https://www.nationalmuseum.gov.ph/exhibitions/fine-arts/fourth-floor-fine-arts-floor-plan/', image: 'https://weblinks.nationalmuseum.gov.ph/wp-content/uploads/2021/08/01124534/nmf4-4-scaled.jpg' },
];

// All stations and interpolated paths are inside this convex, empty room.
// Replace with a measured waypoint graph before introducing walls or connected rooms.
export const stations = [
  { id: 'arrival', label: 'Arrival', position: [0, 1.65, 7], look: [0, 2.1, -8], map: [50, 84] },
  { id: 'center', label: 'Room center', position: [0, 1.65, 1], look: [0, 2.1, -8], map: [50, 51] },
  { id: 'light', label: 'Study of light', position: [-3.4, 1.65, -1], look: [-6.65, 2.3, -2], map: [25, 39] },
  { id: 'land', label: 'Study of land', position: [0, 1.65, -4.5], look: [0, 2.3, -8.65], map: [50, 21] },
  { id: 'form', label: 'Study of form', position: [3.4, 1.65, -1], look: [6.65, 2.3, -2], map: [75, 39] },
];

export const artworks = [
  { id: 'light', title: 'Study of light', theme: 'Light', image: '/studies/light.svg', number: '01', station: 'light', position: [-6.72, 2.4, -2], rotation: [0, Math.PI / 2, 0], width: 2.8, height: 3.3,
    description: 'A geometric placeholder exploring a warm circle, a cool field, and the rhythm of vertical lines.', analysis: 'Contrast draws the eye toward the circle. Repeated lines establish rhythm, while the surrounding space gives the composition room to breathe.' },
  { id: 'land', title: 'Study of land', theme: 'Landscape', image: '/studies/land.svg', number: '02', station: 'land', position: [0, 2.65, -8.72], rotation: [0, 0, 0], width: 5.1, height: 2.9,
    description: 'An original placeholder of layered shapes, made to test the experience of approaching a large work.', analysis: 'Overlapping planes suggest depth. A low horizon and a small circular accent balance the broad foreground. These notes demonstrate where the group’s visual analysis will appear.' },
  { id: 'form', title: 'Study of form', theme: 'Form', image: '/studies/form.svg', number: '03', station: 'form', position: [6.72, 2.4, -2], rotation: [0, -Math.PI / 2, 0], width: 2.8, height: 3.3,
    description: 'An original geometric placeholder testing curved forms, weight, and balance within a frame.', analysis: 'The repeated arch creates unity. Unequal areas of dark and light establish asymmetrical balance. Real museum content and attribution will replace these studies after research.' },
];

export function filterArtworks(query = '', theme = 'All') {
  const term = query.trim().toLowerCase();
  return artworks.filter(work => (theme === 'All' || work.theme === theme) && `${work.title} ${work.theme} ${work.description}`.toLowerCase().includes(term));
}

export function getStation(id) { return stations.find(station => station.id === id) ?? stations[0]; }
