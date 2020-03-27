const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell your name']
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please provide a valid email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    studentId: {
      type: String,
      required: [true, 'Please provide a student Id']
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number']
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'subadmin'],
      default: 'user'
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    skill: {
      type: String,
      default: 'Learning'
    },
    description: {
      type: String,
      default: 'Please tells about yourself'
    },
    location: {
      type: String,
      default: 'Mathihar, Rajshahi'
    },
    avgCGPA: {
      type: Number,
      default: 0
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm Password'],
      validate: {
        //This only work on CREATE or SAVE
        validator: function(el) {
          return el === this.password;
        },
        message: 'Password are not same'
      }
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Populate
userSchema.virtual('results', {
  ref: 'Result',
  foreignField: 'student',
  localField: '_id'
});

// Pre save document middleware for hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Pre save document middleware for at passwordChangeAt when change password
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;

  next();
});

// Pre query middleware for filter deleted user where [active: false]
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });

  next();
});

// Instant methods for compare password
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instant methods for checking user change password after JWT was issued
userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instant methods for creating passwordResetToken in the database
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
