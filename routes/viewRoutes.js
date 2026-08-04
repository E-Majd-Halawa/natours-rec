const express = require('express');
const viewController = require('../Controller/viewController');
const authController = require('../Controller/authController');
const bookingController = require('../Controller/bookingController');
const router = express.Router();
const Tour = require('../Models/tourModel');
router.get(
  '/manage-tours/new',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getNewTourForm,
);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
// router.get('/overview', viewController.getOverview);
router.get(
  `/loginForm`,
  authController.isLoggedIn,
  viewController.getLoginForm,
);

router.get(`/logout`, authController.isLoggedIn, authController.logout);
router.get(`/tour/:slug`, authController.protect, viewController.getTour);
router.get(`/me`, authController.protect, viewController.getAccount);
router.get(`/my-tours`, authController.protect, viewController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.upDateUserData,
);
router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageTours,
);
module.exports = router;
