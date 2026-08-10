/* eslint-disable */
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? '/updatePassword' : '/updateMe';
    const isFormData = data instanceof FormData;

    const res = await fetch(`/api/v1/users${url}`, {
      method: 'PATCH',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.message || 'Something went wrong');
    }

    showAlert('success', `${type.toUpperCase()} was successfully updated`);

    // إعطاء مهلة 1.5 ثانية ليقرأ المستخدم التنبيه ثم تحديث الصفحة لرؤية الصورة الجديدة
    window.setTimeout(() => {
      location.reload(true);
    }, 1500);
  } catch (err) {
    showAlert('error', err.message);
  }
};
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn--approve-guide')) {
    const userId = e.target.dataset.userId;

    try {
      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/users/${userId}`,
        data: {
          role: 'guide',
        },
      });

      if (res.data.status === 'success') {
        alert('تم ترقية المستخدم إلى مرشد بنجاح! 🎉');
        window.location.reload();
      }
    } catch (err) {
      alert(
        err.response ? err.response.data.message : 'حدث خطأ أثناء الترقية!',
      );
    }
  }
});
