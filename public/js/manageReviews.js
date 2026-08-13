import axios from 'axios';
import { showAlert } from './alerts';

// دالة إرسال طلب الحذف إلى الـ API — تُستخدم من index.js
export const deleteReview = async (reviewId, reviewRow) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`,
    });

    if (res.status === 204 || res.data.status === 'success') {
      showAlert('success', 'Review deleted successfully!');
      if (reviewRow) reviewRow.remove();
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Failed to delete review',
    );
  }
};
