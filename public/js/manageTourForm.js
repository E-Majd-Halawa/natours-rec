/* global L, axios */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tourForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const submitBtn =
    document.getElementById('createTourBtn') ||
    document.getElementById('submitBtn') ||
    form.querySelector('button[type="submit"]');

  const MAX_LOCATIONS = 3;

  function showAlert(type, msg) {
    const existing = document.querySelector('.alert');
    if (existing) existing.parentElement.removeChild(existing);
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(() => {
      const el = document.querySelector('.alert');
      if (el) el.parentElement.removeChild(el);
    }, 4000);
  }

  // ------------------------------------------------------------------
  // Locations Management (Leaflet Map)
  // ------------------------------------------------------------------
  const mapEl = document.getElementById('adminMap');
  const listEl = document.getElementById('locationsList');

  let locations = [];
  let map = null;

  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!locations.length) {
      listEl.insertAdjacentHTML(
        'beforeend',
        `<p class="form__hint">No locations added yet. Click the map to add one (up to ${MAX_LOCATIONS}).</p>`,
      );
      return;
    }

    locations.forEach((loc, i) => {
      const row = document.createElement('div');
      row.className = 'location-item';
      row.dataset.index = String(i);
      row.innerHTML = `
        <span class="location-item__index">${i + 1}</span>
        <input
          type="text"
          class="location-item__desc form__input"
          placeholder="${i === 0 ? 'Starting point name' : 'Location name'}"
          value="${loc.description ? loc.description.replace(/"/g, '&quot;') : ''}"
        />
        <button type="button" class="location-item__remove" title="Remove">×</button>
      `;

      row
        .querySelector('.location-item__desc')
        .addEventListener('input', (e) => {
          locations[i].description = e.target.value;
        });

      row
        .querySelector('.location-item__remove')
        .addEventListener('click', () => {
          removeLocation(i);
        });

      listEl.appendChild(row);
    });
  }

  function renumberMarkers() {
    locations.forEach((loc, i) => {
      if (loc.marker) {
        loc.marker.setTooltipContent(String(i + 1));
      }
    });
  }

  function addLocation(lat, lng, description) {
    if (locations.length >= MAX_LOCATIONS) {
      showAlert('error', `You can only add up to ${MAX_LOCATIONS} locations.`);
      return;
    }

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindTooltip(String(locations.length + 1), {
      permanent: true,
      direction: 'top',
      className: 'location-marker-label',
    });

    marker.on('click', () => {
      const idx = locations.findIndex((l) => l.marker === marker);
      if (idx !== -1) removeLocation(idx);
    });

    locations.push({ lat, lng, description: description || '', marker });
    renderList();
  }

  function removeLocation(index) {
    const loc = locations[index];
    if (loc && loc.marker) {
      map.removeLayer(loc.marker);
    }
    locations.splice(index, 1);
    renumberMarkers();
    renderList();
  }

  // ------------------------------------------------------------------
  // Initialize Map
  // ------------------------------------------------------------------
  if (mapEl && typeof L !== 'undefined') {
    let existingLocations = [];
    try {
      existingLocations = JSON.parse(mapEl.dataset.existingLocations || '[]');
    } catch (e) {
      existingLocations = [];
    }

    const firstLoc = existingLocations[0];
    const startLat =
      firstLoc && firstLoc.coordinates ? firstLoc.coordinates[1] : 20;
    const startLng =
      firstLoc && firstLoc.coordinates ? firstLoc.coordinates[0] : 0;

    map = L.map('adminMap').setView([startLat, startLng], firstLoc ? 6 : 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Seed existing locations (Edit Mode)
    existingLocations.slice(0, MAX_LOCATIONS).forEach((loc) => {
      if (loc.coordinates) {
        addLocation(loc.coordinates[1], loc.coordinates[0], loc.description);
      }
    });

    map.on('click', (e) => {
      addLocation(e.latlng.lat, e.latlng.lng, '');
    });

    renderList();

    // إجبار الخريطة على ضبط أبعادها فور التحميل
    setTimeout(() => map.invalidateSize(), 250);
  }

  // ------------------------------------------------------------------
  // Form Submit (Single Request via FormData)
  // ------------------------------------------------------------------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tourId = form.dataset.tourId;
    const isEdit = Boolean(tourId);

    if (!locations.length) {
      showAlert('error', 'Please add at least one location on the map.');
      return;
    }

    const formPayload = new FormData();

    formPayload.append('name', document.getElementById('name').value);
    formPayload.append('summary', document.getElementById('summary').value);
    formPayload.append(
      'duration',
      Number(document.getElementById('duration').value),
    );
    formPayload.append(
      'maxGroupSize',
      Number(document.getElementById('maxGroupSize').value),
    );
    formPayload.append(
      'difficulty',
      document.getElementById('difficulty').value,
    );
    formPayload.append('price', Number(document.getElementById('price').value));

    const desc = document.getElementById('description')?.value;
    if (desc) formPayload.append('description', desc);

    const priceDiscount = document.getElementById('priceDiscount')?.value;
    if (priceDiscount)
      formPayload.append('priceDiscount', Number(priceDiscount));

    // Guides
    const checkedGuides = document.querySelectorAll(
      'input[name="guides"]:checked',
    );
    checkedGuides.forEach((cb) => formPayload.append('guides', cb.value));

    // Start Dates
    const startDate = document.getElementById('startDate')?.value;
    if (startDate) formPayload.append('startDates', startDate);

    // Locations JSON
    const locationDocs = locations.map((loc, i) => ({
      type: 'Point',
      coordinates: [loc.lng, loc.lat],
      description:
        loc.description ||
        (i === 0 ? 'Tour Start Location' : `Location ${i + 1}`),
    }));

    formPayload.append('startLocation', JSON.stringify(locationDocs[0]));
    formPayload.append('locations', JSON.stringify(locationDocs));

    // Cover Image
    const coverInput = document.getElementById('imageCover');
    if (coverInput?.files?.[0]) {
      formPayload.append('imageCover', coverInput.files[0]);
    }

    // Gallery Photos
    const imagesInput = document.getElementById('images');
    if (imagesInput?.files?.length) {
      [...imagesInput.files].forEach((file) => {
        formPayload.append('images', file);
      });
    }

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = isEdit ? 'Saving…' : 'Creating tour…';

    try {
      await axios({
        method: isEdit ? 'PATCH' : 'POST',
        url: isEdit ? `/api/v1/tours/${tourId}` : '/api/v1/tours',
        data: formPayload,
      });

      showAlert('success', isEdit ? 'Tour updated!' : 'Tour created!');
      setTimeout(() => (window.location.href = '/manage-tours'), 800);
    } catch (err) {
      if (statusEl) statusEl.textContent = '';
      if (submitBtn) submitBtn.disabled = false;
      const msg =
        err.response?.data?.message || err.message || 'Something went wrong.';
      showAlert('error', msg);
    }
  });
});
