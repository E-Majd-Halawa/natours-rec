import axios from 'axios';
import { showAlert } from './alerts';

export const deleteContact = async (contactId, rowElement) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/manage-contacts/${contactId}`,
    });

    if (res.status === 204 || res.data?.status === 'success') {
      showAlert('success', 'Contact message deleted successfully!');
      if (rowElement) {
        rowElement.remove();
      } else {
        window.location.reload();
      }
    }
  } catch (err) {
    // إظهار سبب الخطأ القادم من الباك إند
    const errorMsg =
      err.response?.data?.message ||
      err.message ||
      'Error deleting contact message!';
    showAlert('error', errorMsg);
    console.error('Delete Contact Error:', err.response?.data);
  }
};
