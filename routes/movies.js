const express = require('express');
const axios = require('axios');
const router = express.Router();

// @desc    Get movies by title
// @route   GET /api/v1/movies/:title
// @access  Public
router.get('/:title', async (req, res) => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: process.env.API_KEY,
      s: req.params.title
    }
  });

  res.send(response.data.Search);
});

// @desc    Get single movie by id
// @route   GET /api/v1/movies/movie/:id
// @access  Public
router.get('/movie/:id', async (req, res) => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: process.env.API_KEY,
      i: req.params.id
    }
  });

  res.send(response.data);
});

module.exports = router;
