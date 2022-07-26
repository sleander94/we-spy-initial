const Comment = require('../models/comment');
const Puzzle = require('../models/puzzle');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.comment_post = [
  body('text', 'Enter a comment to post.').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    if (req.isAuthenticated()) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      const comment = new Comment({
        author: req.user.username,
        authorId: req.user._id,
        timestamp: new Date(),
        text: req.body.text,
        puzzle: req.params.id,
      });
      comment.save((err, results) => {
        if (err) {
          return next(err);
        }
        // Add comment to puzzle & user comment arrays on save
        Puzzle.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: {
              comments: results._id,
            },
          }
        ).exec((err) => {
          if (err) {
            return next(err);
          }
        });
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              comments: results._id,
            },
          }
        ).exec((err) => {
          if (err) {
            return next(err);
          }
        });
        res.status(200).json({ message: 'Comment created successfully.' });
      });
    } else {
      return res
        .status(401)
        .json({ message: 'You need to be logged in to comment.' });
    }
  },
];

exports.comment_delete = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId).exec((err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.authorId.equals(req.user._id)) {
        return res
          .status(401)
          .json({ message: 'You can only delete your own comments.' });
      }
      Comment.findByIdAndDelete(req.params.commentId, (err) => {
        if (err) {
          return next(err);
        }
        // Remove comment from puzzle & user comment arrays on delete
        Puzzle.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: {
              comments: results._id,
            },
          }
        ).exec((err) => {
          if (err) {
            return next(err);
          }
        });
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $pull: {
              comments: results._id,
            },
          }
        ).exec((err) => {
          if (err) {
            return next(err);
          }
        });
        return res
          .status(200)
          .json({ message: 'Comment deleted successfully.' });
      });
    });
  } else {
    return res
      .status(401)
      .json({ message: 'You need to be logged in to delete comments.' });
  }
};
