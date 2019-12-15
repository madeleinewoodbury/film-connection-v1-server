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
    check('title', 'Title is required')
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
    try {
      const newCollection = new FilmCollection({
        title: req.body.title,
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

// @desc    Update Film Collection
// @route   PUT /api/v1/collections/:id
// @access  Public
router.put(
  '/:id',
  auth,
  [
    check('title', 'Title is required')
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

    const { title, description } = req.body;
    const collectionFields = {};
    if (title) collectionFields.title = title;
    if (description) collectionFields.description = description;

    try {
      let collection = await FilmCollection.findById(req.params.id);
      if (!collection) {
        res.status(400).json({ msg: 'Collection not found' });
      }

      // Check user
      if (collection.user._id.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      // Update the new recipe
      collection = await FilmCollection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: collectionFields },
        { new: true }
      );

      res.json(collection);
    } catch (err) {
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Collection not found' });
      }
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

// @desc    Get all Film Collections
// @route   GET /api/v1/collections
// @access  Public
router.get('/', async (req, res) => {
  try {
    const collections = await FilmCollection.find();
    if (!collections) {
      return res.status(400).json({ msg: 'No collections found' });
    }

    res.json(collections);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @desc    Get Film Collection by id
// @route   GET /api/v1/collections/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const collection = await FilmCollection.findById(req.params.id);
    if (!collection) {
      return res.status(400).json({ msg: 'Collection not found' });
    }

    res.json(collection);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Collection not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
