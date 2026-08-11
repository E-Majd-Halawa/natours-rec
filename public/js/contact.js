import axios from 'axios';

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
      alert('Thank you! Your message has been sent successfully.');
      document.getElementById('contact-form').reset();
    }
  } catch (err) {
    alert(
      err.response?.data?.message || 'Something went wrong! Please try again.',
    );
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = originalText;
    }
  }
};

// Event Listener للفورم
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    sendMessage(name, email, subject, message);
  });
}
