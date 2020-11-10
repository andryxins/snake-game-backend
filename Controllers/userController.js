const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json([...allUsers]);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const addNewUser = async (req, res, next) => {
  const candidateUser = req.body;

  try {
    const newUser = await User.create({ ...candidateUser });
    const token = jwt.sign({ login: newUser.login }, process.env.JWT_SECRET, {
      expiresIn: '365 days',
    });

    return res.status(201).json({ user: { token: token, data: newUser } });
  } catch (e) {
    return res.status(500).json({ message: 'Internal Error' });
  }
};

const checkIsLoginUnique = async (req, res, next) => {
  const candidate = await User.findOne({ login: req.body.login });

  if (candidate) {
    return res.status(400).json({ message: 'User is already exist' });
  } else {
    return next();
  }
};

const validateNewUser = async (req, res, next) => {
  const shema = Joi.object({
    login: Joi.string().min(3).max(12).required(),
  });

  try {
    await shema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateUser = async (req, res, next) => {
  const newUserResault = req.body;
  const user = req.user;

  try {
    if (
      newUserResault.scores > user.topScores &&
      newUserResault.level > user.topLevel
    ) {
      await User.findOneAndUpdate(
        { login: user.login },
        { topScores: newUserResault.scores, topLevel: newUserResault.level }
      );
      return res
        .status(200)
        .json({ message: 'Top scores was updated succesfully' });
    } else {
      return res.status(200).json({
        message: 'Top scores not updated, new resault lower that top scores',
      });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const validateResault = async (req, res, next) => {
  const schema = Joi.object({
    scores: Joi.number()
      .integer()
      .min(Number(process.env.GAME_CONFIG_SCORES_TO_WIN))
      .required(),
    level: Joi.number().integer().min(1).required(),
  });

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const identifyUserWithToken = async (req, res, next) => {
  const token = req.get('Authorization');

  let userLogin;
  try {
    userLogin = jwt.verify(token, process.env.JWT_SECRET).login;
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }

  const user = await User.findOne({ login: userLogin });

  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(401).json({ message: 'not authorized' });
  }
};

module.exports = {
  checkIsLoginUnique,
  getAllUsers,
  updateUser,
  addNewUser,
  validateNewUser,
  validateResault,
  identifyUserWithToken,
};
