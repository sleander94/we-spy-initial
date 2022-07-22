require('dotenv').config();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.signup_post = [
  body('firstname', 'Firstname is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastname', 'Lastname is required').trim().isLength({ min: 1 }).escape(),
  body('username', 'Username must be between 3 and 16 characters.')
    .trim()
    .isLength({ min: 3, max: 16 })
    .escape(),
  body('password', 'Password must be between 6 and 16 characters.')
    .isLength({ min: 6, max: 16 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const user = new User({
        firstname: req.body.firstname.charAt(0)
          ? req.body.firstname.charAt(0).toUpperCase() +
            req.body.firstname.slice(1)
          : '',
        lastname: req.body.lastname.charAt(0)
          ? req.body.lastname.charAt(0).toUpperCase() +
            req.body.lastname.slice(1)
          : '',
        username: req.body.username,
        password: hashedPassword,
      });
      User.findOne({ username: user.username }).exec((err, results) => {
        if (err) {
          return next(err);
        }
        if (results !== null) {
          user.password = req.body.password;
          return res
            .status(400)
            .json({ message: 'That username is already taken.' });
        }
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors });
        }
        user.save((err, user) => {
          if (err) {
            return next(err);
          }
          return res
            .status(200)
            .json({ message: 'Account successfully created.' });
        });
      });
    });
  },
];

exports.login_post = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Incorrect username or password.' });
    }
    req.login(user, (err) => {
      if (err) {
        return res.send(err);
      }
      return res.status(200).json({
        message: 'Logged in successfully.',
        user,
      });
    });
  })(req, res, next);
};

exports.logout_post = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      message: 'Logged out successfully.',
    });
  });
};
