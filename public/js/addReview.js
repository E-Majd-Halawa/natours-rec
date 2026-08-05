/* eslint-disable */
const reviewForm = document.getElementById('review-form');

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tourId = reviewForm.dataset.tourId;
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    try {
      // إرسال البيانات إلى الـ API الخاص بالمراجعات
      const res = await axios({
        method: 'POST',
        url: `/api/v1/tours/${tourId}/reviews`,
        data: {
          rating: Number(rating),
          review: review,
        },
      });

      if (res.data.status === 'success') {
        alert('Review added successfully!');
        // إعادة تحميل الصفحة فوراً لطباعة المراجعة الجديدة ضمن المراجعات
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review!');
    }
  });
}
