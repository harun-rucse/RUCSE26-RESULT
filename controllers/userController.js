const multer = require('multer');
const sharp = require('sharp');
const User = require('./../model/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/backend/images/users');
//   },
//   filename: (req, file, cb) => {
//     //user-1sa1dsa1d-323232325.jpg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/backend/images/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'results',
    select: 'courses part semester CGPA totalCredit gainCredit status -student'
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if POSTs password field
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update.Please use /updateMyPassword',
        400
      )
    );
  }
  // 2) Fillter out based on allowed fields
  const filterBody = filterObj(
    req.body,
    'name',
    'email',
    'phone',
    'studentId',
    'skill',
    'location',
    'description'
  );

  if (req.file) filterBody.photo = req.file.filename;

  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, {
  path: 'results',
  select: 'courses part semester CGPA totalCredit gainCredit status -student'
});
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
