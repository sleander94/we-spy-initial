const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PuzzleSchema = new Schema({
  authorName: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  title: { type: String, required: true },
  image: { type: String, required: true },
  hiddenItems: [
    {
      description: String,
      minX: Number,
      maxX: Number,
      minY: Number,
      maxY: Number,
    },
  ],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

PuzzleSchema.virtual('url').get(function () {
  return '/puzzles/' + this._id;
});

module.exports = mongoose.model('Puzzle', PuzzleSchema);
