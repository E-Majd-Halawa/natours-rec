const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const sharp = require('sharp');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ==========================================
// 1) إعداد رفع صورة البروفايل (Photos)
// ==========================================
const multerPhotoStorage = multer.memoryStorage();

const multerPhotoFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('Not an image! Please upload only images.', 400),
      false,
    );
  }
};

const uploadPhoto = multer({
  storage: multerPhotoStorage,
  fileFilter: multerPhotoFilter,
});

exports.uploadUserPhoto = uploadPhoto.single('photo');

// ==========================================
// 2) إعداد رفع ملف الـ CV إلى Cloudinary (PDF / DOC / DOCX)
// ==========================================

const cvFileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload only PDF or Word documents!', 400), false);
  }
};

const cvCloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'natours/cvs',
    resource_type: 'raw',
    public_id: (req, file) => `cv-${req.user.id}-${Date.now()}`,
  },
});

const uploadCV = multer({
  storage: cvCloudinaryStorage,
  fileFilter: cvFileFilter,
});

exports.uploadCV = uploadCV.single('cv');

// ==========================================
// 3) فلترة الحقول وتعديل الصور
// ==========================================
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const imageBuffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  req.file.filename = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  next();
});

// ==========================================
// 4) باقي دوال المستخدم والـ API
// ==========================================
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.creatUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};

// دالة استقبال طلب التقديم لمرشد
exports.becomeGuide = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload your CV document!', 400));
  }

  const cvUrl = req.file.path;

  // حفظ الـ CV في قاعدة البيانات
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { cvUrl: cvUrl },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'Application received successfully!',
    data: {
      user: updatedUser,
    },
  });
});

// مسارات الأدمن عبر الـ Factory
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
