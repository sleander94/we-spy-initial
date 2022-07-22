const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const puzzle_controller = require('../controllers/puzzleController');

router.get('/', puzzle_controller.puzzles_get);
router.get('/:id', puzzle_controller.puzzle_get);
router.post('/', upload.single('image'), puzzle_controller.puzzle_post);

module.exports = router;
