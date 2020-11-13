const { Router } = require('express');
const {
  getAllUsers,
  updateUser,
  addNewUser,
  validateResault,
  identifyUserWithToken,
  checkIsLoginUnique,
  validateNewUser,
  checkIsUserExist,
} = require('../Controllers/userController');

const router = Router();

router.get('/', getAllUsers);

router.post('/new-user', validateNewUser, checkIsLoginUnique, addNewUser);

router.get('/:id', checkIsUserExist);

router.post(
  '/update-resault',
  identifyUserWithToken,
  validateResault,
  updateUser
);

module.exports = router;
