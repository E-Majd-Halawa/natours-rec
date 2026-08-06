const saveTourData = async (data) => {
  try {
    // 1) إنشاء الرحلة الأساسية
    const res = await axios({
      method: 'POST',
      url: '/api/v1/tours',
      data,
    });

    if (res.data.status === 'success') {
      // 💡 قراءة الـ ID بشكل مضمون (سواء كانت _id أو id)
      const tour = res.data.data.tour || res.data.data.data || res.data.data;
      const tourId = tour._id || tour.id;

      if (!tourId) {
        showAlert('error', 'Tour created but no id returned.');
        return;
      }

      // 2) رفع الصور (الغلاف والمعرض) إن وجدت
      const coverInput = document.getElementById('imageCover');
      const imagesInput = document.getElementById('images');

      const formMedia = new FormData();
      let hasImages = false;

      if (coverInput && coverInput.files[0]) {
        formMedia.append('imageCover', coverInput.files[0]);
        hasImages = true;
      }

      if (imagesInput && imagesInput.files.length > 0) {
        Array.from(imagesInput.files).forEach((file) => {
          formMedia.append('images', file);
        });
        hasImages = true;
      }

      // إذا كان هناك صور، يتم إرسال طلب PATCH لإضافتها للرحلة
      if (hasImages) {
        await axios({
          method: 'PATCH',
          url: `/api/v1/tours/${tourId}`,
          data: formMedia,
        });
      }

      showAlert('success', 'Tour created successfully!');
      window.setTimeout(() => {
        location.assign('/manage-tours');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Something went wrong!');
  }
};
