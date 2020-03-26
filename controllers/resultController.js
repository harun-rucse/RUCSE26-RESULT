const Result = require('./../model/resultModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllResults = factory.getAll(Result);
exports.getResult = factory.getOne(Result);
exports.updateResult = factory.updateOne(Result);
exports.deleteResult = factory.deleteOne(Result);

exports.createResult = catchAsync(async (req, res, next) => {
  // Prevent duplicate Result of same studentId of same semester
  const result = await Result.findOne({
    studentId: req.body.studentId,
    part: req.body.part,
    semester: req.body.semester,
    session: req.body.session
  });
  // console.log(result);
  if (result) {
    return next(new AppError('Result Already Published with that ID', 400));
  }

  const doc = await Result.create(req.body);

  if (!doc) {
    return next(new AppError('No document found with this id', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

const courseNumber = grade => {
  let number;
  switch (grade) {
    case 'A+':
      number = 4.0;
      break;
    case 'A':
      number = 3.75;
      break;
    case 'A-':
      number = 3.5;
      break;
    case 'B+':
      number = 3.25;
      break;
    case 'B':
      number = 3.0;
      break;
    case 'B-':
      number = 2.75;
      break;
    case 'C+':
      number = 2.5;
      break;
    case 'C':
      number = 2.25;
      break;
    case 'D':
      number = 2.0;
      break;
    case 'F':
      number = 0.0;
      break;
  }
  return number;
};

exports.calculateResult = resultObj => {
  let totalCredit = 0,
    totalGrade = 0,
    status = 'passed',
    checkPass = 0,
    gainCredit = 0,
    cgpa = 0;

  resultObj.forEach(el => {
    if (courseNumber(el.courseGrade) === 0.0) {
      checkPass += el.courseCredit;
    } else {
      gainCredit += el.courseCredit;
    }
    totalCredit += el.courseCredit;

    totalGrade += courseNumber(el.courseGrade) * el.courseCredit;
  });

  // Check if student year drop or not
  if (checkPass > 9) status = 'fail';

  cgpa = totalGrade / totalCredit;

  return { cgpa, totalCredit, gainCredit, status };
};
