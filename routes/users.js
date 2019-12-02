const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Create a user
// @route   POST /api/v1/users
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, errors: err.message });
  }
});

module.exports = router;
