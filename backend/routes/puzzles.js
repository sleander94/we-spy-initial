const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const puzzle_controller = require('../controllers/puzzleController');
const comment_controller = require('../controllers/commentController');

router.get('/', puzzle_controller.puzzles_get);
router.get('/:id', puzzle_controller.puzzle_get);
router.post('/', upload.single('image'), puzzle_controller.puzzle_post);
router.delete('/:id', puzzle_controller.puzzle_delete);

router.post('/:id/comment', comment_controller.comment_post);
router.delete('/:id/comment/:commentId', comment_controller.comment_delete);

module.exports = router;
