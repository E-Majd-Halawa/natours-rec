const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactouy');
const sharp = require('sharp');
const multer = require('multer');
// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (req, file, callback) => {
//     const ext = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else callback(new AppError('Not an image! Please upload only images.'));
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
const filterObj = (Obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(Obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = Obj[el];
  });
  return newObj;
};
// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);
//   next();
// });
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // 1) معالجة الصورة في الذاكرة والحصول على Buffer
  const imageBuffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  // 2) تحويل الـ Buffer إلى نص Base64 وتخزينه
  req.file.filename = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  next();
});
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  //1)create error if the user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This rout is not for password update, please use / updateMyPassword',
      ),
    );
  }
  //2)filtered out wanted fildes names that are not allowed to be update
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // console.log(filteredBody);

  //3)update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // if (filteredBody != req.body.params) {
  //   console.log(filteredBody, req.body.params);

  //   return next(new AppError('you can only update your name or email'));
  // }
  // console.log(req.user);

  res.status(200).json({
    status: 'success',
    user: updateUser,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.creatUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defind!',
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
//not for password
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
