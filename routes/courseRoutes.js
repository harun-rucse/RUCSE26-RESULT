const express = require('express');
const courseController = require('./../controllers/courseController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/semsterCourse', courseController.getCourseBySemester);

router.use(authController.protect);
router.use(authController.resticTo('admin', 'subadmin'));

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(authController.resticTo('admin'), courseController.deleteCourse);

module.exports = router;
