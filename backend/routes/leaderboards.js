const express = require('express');
const router = express.Router();
const leaderboard_controller = require('../controllers/leaderboardController');

router.get('/:id', leaderboard_controller.leaderboard_get);

module.exports = router;
