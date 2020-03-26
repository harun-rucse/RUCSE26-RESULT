const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courses: [
    {
      courseName: String,
      courseCode: String,
      courseCredit: Number
    }
  ],
  part: {
    type: String,
    required: [true, 'Please provide which year']
  },
  semester: {
    type: String,
    required: [true, 'Please provide which semester']
  },
  session: {
    type: String,
    required: [true, 'Please provide which session']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
