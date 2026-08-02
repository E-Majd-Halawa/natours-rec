const express = require('express');
const reviewController = require('./../Controller/reviewController');
const authController = require('./../Controller/authController');
const router = express.Router({ mergeParams: true }); //  عشان اقدر اصل لمحتويات الراوترات المتداخلة{mergeParams:true}
router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user', 'admin'),
    reviewController.setTourUserId,
    reviewController.createReview,
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .post(authController.restrictTo('user', 'admin'), reviewController.updateOne)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
