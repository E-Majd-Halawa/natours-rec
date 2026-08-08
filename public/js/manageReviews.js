import axios from 'axios';
import { showAlert } from './alerts';

// 1) دالة إرسال طلب الحذف إلى الـ API
export const deleteReview = async (reviewId, reviewRow) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`,
    });

    if (res.status === 204 || res.data.status === 'success') {
      showAlert('success', 'Review deleted successfully!');
      if (reviewRow) reviewRow.remove(); // إزالة السطر فوراً من الشاشة
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Failed to delete review',
    );
  }
};

// 2) الاستماع لحدث الضغط على زر الحذف (Event Delegation)
const reviewsTable = document.querySelector('.table-reviews');

if (reviewsTable) {
  reviewsTable.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn--delete-review');

    if (deleteBtn) {
      const reviewId = deleteBtn.dataset.reviewId;
      const reviewRow = deleteBtn.closest('tr');

      if (confirm('Are you sure you want to delete this review?')) {
        deleteReview(reviewId, reviewRow);
      }
    }
  });
}
