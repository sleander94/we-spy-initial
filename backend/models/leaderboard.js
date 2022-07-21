const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LeaderboardSchema = new Schema({
  puzzle: { type: Schema.Types.ObjectId, ref: 'Puzzle', required: true },
  scores: [
    {
      username: String,
      time: Number,
    },
  ],
});

LeaderboardSchema.virtual('url').get(function () {
  return '/leaderboards/' + this._id;
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
