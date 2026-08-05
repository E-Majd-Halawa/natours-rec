/* global L, axios */
(function () {
  const form = document.getElementById('tourForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
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

  /* ---------- Interactive map: dynamic click & input binding ---------- */
  const mapEl = document.getElementById('adminMap');
  if (mapEl && typeof L !== 'undefined') {
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

    // 1) عند النقر على الخريطة -> تحديث خانات الإدخال
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

    // 2) إضافة ديناميكية: عند كتابة الخطوط والإحداثيات يدوياً -> تحريك الماركر في الخريطة مباشرة
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

  /* ---------- Form submit ---------- */
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

    // ربط المرشدين السياحيين المحددين ديناميكياً
    const guidesSelect = document.getElementById('guides');
    const selectedGuides = [...guidesSelect.selectedOptions].map(
      (o) => o.value,
    );
    if (selectedGuides.length) body.guides = selectedGuides;

    // إرسال موقع البداية والإحداثيات دائماً (في الإنشاء والتعديل)
    const startDate = fd.get('startDate');
    if (startDate) body.startDates = [startDate];

    if (fd.get('lng') && fd.get('lat')) {
      body.startLocation = {
        type: 'Point',
        coordinates: [Number(fd.get('lng')), Number(fd.get('lat'))],
        description: fd.get('locationDescription') || 'Tour Start Location',
      };
    }

    let imageCoverFile = null;
    let galleryFiles = [];

    if (!isEdit) {
      body.imageCover = 'tour-pending-cover.jpg';
      imageCoverFile = fd.get('imageCover');
      galleryFiles = document.getElementById('images').files;
    }

    submitBtn.disabled = true;
    statusEl.textContent = isEdit ? 'Saving…' : 'Creating tour…';

    try {
      const res = await axios({
        method: isEdit ? 'PATCH' : 'POST',
        url: isEdit ? `/api/v1/tours/${tourId}` : '/api/v1/tours',
        data: body,
      });

      const data = res.data;
      const createdDoc = data.data?.doc || data.data?.data || data.data || data;
      const newTourId = isEdit ? tourId : createdDoc?.id || createdDoc?._id;

      if (!isEdit && !newTourId) {
        throw new Error('Tour created but no id returned.');
      }

      // رفع الصور في حالة الإضافة أو إذا تم اختيار صور جديدة في التعديل
      const coverInput = document.getElementById('imageCover');
      const imagesInput = document.getElementById('images');

      const newCoverFile = coverInput?.files[0];
      const newGalleryFiles = imagesInput?.files;

      const hasCover = newCoverFile && newCoverFile.size > 0;
      const hasGallery = newGalleryFiles && newGalleryFiles.length > 0;

      if (hasCover || hasGallery) {
        statusEl.textContent = 'Uploading photos…';
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
      statusEl.textContent = '';
      submitBtn.disabled = false;
      const msg =
        err.response?.data?.message || err.message || 'Something went wrong.';
      showAlert('error', msg);
    }
  });
})();
