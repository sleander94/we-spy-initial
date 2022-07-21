const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  puzzles: [{ type: Schema.Types.ObjectId, ref: 'Puzzle' }],
  likedPuzzles: [{ type: Schema.Types.ObjectId, ref: 'Puzzle' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  isAdmin: { type: Boolean, required: false },
});

module.exports = mongoose.model('User', UserSchema);
