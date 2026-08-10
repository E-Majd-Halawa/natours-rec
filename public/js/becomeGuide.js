import axios from 'axios';
import { showAlert } from './alerts';

const guideForm = document.querySelector('.form--become-guide');

if (guideForm) {
  guideForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = guideForm.querySelector('button');
    submitBtn.textContent = 'Submitting...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('phone', document.getElementById('phone').value);
    form.append(
      'experienceYears',
      document.getElementById('experienceYears').value,
    );
    form.append('bio', document.getElementById('bio').value);
    form.append(
      'portfolioLink',
      document.getElementById('portfolioLink').value,
    );

    const cvFile = document.getElementById('cv').files[0];
    if (cvFile) {
      form.append('cv', cvFile);
    }

    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/become-guide', // أو المسار المعين للـ API في مشروعك
        data: form,
      });

      if (res.data.status === 'success') {
        showAlert(
          'success',
          'Application submitted successfully! We will review it shortly.',
        );
        window.setTimeout(() => {
          location.assign('/');
        }, 2000);
      }
    } catch (err) {
      showAlert(
        'error',
        err.response?.data?.message || 'Error submitting application!',
      );
    } finally {
      submitBtn.textContent = 'Submit Application';
    }
  });
}
