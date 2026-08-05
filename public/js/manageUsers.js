import axios from 'axios';
import { showAlert } from './alerts'; // أو دالة التنبيهات المستعملة لديك

export const deleteUser = async (userId, userRow) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`,
    });

    // كود 204 يعني تم الحذف بنجاح (No Content)
    if (res.status === 204 || res.data.status === 'success') {
      showAlert('success', 'User deleted successfully!');

      // إزالة السطر من جدول البيانات مباشرة
      if (userRow) userRow.remove();
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Failed to delete user');
  }
};
