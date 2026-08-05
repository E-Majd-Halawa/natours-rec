const express = require('express');
const tourController = require('../Controller/tourController');
const authController = require('../Controller/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// 1. إعادة توجيه تقييمات الرحلة (Nested Routes)
router.use('/:tourId/reviews', reviewRouter);

// 2. المسارات الخاصة والإحصائيات (Public / Semi-Public)
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan || tourController.getMothlyPlan,
  );

// 3. مسارات البحث الجغرافي (Public)
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);

// 4. المسار الرئيسي لجلب وإنشاء الرحلات
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.processTourBody, // معالجة JSON من FormData
    tourController.createTour || tourController.creatTour,
  );

// 5. مسارات رحلة مفرده برقم الـ ID (GET عام للجميع، DELETE/PATCH محمي)
router
  .route('/:id')
  .get(tourController.getTour) // أصبح متاحاً للعامة الآن
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.processTourBody, // معالجة JSON من FormData
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
