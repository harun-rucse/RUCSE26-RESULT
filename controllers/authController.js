const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.singUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    studentId: req.body.studentId,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  // const url = `${req.protocol}://${req.get('host')}/profile`;

  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { studentId, password } = req.body;

  // 1) Check if studentId and password are exists
  if (!studentId || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user is exists and password is correct
  const user = await User.findOne({ studentId }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3) if everything is ok, then send token to the client

  createSendToken(user, 200, res);
});

exports.logOut = (req, res, next) => {
  res.cookie('jwt', 'loggoutcookie', {
    expires: new Date(Date.now() + 10),
    httpOnly: true
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting the token from the client
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not login. Plesae login to get access', 401)
    );
  }
  // 2) Verify the token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging this token does no longer exist.', 401)
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please login again', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

//Only for renderd page, render to login page
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    // 2) Verify the token
    let currentUser;

    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.render('login');
      }
      // 4) Check if user changed password after the token was issued
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return res.render('login');
      }
    } catch (err) {
      return res.render('login');
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } else {
    return res.render('login');
  }
};

exports.checkLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    // 2) Verify the token
    let currentUser;

    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // 4) Check if user changed password after the token was issued
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return next();
      }
    } catch (err) {
      return next();
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } else {
    return next();
  }
};

exports.resticToSignInUp = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    return res.redirect('/dashboard');
  }
};

exports.resticTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permision to perform this action', 403)
      );
    }
    next();
  };
};

exports.viewResticTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.redirect('/dashboard');
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to the client vie email
  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/user/resetPassword/${resetToken}`;

    await new Email(user, resetUrl).sendPasswordResetToken();

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error to sending this email. Please try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) check if token not expired and there is user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update the passwordChangeAt propert to the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the cullection
  const user = await User.findById(req.user._id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // 3) If ok , update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) Send the JWT to the client
  createSendToken(user, 200, res);
});
