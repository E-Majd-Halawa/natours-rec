/* eslint-disable */

document.addEventListener('DOMContentLoaded', () => {
  const tourForm = document.getElementById('tourForm');
  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');
  const adminMapEl = document.getElementById('adminMap');

  // --- 1. إعداد خريطة Leaflet التفاعلية ---
  if (adminMapEl) {
    // الإحداثيات الافتراضية (إما المسجلة في الرحلة أو مركز العالم)
    const initialLat = parseFloat(latInput.value) || 25.7617;
    const initialLng = parseFloat(lngInput.value) || -80.1918;
    const initialZoom = latInput.value ? 10 : 3;

    const map = L.map('adminMap').setView(
      [initialLat, initialLng],
      initialZoom,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker;

    if (latInput.value && lngInput.value) {
      marker = L.marker([initialLat, initialLng]).addTo(map);
    }

    // عند النقر على الخريطة، حدد المكان وعبئ الإدخالات فوراً
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
  }

  // --- 2. إرسال الفورم للـ Backend ---
  if (tourForm) {
    tourForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const tourId = tourForm.dataset.tourId;
      const isEdit = Boolean(tourId);

      // تجميع المرشدين المحددين
      const guidesSelect = document.getElementById('guides');
      const selectedGuides = Array.from(guidesSelect.selectedOptions).map(
        (opt) => opt.value,
      );

      // تجهيز FormData ليدعم الصور والبيانات
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

      if (document.getElementById('priceDiscount').value) {
        formData.append(
          'priceDiscount',
          document.getElementById('priceDiscount').value,
        );
      }

      // إرسال المصفوفة الخاصة بالـ Guides
      selectedGuides.forEach((guideId) => formData.append('guides', guideId));

      // تجهيز كائن startLocation وتمريره كـ JSON String (GeoJSON Standard)
      const lat = parseFloat(latInput.value);
      const lng = parseFloat(lngInput.value);
      const description = document.getElementById('locationDescription').value;

      if (lat && lng) {
        const startLocation = {
          type: 'Point',
          coordinates: [lng, lat], // تنبيه: Longitude أولاً في MongoDB!
          description: description,
          address: description,
        };
        formData.append('startLocation', JSON.stringify(startLocation));
      }

      const startDate = document.getElementById('startDate').value;
      if (startDate) {
        formData.append('startDates', JSON.stringify([startDate]));
      }

      // إضافة الصور في حالة الإنشاء
      const imageCoverFile = document.getElementById('imageCover')?.files[0];
      if (imageCoverFile) formData.append('imageCover', imageCoverFile);

      const imagesFiles = document.getElementById('images')?.files;
      if (imagesFiles) {
        Array.from(imagesFiles).forEach((file) =>
          formData.append('images', file),
        );
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
        alert(err.response?.data?.message || 'Something went wrong!');
      }
    });
  }
});
