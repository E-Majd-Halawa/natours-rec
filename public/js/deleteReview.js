// deleteReview.js
import axios from 'axios';
// إذا كنت تستخدم مكتبة للتنبيهات مثل showAlert (مثل مشروع Natours):
// import { showAlert } from './alerts';

export const deleteReview = async (reviewId) => {
  try {
    // 1. إرسال طلب الحذف للـ API
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`, // تأكد من مسار الـ API الخاص بك
    });

    // في طلبات DELETE الناجحة (204 No Content)، يرجع السيرفر استجابة فارغة
    if (res.status === 204 || res.data.status === 'success') {
      alert('تم حذف المراجعة بنجاح!');

      // 2. إزالة العنصر من الواجهة مباشرة دون إعادة تحميل الصفحة
      const card = document.querySelector(
        `.review-card[data-review-id="${reviewId}"]`,
      );
      if (card) {
        card.remove();
      } else {
        // أو إعادة تحميل الصفحة
        window.location.reload();
      }
    }
  } catch (err) {
    alert(err.response?.data?.message || 'حدث خطأ أثناء حذف المراجعة');
  }
};
