const express = require('express');
const tourController = require('../Controller/tourController');
console.log('TOUR CONTROLLER KEYS:', Object.keys(tourController));
const authController = require('../Controller/authController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();
//protect all routes after this middleware
// router.param('id', tourController.checkID);
//POST/tour/234kjm/reviews
//GET/tour/234kjm/reviews
//GET/tour/234kjm/reviews/897fed

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );
router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-Plan/:year').get(
  authController.protect, // إضافة protect لمنع خطأ restrictTo عند قراءة req.user
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan, // تصحيح الاسم من getMothlyPlan
);
router
  .route('/tours-Within/:distence/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin); // تصحيح الاسم إلى getToursWithin (إضافة s)
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances); // تصحيح الاسم إلى getDistances (إضافة s)
//tours-distance?distance=223&center=-40,45&unit=mi
//tours-distance/223/center/-40,45/unit/mi

router.route('/').get(tourController.getAllTours).post(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.createTour, // تصحيح الاسم من creatTour
);
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(tourController.deleteTour);

module.exports = router;
