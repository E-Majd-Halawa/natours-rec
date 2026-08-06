/* global L, axios */
(function () {
  const form = document.getElementById('tourForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const submitBtn =
    document.getElementById('createTourBtn') ||
    document.getElementById('submitBtn') ||
    form.querySelector('button[type="submit"]');

  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');

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

  const mapEl = document.getElementById('adminMap');
  if (mapEl && typeof L !== 'undefined' && latInput && lngInput) {
    const startLat = Number(latInput.value) || 20;
    const startLng = Number(lngInput.value) || 0;
    const map = L.map('adminMap').setView(
      [startLat, startLng],
      latInput.value ? 6 : 2,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker = null;
    if (latInput.value && lngInput.value) {
      marker = L.marker([startLat, startLng]).addTo(map);
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lngInput.value = lng.toFixed(6);
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });

    function updateMarkerFromInputs() {
      const lat = Number(latInput.value);
      const lng = Number(lngInput.value);
      if (lat && lng) {
        const newLatLng = [lat, lng];
        if (marker) {
          marker.setLatLng(newLatLng);
        } else {
          marker = L.marker(newLatLng).addTo(map);
        }
        map.panTo(newLatLng);
      }
    }

    latInput.addEventListener('change', updateMarkerFromInputs);
    lngInput.addEventListener('change', updateMarkerFromInputs);

    setTimeout(() => map.invalidateSize(), 200);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tourId = form.dataset.tourId;
    const isEdit = Boolean(tourId);
    const fd = new FormData(form);

    const body = {
      name: fd.get('name'),
      summary: fd.get('summary'),
      duration: Number(fd.get('duration')),
      maxGroupSize: Number(fd.get('maxGroupSize')),
      difficulty: fd.get('difficulty'),
      price: Number(fd.get('price')),
      description: fd.get('description') || undefined,
    };

    const priceDiscount = fd.get('priceDiscount');
    if (priceDiscount) body.priceDiscount = Number(priceDiscount);

    const checkedGuides = document.querySelectorAll(
      'input[name="guides"]:checked',
    );
    const selectedGuides = [...checkedGuides].map((cb) => cb.value);
    if (selectedGuides.length) body.guides = selectedGuides;

    const startDate = fd.get('startDate');
    if (startDate) body.startDates = [startDate];

    if (fd.get('lng') && fd.get('lat')) {
      const locationData = {
        type: 'Point',
        coordinates: [Number(fd.get('lng')), Number(fd.get('lat'))],
        description: fd.get('locationDescription') || 'Tour Start Location',
      };
      body.startLocation = locationData;
      // مطلوب لصفحة تفاصيل الجولة (#map data-locations) اللي بترسم tour.locations
      body.locations = [locationData];
    }

    if (!isEdit) {
      body.imageCover = 'tour-pending-cover.jpg';
    }

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = isEdit ? 'Saving…' : 'Creating tour…';

    try {
      const res = await axios({
        method: isEdit ? 'PATCH' : 'POST',
        url: isEdit ? `/api/v1/tours/${tourId}` : '/api/v1/tours',
        data: body,
      });

      const data = res.data;
      const createdDoc =
        data.data?.tour ||
        data.data?.doc ||
        data.data?.data ||
        data.data ||
        data;
      const newTourId = isEdit ? tourId : createdDoc?.id || createdDoc?._id;

      if (!isEdit && !newTourId) {
        throw new Error('Tour created but no id returned.');
      }

      const coverInput = document.getElementById('imageCover');
      const imagesInput = document.getElementById('images');

      const newCoverFile = coverInput?.files?.[0];
      const newGalleryFiles = imagesInput?.files;

      const hasCover = newCoverFile && newCoverFile.size > 0;
      const hasGallery = newGalleryFiles && newGalleryFiles.length > 0;

      if (hasCover || hasGallery) {
        if (statusEl) statusEl.textContent = 'Uploading photos…';
        const photoForm = new FormData();
        if (hasCover) photoForm.append('imageCover', newCoverFile);
        if (hasGallery)
          [...newGalleryFiles].forEach((f) => photoForm.append('images', f));

        await axios({
          method: 'PATCH',
          url: `/api/v1/tours/${newTourId}`,
          data: photoForm,
        });
      }

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
})();
