import test from 'node:test';
import assert from 'node:assert/strict';
import { stations, artworks, filterArtworks, getStation } from '../src/data.js';

test('every possible transition stays inside the unobstructed sample room', () => {
  for (const from of stations) for (const to of stations) for (let t = 0; t <= 1; t += 0.05) {
    const x = from.position[0] * (1 - t) + to.position[0] * t;
    const z = from.position[2] * (1 - t) + to.position[2] * t;
    assert.ok(Math.abs(x) < 5.4 && Math.abs(z) < 8.2, `${from.id} to ${to.id} intersects room boundary or columns`);
  }
});

test('search trims input, ignores case, and combines with theme filters', () => {
  assert.equal(filterArtworks(' LIGHT ').length, 1);
  assert.equal(filterArtworks('light', 'Form').length, 0);
  assert.equal(filterArtworks('', 'Landscape')[0].id, 'land');
  assert.equal(filterArtworks('nonexistent').length, 0);
  assert.equal(filterArtworks().length, artworks.length);
});

test('every artwork has a reachable viewing point; invalid stations fall back safely', () => {
  for (const work of artworks) assert.ok(stations.some(station => station.id === work.station));
  assert.equal(getStation('invalid').id, 'arrival');
  assert.equal(new Set(stations.map(station => station.id)).size, stations.length);
});
