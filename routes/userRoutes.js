const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/singup', authController.singUp);
router.post('/login', authController.login);
router.get('/logout', authController.logOut);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(
    authController.resticTo('admin', 'subadmin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authController.resticTo('admin', 'subadmin'),
    userController.updateUser
  )
  .delete(authController.resticTo('admin'), userController.deleteUser);

module.exports = router;
