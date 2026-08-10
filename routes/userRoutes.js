const express = require('express');
const authController = require('../Controller/authController');
const userController = require('../Controller/userController');

const router = express.Router();

// 1) المسارات العامة (Public Routes - لا تتطلب تسجيل دخول)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// 2) تطبيق حماية تسجيل الدخول على كل المسارات التالية
router.use(authController.protect);

// مسارات المستخدم الحالي (Logged-in User Routes)
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);

// تقديم طلب المرشد (رفع الـ CV)
router.post(
  '/become-guide',
  userController.uploadCV,
  userController.becomeGuide,
);

// 3) المسارات الخاصة بالأدمن فقط (Restricted to Admin Only)
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.creatUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser) // الآن أصبحت محمية 100% للأدمن فقط
  .delete(userController.deleteUser);

module.exports = router;
