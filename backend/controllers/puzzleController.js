const Puzzle = require('../models/puzzle');
const Leaderboard = require('../models/leaderboard');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const { uploadFile } = require('../s3');

exports.puzzles_get = (req, res, next) => {
  Puzzle.find({}).exec((err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).json(results);
  });
};

exports.puzzle_get = (req, res, next) => {
  Puzzle.findById(req.params.id).exec((err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).json(results);
  });
};

exports.puzzle_post = [
  body('title', 'Enter a title for your puzzle.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  async (req, res, next) => {
    if (req.isAuthenticated()) {
      const errors = validationResult(req);

      // Upload image file to AWS and get link info in result
      const file = req.file;
      const result = await uploadFile(file);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }

      const puzzle = new Puzzle({
        authorName: req.user.username,
        authorId: req.user._id,
        timestamp: new Date(),
        title: req.body.title,
        image: `https://wespypuzzles.s3.us-west-1.amazonaws.com/${result.Key}`,
        hiddenItems: req.body.hiddenItems,
        likes: [req.user._id],
        comments: [],
      });
      puzzle.save((err, results) => {
        if (err) {
          return next(err);
        }
        // After puzzle is saved, update user's likes to include it & create a leaderboard for it
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              puzzles: results._id,
              likedPuzzles: results._id,
            },
          }
        ).exec((err) => {
          if (err) {
            return next(err);
          }
        });
        const leaderboard = new Leaderboard({
          puzzle: results._id,
          scores: [],
        });
        leaderboard.save((err) => {
          if (err) {
            return next(err);
          }
        });
        return res
          .status(200)
          .json({ message: 'Puzzle created successfully.' });
      });
    } else {
      res
        .status(401)
        .json({ message: 'You need to be logged in to create a puzzle.' });
    }
  },
];
