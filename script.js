//Intialize Map
var map = L.map('map').setView([20, 0], 2);

//Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('data/world.geojson')
    .then(r => r.json())
    .then(data => {L.geoJSON(data).addTo(map);})
    .catch(err => console.error('Error loading GeoJSON:', err));