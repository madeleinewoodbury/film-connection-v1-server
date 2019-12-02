const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Movies route');
});

router.get('/:movie', async (req, res) => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: process.env.API_KEY,
      s: req.params.movie
    }
  });

  res.send(response.data);
});

module.exports = router;
