/* eslint-disable */
import { showAlert } from './alerts';
export const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      showAlert('error', data.message); // ← هاد بيطلع 'Incorrect email or password'
    }
  } catch (err) {
    showAlert('error', data.message);
  }
};
export const logout = async () => {
  try {
    const res = await fetch('/logout', {
      // سطر 25
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out ! Try again');
  }
};
