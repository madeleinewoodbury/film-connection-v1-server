const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const FilmCollection = require('../models/FilmCollection');

// @desc    Create a new Film Collection
// @route   POST /api/v1/collections
// @access  Public
router.post(
  '/',
  auth,
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    3;
    try {
      const newCollection = new FilmCollection({
        name: req.body.name,
        description: req.body.description,
        user: req.user.id
      });

      const collection = await newCollection.save();
      res.json(collection);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @desc    Add movie to Film Collection
// @route   POST /api/v1/collections/:id/:movieId
// @access  Public
router.post('/:id/:movieId', auth, async (req, res) => {
  try {
    const response = await axios.get('http://www.omdbapi.com', {
      params: {
        apikey: process.env.API_KEY,
        i: req.params.movieId
      }
    });

    const newFilm = {
      title: response.data.Title,
      poster: response.data.Poster,
      year: response.data.Year,
      movieId: response.data.imdbID
    };

    const collection = await FilmCollection.findById(req.params.id);
    if (!collection) {
      return res.status(400).json({ msg: 'Collection not found' });
    }

    // Check user
    if (collection.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    collection.films.unshift(newFilm);
    await collection.save();

    res.json(collection);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Collection not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
