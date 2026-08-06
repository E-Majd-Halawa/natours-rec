const Tour = require('../Models/tourModel');
const Review = require('../Models/reviewModel');
const User = require('../Models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../Models/bookingModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation.If your booking dosen't show up here immediatly, Please come back later.";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.upDateUserData = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

exports.getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('manageTours', {
    title: 'Manage tours',
    tours,
  });
});
// controllers/viewController.js

// 1) صفحة إنشاء رحلة جديدة
exports.getNewTourForm = catchAsync(async (req, res, next) => {
  const allGuides = await User.find({ role: { $in: ['guide', 'lead-guide'] } });

  res.status(200).render('manageTourForm', {
    // 👈 اسم ملف الـ Pug
    title: 'New tour',
    tour: null,
    allGuides,
  });
});

// 2) صفحة تعديل رحلة سابقة
exports.getTourForm = catchAsync(async (req, res, next) => {
  let tour = null;
  if (req.params.id) {
    tour = await Tour.findById(req.params.id);
  }

  const allGuides = await User.find({ role: { $in: ['guide', 'lead-guide'] } });

  res.status(200).render('manageTourForm', {
    // 👈 اسم ملف الـ Pug
    title: tour ? `Edit ${tour.name}` : 'Create New Tour',
    tour,
    allGuides,
  });
});

exports.getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users,
  });
});

exports.getManageReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate({
      path: 'user',
      select: 'name photo',
    })
    .populate({
      path: 'tour',
      select: 'name',
    });

  res.status(200).render('manageReviews', {
    title: 'Manage Reviews',
    reviews,
  });
});

exports.getManageBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).render('manageBookings', {
    title: 'Manage Bookings',
    bookings,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name',
  });

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews,
  });
});

exports.getBilling = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name',
  });

  res.status(200).render('billing', {
    title: 'Billing History',
    bookings,
  });
});
