const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');
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

module.exports = router;
