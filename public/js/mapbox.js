/* eslint-disable */
export const displayMap = (mapEl) => {
  if (!mapEl) return;

  const locations = JSON.parse(mapEl.dataset.locations);

  // 1️⃣ إنشاء الخريطة مع إيقاف التكبير بالسكرول لمنع التعليق أثناء تصفح الصفحة
  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: true,
  });

  // 2️⃣ استخدام سيرفر CartoDB السريع جداً لتفادي بطء OpenStreetMap
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    },
  ).addTo(map);

  const points = [];

  // 3️⃣ إضافة العلامات (Markers) والنوافذ المنبثقة (Popups)
  locations.forEach((loc) => {
    // Leaflet تستقبل [lat, lng] بينما MongoDB يخزنها [lng, lat]
    const latLng = [loc.coordinates[1], loc.coordinates[0]];
    points.push(latLng);

    L.marker(latLng)
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
        closeOnClick: false,
        className: 'map-popup',
      });
  });

  // 4️⃣ ضبط أبعاد الخريطة لتتسع لجميع النقاط مع هامش مريح
  if (points.length > 0) {
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, {
      padding: [100, 100],
    });
  }

  // 5️⃣ إعادة إجبار الخريطة على حساب الحجم لتفادي أي مربعات رمادية
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
};
