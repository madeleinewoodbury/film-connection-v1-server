const mongoose = require('mongoose');

const FilmCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  films: [
    {
      title: {
        type: String,
        required: true
      },
      poster: {
        type: String,
        required: true
      },
      year: {
        type: String,
        required: true
      },
      movieId: {
        type: String,
        required: true
      },
      watched: {
        type: Boolean,
        default: false
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('FilmCollection', FilmCollectionSchema);
