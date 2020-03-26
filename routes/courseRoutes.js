const express = require('express');
const courseController = require('./../controllers/courseController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/semsterCourse', courseController.getCourseBySemester);

router.use(authController.protect);
router.use(authController.resticTo('admin'));

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
