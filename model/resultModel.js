const mongoose = require('mongoose');
const User = require('./userModel');
const resultController = require('./../controllers/resultController');

const resultSchema = new mongoose.Schema({
  courses: [
    {
      courseName: String,
      courseCode: String,
      courseGrade: String,
      courseCredit: Number
    }
  ],
  studentId: {
    type: String,
    required: [true, 'Please provide a student ID']
  },
  part: {
    type: String,
    required: [true, 'Please provide which year you want to publish result']
  },
  semester: {
    type: String,
    required: [true, 'Please provide which semester you want to publish result']
  },
  session: {
    type: String,
    required: [true, 'Please provide which session you want to publish result']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  CGPA: {
    type: Number
  },
  totalCredit: {
    type: Number
  },
  gainCredit: {
    type: Number
  },
  status: {
    type: String
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

resultSchema.index({ part: 1, semester: 1, studentId: 1 });

// static methods for calculating the average CGPA of a student[only call in current Model(Result)]
resultSchema.statics.calcAverageCGPA = async function(studentId) {
  //this point to the current Model(Result Model)

  const stats = await this.aggregate([
    {
      $match: { studentId: studentId }
    },
    {
      $group: {
        _id: '$studentId',
        avgCGPA: { $avg: '$CGPA' }
      }
    }
  ]);
  // Save the avgCGPA in the User document based on [studentId]
  // Check if no result found then set avgCGPA of User document in default 0
  if (stats.length > 0) {
    await User.findOneAndUpdate(
      { studentId: studentId },
      {
        avgCGPA: stats[0].avgCGPA.toFixed(3)
      }
    );
  } else {
    await User.findOneAndUpdate(
      { studentId: studentId },
      {
        avgCGPA: 0
      }
    );
  }
};

// Pre save document middleware for add the student id in the Result document based on POSTed studentId
resultSchema.pre('save', async function(next) {
  // Get user real id from User collection based on POSTed result of studentId field
  const student = await User.findOne({ studentId: this.studentId });
  if (student) {
    this.student = student._id;
  }

  // Actual CGPA calculations [when save a new Result document]
  const calcResult = resultController.calculateResult(this.courses);

  this.CGPA = calcResult.cgpa.toFixed(3);
  this.totalCredit = calcResult.totalCredit;
  this.gainCredit = calcResult.gainCredit;
  this.status = calcResult.status;

  next();
});

// Post document middleware for calculating avgCGPA
// This is the perfect place to calculate because in the pre middleware the document is not in database
resultSchema.post('save', async function() {
  // this point to the current document
  await this.constructor.calcAverageCGPA(this.studentId);
});

// Pre query middleware for populate user from User collection
resultSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'student',
    select: 'name email phone avgCGPA'
  });
  next();
});

// Pre query middleware for getting the current document
resultSchema.pre(/^findOneAnd/, async function(next) {
  // this point to the current query not the document
  // To get the document execute the query
  // this.res is used for pass the document in pre middleware to post middleware
  this.res = await this.findOne();

  next();
});

resultSchema.post(/^findOneAnd/, async function() {
  // this not point to the current document[query already finished]
  // this.res is the current document passing through pre query middle
  const result = await this.res.constructor.findById(this.res._id);

  //Calculate the CGPA, totalCredit, gainCredit, status for [update and delete]
  if (result) {
    const calcResult = resultController.calculateResult(result.courses);

    result.CGPA = calcResult.cgpa.toFixed(3);
    result.totalCredit = calcResult.totalCredit;
    result.gainCredit = calcResult.gainCredit;
    result.status = calcResult.status;

    await result.save();
  }
  // Calculate the avgCGPA for a student
  await this.res.constructor.calcAverageCGPA(this.res.studentId);
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
