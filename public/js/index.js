/* eslint-disable */
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';
import { showAlert } from './alerts';
import { deleteUser } from './manageUsers';
import { initBecomeGuide } from './becomeGuide';

// تشغيل الدالة
initBecomeGuide();
// 1. تحديد الجدول
const usersTable = document.querySelector('.table-users');

if (usersTable) {
  usersTable.addEventListener('click', (e) => {
    // 2. التحقق مما إذا كان العنصر المخطوط هو زر الحذف
    const deleteBtn = e.target.closest('.btn--delete-user');

    if (deleteBtn) {
      // جلب ID المستخدم من data-user-id
      const userId = deleteBtn.dataset.userId;
      const userRow = deleteBtn.closest('tr');

      // رسالة تأكيد قبل الحذف
      if (confirm('Are you sure you want to delete this user?')) {
        deleteUser(userId, userRow);
      }
    }
  });
}
//DOM
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
//delegation
if (mapBox) {
  displayMap(mapBox);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (logOutBtn)
  logOutBtn.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
  });

const reviewsContainer = document.querySelector('.reviews');
const btnLeft = document.querySelector('.reviews__btn--left');
const userDataForm = document.querySelector('.form-user-data');
const btnRight = document.querySelector('.reviews__btn--right');

if (reviewsContainer && btnLeft && btnRight) {
  const cardWidth = 300 + 96;

  btnRight.addEventListener('click', () => {
    reviewsContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  btnLeft.addEventListener('click', () => {
    reviewsContainer.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', (el) => {
    el.target.textContent = 'Processing...';
    const { tourId } = el.target.dataset;
    bookTour(tourId);
  });
}
const signupForm = document.querySelector('.form--signup');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // هاد أهم سطر — بيمنع الإرسال الطبيعي
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
import axios from 'axios';
import { showAlert } from './alerts'; // إذا كنت تستخدم مكتبة التنبيهات الخاصة بك

const tableReviews = document.querySelector('.table-reviews');

if (tableReviews) {
  tableReviews.addEventListener('click', async (e) => {
    // التأكد من أن الضغط تم على زر الحذف
    if (e.target.classList.contains('btn--delete-review')) {
      const reviewId = e.target.dataset.reviewId;

      if (confirm('Are you sure you want to delete this review?')) {
        try {
          // إرسال طلب الحذف للباك إند
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`,
          });

          // HTTP status 204 تعني No Content (تم الحذف بنجاح)
          if (res.status === 204) {
            showAlert('success', 'Review deleted successfully!');
            // حذف السطر مباشرة من الجدول بدون إعادة تحميل الصفحة
            e.target.closest('tr').remove();
          }
        } catch (err) {
          showAlert(
            'error',
            err.response?.data?.message || 'Error deleting review!',
          );
        }
      }
    }
  });
}
const tableBookings = document.querySelector('.table-bookings');

if (tableBookings) {
  tableBookings.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn--delete-booking')) {
      const bookingId = e.target.dataset.bookingId;

      if (confirm('Are you sure you want to delete this booking?')) {
        try {
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/bookings/${bookingId}`,
          });

          if (res.status === 204) {
            showAlert('success', 'Booking deleted successfully!');
            e.target.closest('tr').remove();
          }
        } catch (err) {
          showAlert(
            'error',
            err.response?.data?.message || 'Error deleting booking!',
          );
        }
      }
    }
  });
}
const userReviewsTable = document.querySelector('.table-reviews');

if (userReviewsTable) {
  userReviewsTable.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn--delete-user-review')) {
      const reviewId = e.target.dataset.reviewId;

      if (confirm('Are you sure you want to delete your review?')) {
        try {
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`,
          });

          if (res.status === 204) {
            showAlert('success', 'Your review was deleted successfully!');
            e.target.closest('tr').remove();
          }
        } catch (err) {
          showAlert(
            'error',
            err.response?.data?.message || 'Error deleting review!',
          );
        }
      }
    }
  });
}
import { deleteReview } from './deleteReview';

// البحث عن كل أزرار الحذف في الصفحة
const deleteBtns = document.querySelectorAll('.btn-delete-review');

if (deleteBtns.length > 0) {
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // الحصول على ID المراجعة من data-id الموجود في زر الـ Pug
      const reviewId = e.target.dataset.id;

      // تأكيد الحذف من المستخدم قبل التنفيذ
      if (confirm('هل أنت تأكد من أنك تريد حذف هذه المراجعة؟')) {
        deleteReview(reviewId);
      }
    });
  });
}
// البحث عن زر قبول المرشد وتفعيل الحدث
const approveBtn = document.querySelectorAll('.btn--approve-guide');

if (approveBtn.length > 0) {
  approveBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const userId = e.target.dataset.userId;

      if (!confirm('هل أنت تأكد من قبول هذا المتقدم وتحويله إلى مرشد؟')) return;

      try {
        // إرسال طلب PATCH لتحديث دور المستخدم إلى guide
        const res = await axios({
          method: 'PATCH',
          url: `/api/v1/users/${userId}`,
          data: {
            role: 'guide',
          },
        });

        if (res.data.status === 'success') {
          alert('تم قبول المرشد بنجاح! 🎉');
          window.location.reload(); // إعادة تحميل الصفحة لرؤية التحديث
        }
      } catch (err) {
        alert(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'حدث خطأ أثناء الترقية!',
        );
      }
    });
  });
}
