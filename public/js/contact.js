import axios from 'axios';
import { showAlert } from './alerts';

export const sendMessage = async (name, email, subject, message) => {
  const sendBtn = document.querySelector('.btn--send-message');
  const originalText = sendBtn ? sendBtn.textContent : 'Send Message 🚀';

  try {
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending... ⏳';
    }

    const res = await axios({
      method: 'POST',
      url: '/contact',
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Thank you! Your message has been sent successfully.',
      );
      document.getElementById('contact-form').reset();
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Something went wrong! Please try again.',
    );
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = originalText;
    }
  }
};
