const Tour = require('./../Models/tourModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const factory = require('./handlerFactouy');
const sharp = require('sharp');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// --- 1. إعداد حساب Cloudinary ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- 2. دالة مساعدة لرفع الـ Buffer المظغوط من Sharp إلى Cloudinary ---
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('Not an image! Please upload only images.', 400),
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// --- 3. معالجة الصور وضغطها بـ Sharp ورفعها لـ Cloudinary ---
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files || (!req.files.imageCover && !req.files.images)) return next();

  // 1) معالجة ورفع صورة الغلاف (imageCover)
  if (req.files.imageCover) {
    const coverBuffer = await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await uploadToCloudinary(coverBuffer, {
      folder: 'natours/tours',
      public_id: `tour-${req.params.id || Date.now()}-cover`,
    });

    // حفظ رابط الصورة المباشر والقائم للأبد في req.body
    req.body.imageCover = result.secure_url;
  }

  // 2) معالجة ورفع باقي الصور (images)
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const imageBuffer = await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toBuffer();

        const result = await uploadToCloudinary(imageBuffer, {
          folder: 'natours/tours',
          public_id: `tour-${req.params.id || Date.now()}-${i + 1}`,
        });

        req.body.images.push(result.secure_url);
      }),
    );
  }

  next();
});

// ... باقي ملف tourController.js كما هو بدون أي تعديل (createTour, updateTour, إلخ)
