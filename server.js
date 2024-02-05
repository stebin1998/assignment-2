/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Stebin George_____ Student ID: __120277223__ Date: ____Feb 05 2024___

*  Cyclic Link: https://plum-uptight-elephant.cyclic.app/
*
********************************************************************************/


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://stebin1998:stebin1998@cluster0.hnkiztt.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const movieSchema = new mongoose.Schema({
    year: Number,
    title: String,
    plot: String,
    rated: String,
    runtime: Number,
    poster: String,
    directors: [String],
    fullplot: String,
    cast: [String],
    awards: {
        text: String
    },
    imdb: {
        rating: Number,
        votes: Number
    }
});

const Movie = mongoose.model('Movie', movieSchema);

app.use(express.static(__dirname));

app.get('/api/movies', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const title = req.query.title || '';

    const query = title ? { title: { $regex: new RegExp(title, 'i') } } : {};

    try {
        const movies = await Movie.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await Movie.findById(movieId).exec();

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
