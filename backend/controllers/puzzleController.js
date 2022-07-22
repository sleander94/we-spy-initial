const Puzzle = require('../models/puzzle');
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
      const file = req.file;
      const result = await uploadFile(file);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error.' });
      }

      const puzzle = new Puzzle({
        authorName: req.user.username,
        authorId: req.user._id,
        timestamp: new Date(),
        title: req.body.title,
        image: `https://wespypuzzles.s3.us-west-1.amazonaws.com/${result.Key}`,
        hiddenItems: req.body.hiddenItems,
        likes: 0,
        comments: [],
      });
      puzzle.save((err) => {
        if (err) {
          return next(err);
        }
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
