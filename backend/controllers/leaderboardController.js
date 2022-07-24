const Leaderboard = require('../models/leaderboard');
const Puzzle = require('../models/puzzle');

exports.leaderboard_get = (req, res, next) => {
  Leaderboard.findById(req.params.id)
    .populate('puzzle')
    .exec((err, results) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(results);
    });
};
