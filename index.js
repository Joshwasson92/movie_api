const express = require('express'),
    morgan = require('morgan');

const app = express();

let movieList = [
    {
        title : "Avatar" ,
        genre : "Sci-Fi/Action",
        release_year: "2009"
    },

    {
        title : "Event Horizon" ,
        genre : "Horror/Sci-Fi",
        release_year: "1997"
    },

    {
        title : "Spaceballs" ,
        genre : "Comedy",
        release_year: "1987"
    },

    {
        title : "True Grit" ,
        genre : "Western",
        release_year: "1969"
    },

    {
        title : "Monty Python's The Meaning of Life" ,
        genre : "Comedy/Musical",
        release_year: "1983"
    },

    {
        title : "Resident Evil" ,
        genre : "Action/Horror",
        release_year: "2002"
    },

    {
        title : "Young Frankenstein" ,
        genre : "Horror/Comedy",
        release_year: "1974"
    },

    {
        title : "Lord of the Rings: The Fellowship of the Ring" ,
        genre : "Action/Fantasy",
        release_year: "2001"
    },

    {
        title : "The Princess Bride" ,
        genre : "Romance/Adventure",
        release_year: "1987"
    },

    {
        title : "Warcraft" ,
        genre : "Action/Fantasy",
        release_year: "2016"
    }
];
    

app.use(morgan('common',));


app.get('/movies', (req, res) => {
    res.json(movieList);
});


app.get('/', (req, res) => {
    res.send('Homepage works!');
});

app.use (express.static('public'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});


app.listen(8080, () => {
    console.log('Listening on port 8080.');
});

