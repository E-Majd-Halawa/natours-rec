const express = require('express');
const tourController = require('../Controller/tourController');
const authController = require('../Controller/authController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-Plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );
router
  .route('/tours-Within/:distence/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);
//tours-distance?distance=223&center=-40,45&unit=mi
//tours-distance/223/center/-40,45/unit/mi

router.route('/').get(tourController.getAllTours).post(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages, // 👈 أضف هذه
  tourController.resizeTourImages, // 👈 وأضف هذه
  tourController.createTour,
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
