/* eslint-disable */
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';
import { showAlert } from './alerts';
import { deleteUser } from './manageUsers';
import { initBecomeGuide } from './becomeGuide';
import { deleteReview } from './deleteReview';
import { sendMessage } from './contact';
import { deleteContact } from './manageContacts';
import axios from 'axios';

// تشغيل الدالة
initBecomeGuide();

// ---------- Manage Users (Admin) ----------
const usersTable = document.querySelector('.table-users');

if (usersTable) {
  usersTable.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn--delete-user');

    if (deleteBtn) {
      const userId = deleteBtn.dataset.userId;
      const userRow = deleteBtn.closest('tr');

      if (confirm('Are you sure you want to delete this user?')) {
        deleteUser(userId, userRow);
      }
    }
  });
}

// DOM
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// delegation
if (mapBox) {
  displayMap(mapBox);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
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
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

// ---------- Manage Reviews (Admin) ----------
const tableReviews = document.querySelector('.billing-list');

if (tableReviews) {
  tableReviews.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn--delete-review')) {
      const reviewId = e.target.dataset.reviewId;

      if (confirm('Are you sure you want to delete this review?')) {
        try {
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`,
          });

          if (res.status === 204) {
            showAlert('success', 'Review deleted successfully!');
            e.target.closest('.review-row').remove();
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

// ---------- Manage Bookings (Admin) ----------
const tableBookings = document.querySelector('.billing-list');

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
            e.target.closest('.billing-row').remove();
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

// ---------- My Reviews (صفحة مراجعات المستخدم نفسه) ----------
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

// ---------- أزرار حذف قديمة (deleteReview.js) ----------
const deleteBtns = document.querySelectorAll('.btn-delete-review');

if (deleteBtns.length > 0) {
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const reviewId = e.target.dataset.id;

      if (confirm('هل أنت تأكد من أنك تريد حذف هذه المراجعة؟')) {
        deleteReview(reviewId);
      }
    });
  });
}

// ---------- قبول طلبات المرشدين (Become a Guide) ----------
const approveBtn = document.querySelectorAll('.btn--approve-guide');

if (approveBtn.length > 0) {
  approveBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const userId = e.target.dataset.userId;

      if (!confirm('هل أنت تأكد من قبول هذا المتقدم وتحويله إلى مرشد؟')) return;

      try {
        const res = await axios({
          method: 'PATCH',
          url: `/api/v1/users/${userId}`,
          data: {
            role: 'guide',
          },
        });

        if (res.data.status === 'success') {
          alert('تم قبول المرشد بنجاح! 🎉');
          window.location.reload();
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

// ---------- Contact Form ----------
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

// ---------- Manage Contacts (Admin) ----------
const tableContacts = document.querySelector('.table--contacts');

if (tableContacts) {
  tableContacts.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn--delete-contact');

    if (deleteBtn) {
      e.preventDefault();
      const contactId = deleteBtn.dataset.contactId;
      const rowElement = deleteBtn.closest('tr');

      if (confirm('Are you sure you want to delete this message?')) {
        deleteContact(contactId, rowElement);
      }
    }
  });
}
