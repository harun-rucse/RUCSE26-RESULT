const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.checkLoggedIn);

router.get(
  '/signup',
  authController.resticToSignInUp,
  viewController.getSignupForm
);
router.get(
  '/login',
  authController.resticToSignInUp,
  viewController.getLoginForm
);
router.get('/', authController.resticToSignInUp, viewController.getLoginForm);
router.get(
  '/forgotpassword',
  authController.resticToSignInUp,
  viewController.getForgotPasswordForm
);
router.get(
  '/user/resetPassword/:token',
  authController.resticToSignInUp,
  viewController.getResetPasswordForm
);

router.use(authController.isLoggedIn);

router.get('/dashboard', viewController.getDashBoardForm);
router.get('/profile', viewController.getProfileForm);
router.get('/user/show/:id', viewController.getUserProfileShowForm);
router.get('/userslist', viewController.getUserslistForm);
router.get('/result/view/:studentId', viewController.getRandomResultForm);
router.get('/result/update/:id', viewController.getEditStudentResultForm);

router.use(authController.viewResticTo('admin', 'subadmin'));

router.get(
  '/admin',
  authController.viewResticTo('admin'),
  viewController.getAdminForm
);

router.get('/users', viewController.getUserForm);
router.get('/adduser', viewController.getAddUserForm);
router.get('/user/edit/:id', viewController.getUserEditForm);

router.get('/results', viewController.getShowResultForm);
router.get('/addresult', viewController.getResultForm);
router.get('/result/edit/:id', viewController.getResultEditForm);
router.get('/result/show/:id', viewController.getAdminPreviewResultForm);

router.get('/courses', viewController.getCourseCategoryForm);
router.get('/addcourse', viewController.getAddCourseCategoryForm);
router.get('/course/edit/:id', viewController.getCourseCategoryEditForm);

module.exports = router;
