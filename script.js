//Intialize Map
var map = L.map('map').setView([20, 0], 2);

//Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 8,
    minZoom: 3
}).addTo(map);

// Limit the world to prevent infinite horizontal scrolling
const bounds = [[Number.NEGATIVE_INFINITY, -180], [Number.POSITIVE_INFINITY, 180]];
map.setMaxBounds(bounds, { animate: false });
map.options.worldCopyJump = false;

// Not allow panning outside the world bounds 
map.on('drag', function() {
    map.panInsideBounds(bounds);
});

let lookup = {};
fetch('data/country-by-population.json')
  .then(r => r.json())
  .then(pops => {
    pops.forEach(p => { lookup[p.country.trim().toLowerCase()] = p.population; });
    return fetch('data/world.geojson');
  })
  .then(r => r.json())
  .then(geo => {
    L.geoJSON(geo, {
      onEachFeature: (feature, layer) => {
        const name = (feature.properties?.NAME || feature.properties?.name || 'No Name').trim();
        const pop = lookup[name.toLowerCase()] ?? 'N/D';
        layer.bindPopup(`<b>${name}</b><br>Population: ${pop}`);
      }
    }).addTo(map);
  })
  .catch(console.error);