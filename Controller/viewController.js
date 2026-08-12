const Tour = require('../Models/tourModel');
const Review = require('../Models/reviewModel');
const User = require('../Models/userModel');
const Booking = require('../Models/bookingModel');
const Contact = require('../Models/contactModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
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
  // 1) جيب الحجوزات الخاصة بالمستخدم الحالي
  const bookings = await Booking.find({ user: req.user.id });

  // 2) جيب الـ tours المرتبطة بهاي الحجوزات
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('my-tours', {
    title: 'My Bookings',
    tours,
    user: req.user, // مهم عشان يشتغل شرط user.role === 'admin' بالقائمة
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

exports.getNewTourForm = catchAsync(async (req, res, next) => {
  const allGuides = await User.find({ role: { $in: ['guide', 'lead-guide'] } });

  res.status(200).render('manageTourForm', {
    title: 'New tour',
    tour: null,
    allGuides,
  });
});

exports.getTourForm = catchAsync(async (req, res, next) => {
  let tour = null;
  if (req.params.id) {
    tour = await Tour.findById(req.params.id);
  }

  const allGuides = await User.find({ role: { $in: ['guide', 'lead-guide'] } });

  res.status(200).render('manageTourForm', {
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

exports.getAbout = (req, res) => {
  res.status(200).render('about', {
    title: 'About Us',
  });
};

exports.getBecomeGuideForm = (req, res) => {
  res.status(200).render('becomeGuide', {
    title: 'Become a Guide',
  });
};

exports.getManageApplications = catchAsync(async (req, res, next) => {
  const applications = await User.find({
    $or: [
      { cvUrl: { $exists: true, $ne: null, $ne: '' } },
      { cv: { $exists: true, $ne: null, $ne: '' } },
      { role: { $in: ['guide', 'lead-guide'] } },
    ],
  });

  res.status(200).render('manageApplications', {
    title: 'Manage Guide Applications',
    applications,
  });
});

exports.getDownloadApps = (req, res) => {
  res.status(200).render('downloadApps', {
    title: 'Download Mobile Apps',
  });
};

exports.getContactForm = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
  });
};

// أضف هذه الدالة أو حدثها في viewsController.js
exports.sendContactMessage = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const newContact = await Contact.create({
    name,
    email,
    subject,
    message,
    user: req.user.id, // إضافة معرّف المستخدم المسجل للرسالة
  });

  res.status(201).json({
    status: 'success',
    data: {
      contact: newContact,
    },
  });
});

exports.getManageContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find().sort('-createdAt');

  res.status(200).render('manageContacts', {
    title: 'Manage Contact Messages',
    contacts,
  });
});
exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError('No contact message found with that ID', 404));
  }

  // 204 No Content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
