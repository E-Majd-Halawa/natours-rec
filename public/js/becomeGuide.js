import axios from 'axios';
import { showAlert } from './alerts';

export const initBecomeGuide = () => {
  const guideForm = document.querySelector('.form--become-guide');
  const cvInput = document.getElementById('cv');
  const label = document.querySelector('.form__upload-label');

  // 1. إظهار اسم الملف فور اختياره
  if (cvInput && label) {
    cvInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        label.textContent = `Selected: ${file.name}`;
        label.style.color = '#55c57a';
      } else {
        label.textContent = 'Choose File (PDF/DOC)';
        label.style.color = 'inherit';
      }
    });
  }

  // 2. إرسال النموذج لـ API
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

      const cvFile = cvInput?.files[0];
      if (cvFile) {
        form.append('cv', cvFile);
      }

      try {
        const res = await axios({
          method: 'POST',
          url: '/api/v1/users/become-guide',
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
};
