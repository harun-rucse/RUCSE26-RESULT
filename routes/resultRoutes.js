const express = require('express');
const resultController = require('./../controllers/resultController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(
    authController.resticTo('admin', 'subadmin'),
    resultController.getAllResults
  )
  .post(
    authController.resticTo('admin', 'subadmin'),
    resultController.createResult
  );

router
  .route('/:id')
  .get(resultController.getResult)
  .patch(
    authController.resticTo('user', 'admin', 'subadmin'),
    resultController.updateResult
  )
  .delete(authController.resticTo('admin'), resultController.deleteResult);

module.exports = router;
