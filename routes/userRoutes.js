const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

// --------------------------------------------------
// 1) Public Routes (مسارات عامة للجميع)
// --------------------------------------------------
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// --------------------------------------------------
// 2) Protected Routes (تتطلب تسجيل دخول فقط)
// --------------------------------------------------
// هذا السطر يحمي جميع المسارات المعرفة بعده تلقائياً دون الحاجة لتكرار authController.protect
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);

router.delete('/deleteMe', userController.deleteMe);

// --------------------------------------------------
// 3) Admin Only Routes (خاصة بالأدمن فقط)
// --------------------------------------------------
// هذا السطر يمنع أي مستخدم عادي من الوصول للمسارات أدناه
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.creatUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
