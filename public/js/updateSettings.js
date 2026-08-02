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
  } catch (err) {
    showAlert('error', err.message);
  }
};
