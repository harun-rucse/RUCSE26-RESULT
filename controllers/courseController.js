const Course = require('./../model/courseModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course);
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseBySemester = catchAsync(async (req, res, next) => {
  //console.log(req.body);
  const course = await Course.findOne({
    part: req.body.part,
    semester: req.body.semester,
    session: req.body.session
  });
  res.status(200).json({
    data: course.courses
  });
  //console.log(course.courses);
});
