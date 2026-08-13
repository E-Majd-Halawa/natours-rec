const tableReviews = document.querySelector('.billing-list');
import axios from 'axios';
import { showAlert } from './alerts';
if (tableReviews) {
  tableReviews.addEventListener('click', async (e) => {
    // التأكد من أن الضغط تم على زر الحذف
    if (e.target.classList.contains('btn--delete-review')) {
      const reviewId = e.target.dataset.reviewId;

      if (confirm('Are you sure you want to delete this review?')) {
        try {
          // إرسال طلب الحذف للباك إند
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`,
          });

          // HTTP status 204 تعني No Content (تم الحذف بنجاح)
          if (res.status === 204) {
            showAlert('success', 'Review deleted successfully!');
            // حذف الصف مباشرة من القائمة بدون إعادة تحميل الصفحة
            e.target.closest('.review-row').remove();
          }
        } catch (err) {
          showAlert(
            'error',
            err.response?.data?.message || 'Error deleting review!',
          );
        }
      }
    }
  });
}
