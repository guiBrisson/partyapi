const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  registerValidation,
  loginValidation
} = require('../validation');

// Register
router.post('/register', async (req, res) => {
  // Validating the user
  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Checking if the user is already in the datebase
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  // Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Creating a new user
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });

  // Creating and assigning a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

  try{
    const savedUser = await user.save();
    res.header('auth-token', token);

    res.send({
      id: user._id,
      token: token,
      username: user.username,
      email: user.email
    });
  } catch(err){
    res.status(400).send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  // Validating the user
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email is not found');

  // Checking if the password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  // Creating and assigning a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token)

  res.send({
    id: user._id,
    token: token,
    username: user.username,
    email: user.email
  });
});

module.exports = router;
