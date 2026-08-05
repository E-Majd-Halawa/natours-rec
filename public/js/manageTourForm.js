/* eslint-disable */

document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('adminMap');
  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');
  const tourForm = document.getElementById('tourForm');

  // 1. تهيئة الخريطة
  if (mapContainer) {
    let initialLat = parseFloat(latInput.value) || 25.7617;
    let initialLng = parseFloat(lngInput.value) || -80.1918;
    const hasExistingCoords = Boolean(latInput.value && lngInput.value);

    const map = L.map('adminMap').setView(
      [initialLat, initialLng],
      hasExistingCoords ? 9 : 3,
    );

    // إضافة الخريطة الأساسية من OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker;

    if (hasExistingCoords) {
      marker = L.marker([initialLat, initialLng]).addTo(map);
    }

    // تحديث الإحداثيات عند النقر على الخريطة
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lngInput.value = lng.toFixed(6);

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
    });

    // إعادة معايرة العرض لمنع أي مشكلة في أبعاد الخريطة
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }

  // 2. معالجة حفظ أو تعديل البيانات
  if (tourForm) {
    tourForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const tourId = tourForm.dataset.tourId;
      const isEdit = Boolean(tourId);
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      const formData = new FormData();
      formData.append('name', document.getElementById('name').value);
      formData.append('summary', document.getElementById('summary').value);
      formData.append('duration', document.getElementById('duration').value);
      formData.append(
        'maxGroupSize',
        document.getElementById('maxGroupSize').value,
      );
      formData.append(
        'difficulty',
        document.getElementById('difficulty').value,
      );
      formData.append('price', document.getElementById('price').value);
      formData.append(
        'description',
        document.getElementById('description').value,
      );

      const priceDiscount = document.getElementById('priceDiscount').value;
      if (priceDiscount) formData.append('priceDiscount', priceDiscount);

      // تجميع المرشدين المحددين
      const guidesSelect = document.getElementById('guides');
      if (guidesSelect) {
        const selectedGuides = Array.from(guidesSelect.selectedOptions).map(
          (opt) => opt.value,
        );
        selectedGuides.forEach((guideId) => formData.append('guides', guideId));
      }

      // تجهيز كائن startLocation (GeoJSON)
      const lat = parseFloat(latInput.value);
      const lng = parseFloat(lngInput.value);
      const description = document.getElementById('locationDescription').value;

      if (lat && lng) {
        const startLocation = {
          type: 'Point',
          coordinates: [lng, lat], // Mongo GeoJSON Standard: [Longitude, Latitude]
          description: description,
          address: description,
        };
        formData.append('startLocation', JSON.stringify(startLocation));
      }

      // إضافة التواريخ
      const startDate = document.getElementById('startDate').value;
      if (startDate) {
        formData.append('startDates', JSON.stringify([startDate]));
      }

      // إضافة الصور
      const coverInput = document.getElementById('imageCover');
      if (coverInput && coverInput.files[0]) {
        formData.append('imageCover', coverInput.files[0]);
      }

      const imagesInput = document.getElementById('images');
      if (imagesInput && imagesInput.files.length > 0) {
        Array.from(imagesInput.files).forEach((file) => {
          formData.append('images', file);
        });
      }

      try {
        const url = isEdit ? `/api/v1/tours/${tourId}` : '/api/v1/tours';
        const method = isEdit ? 'PATCH' : 'POST';

        const res = await axios({
          method,
          url,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data.status === 'success') {
          alert(`Tour ${isEdit ? 'updated' : 'created'} successfully!`);
          window.location.href = '/manage-tours';
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error processing request!');
        submitBtn.textContent = isEdit ? 'Save Changes' : 'Create Tour';
        submitBtn.disabled = false;
      }
    });
  }
});
