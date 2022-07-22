const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true },
  puzzle: { type: Schema.Types.ObjectId, ref: 'Puzzle', required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
