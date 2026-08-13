const express = require('express');
const viewController = require('../Controller/viewController');
const authController = require('../Controller/authController');
const bookingController = require('../Controller/bookingController');
const Tour = require('../Models/tourModel');

const router = express.Router();

// تنبيهات عامة (تُطبَّق على كل الراوتس تلقائياً)
router.use(viewController.alerts);

// ====================================================
// 1) Public Routes (مسارات عامة - متاحة للجميع)
// ====================================================
router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

router.get(
  '/loginForm',
  authController.isLoggedIn,
  viewController.getLoginForm,
);

router.get('/logout', authController.isLoggedIn, authController.logout);

router.get('/about', authController.isLoggedIn, viewController.getAbout);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

router.get(
  '/download-apps',
  authController.isLoggedIn,
  viewController.getDownloadApps,
);

router.get(
  '/become-a-guide',
  authController.isLoggedIn,
  viewController.getBecomeGuideForm,
);

// ====================================================
// 2) Protected User Routes (تتطلب تسجيل دخول)
// ====================================================
router.get('/me', authController.protect, viewController.getAccount);

router.get(
  '/my-tours',
  authController.isLoggedIn, // للـ navbar/res.locals
  authController.protect, // للتحقق ووضع req.user
  viewController.getMyTours,
);

router.get('/my-reviews', authController.protect, viewController.getMyReviews);

router.get('/billing', authController.protect, viewController.getBilling);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.upDateUserData,
);

router
  .route('/contact')
  .get(authController.protect, viewController.getContactForm)
  .post(authController.protect, viewController.sendContactMessage);

// ====================================================
// 3) Admin Only Routes (تتطلب صلاحية admin)
// ====================================================
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

router.get(
  '/manage-applications',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageApplications,
);

router.get(
  '/manage-contacts',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageContacts,
);

router.delete(
  '/manage-contacts/:id',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.deleteContact,
);

module.exports = router;
