/* eslint-disable */
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';
import { showAlert } from './alerts';

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
if (aler) showAlert('success', alertMessage, 20);
