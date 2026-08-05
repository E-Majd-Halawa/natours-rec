const express = require('express');
const authController = require('../Controller/authController');
const userController = require('../Controller/userController');
const reviewcontroller = require('../Controller/reviewController');
const { route } = require('./reviewRoutes');
const router = express.Router();
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);
router.route('/me').get(
  authController.protect,

  userController.getMe,
  userController.getUser,
);
router
  .route('/updateMe')
  .patch(
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe,
  );
router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);
router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.creatUser);
router
  .route(`/:id`)
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );
router.post('/signup', authController.signup);

module.exports = router;
