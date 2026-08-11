const express = require('express');
const viewController = require('../Controller/viewController');
const authController = require('../Controller/authController');
const bookingController = require('../Controller/bookingController');
const Tour = require('../Models/tourModel');

const router = express.Router();

// تنبيهات العامة
router.use(viewController.alerts);

// --------------------------------------------------
// 1) Public Routes (مسارات عامة)
// --------------------------------------------------
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get(
  '/loginForm',
  authController.isLoggedIn,
  viewController.getLoginForm,
);
router.get('/logout', authController.isLoggedIn, authController.logout);
router.get('/about', viewController.getAbout);
// --------------------------------------------------
// 2) Protected User Routes (مسارات المستخدمين المسجلين)
// --------------------------------------------------
router.get('/tour/:slug', authController.protect, viewController.getTour);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.upDateUserData,
);

// --------------------------------------------------
// 3) Admin Only Routes (مسارات لوحة تحكم الأدمن)
// --------------------------------------------------
router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageTours,
);

router.get(
  '/manage-tours/new',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getNewTourForm,
);
router.get(
  '/manage-tours/edit/:id',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getTourForm,
);
router.get(
  '/manage-users',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageUsers,
);

// مسار إدارة المراجعات المضاف حديثاً
router.get(
  '/manage-reviews',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageReviews,
);
router.get(
  '/manage-bookings',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageBookings,
);
// إضافة مسار عرض صفحة Tbeome a guide
router.get('/billing', authController.protect, viewController.getBilling);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get(
  '/become-a-guide',
  authController.isLoggedIn,
  viewController.getBecomeGuideForm,
);
router.get(
  '/manage-applications',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageApplications,
);
// أضف السطر التالي مع باقي الـ Routes التي تعرض صفحات Pug
router.get('/contact', viewController.getContactForm);
router.get('/download-apps', viewController.getDownloadApps);
module.exports = router;
