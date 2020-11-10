const { Router } = require('express');
const {
  getAllUsers,
  updateUser,
  addNewUser,
  validateResault,
  identifyUserWithToken,
  checkIsLoginUnique,
  validateNewUser,
} = require('../Controllers/userController');

const router = Router();

router.get('/', getAllUsers);

router.post(
  '/update-resault',
  identifyUserWithToken,
  validateResault,
  updateUser
);

router.post('/new-user', validateNewUser, checkIsLoginUnique, addNewUser);

module.exports = router;
