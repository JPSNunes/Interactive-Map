//Intialize Map
var map = L.map('map').setView([20, 0], 2);

//Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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