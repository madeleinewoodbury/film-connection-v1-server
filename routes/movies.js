const express = require('express');
const axios = require('axios');
const router = express.Router();
const FilmCollection = require('../models/FilmCollection');

router.get('/', (req, res) => {
  res.send('Movies route');
});

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

  res.send(response.data);
});

// @desc    Get single movie by id
// @route   GET /api/v1/movies/:id
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

// @desc    Create a new Film Collection
// @route   POST /api/v1/movies/collections
// @access  Public
router.post('/collections/', async (req, res) => {
  try {
    const newCollection = new FilmCollection({
      name: req.body.name,
      description: req.body.description
    });

    const collection = await newCollection.save();
    res.json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Add movie to Film Collection
// @route   POST /api/v1/movies/collections/:id/:movieId
// @access  Public
router.post('/collections/:id/:movieId', async (req, res) => {
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
    collection.films.unshift(newFilm);
    await collection.save();

    res.json({ collection: collection.films, movie: newFilm });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
