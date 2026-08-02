/* eslint-disable */
// const mapEl = document.getElementById('map');
export const displayMap = (mapEl) => {
  if (mapEl) {
    const locations = JSON.parse(mapEl.dataset.locations);
    var map = L.map('map');

    locations.forEach((loc) => {
      L.marker([loc.coordinates[1], loc.coordinates[0]])
        .addTo(map)
        .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .openPopup();
    });

    const bounds = L.latLngBounds(
      locations.map((loc) => [loc.coordinates[1], loc.coordinates[0]]),
    );
    map.fitBounds(bounds, { padding: [50, 50] });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
};
