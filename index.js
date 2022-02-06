const express = require('express'),
    morgan = require('morgan');
    uuid = require('uuid')
    bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let movieList = [
    {
        title : "Avatar" ,
        genre : "Sci-Fi/Action",
        release_year: "2009",
        director : "James Cameron",
        director_birth : "8/16/1954",
        director_death : "n/a",
        id : "1"
    },

    {
        title : "Event Horizon" ,
        genre : "Horror/Sci-Fi",
        release_year: "1997",
        director : "Paul W.S. Anderson",
        director_birth : "3/4/1965",
        director_death : "n/a",
        id : "2"
    },

    {
        title : "Spaceballs" ,
        genre : "Comedy",
        release_year: "1987",
        director : "Mel Brooks",
        director_birth : "6/28/1926",
        director_death : "n/a",
        id : "3"
    },

    {
        title : "True Grit" ,
        genre : "Western",
        release_year: "1969",
        director : "Henry Hathaway",
        director_birth : "3/13/1898",
        director_death : "2/11/1985",
        id : "4"
    },

    {
        title : "Mortal Kombat" ,
        genre : "Action/Fantasy",
        release_year: "1995",
        director : "Paul W.S. Anderson",
        director_birth : "3/4/1965",
        director_death : "n/a",
        id : "5"
    },

    {
        title : "Resident Evil" ,
        genre : "Action/Horror",
        release_year: "2002",
        director : "Paul W.S. Anderson",
        director_birth : "3/4/1965",
        director_death : "n/a",
        id : "6"
    },

    {
        title : "Young Frankenstein" ,
        genre : "Horror/Comedy",
        release_year: "1974",
        director : "Mel Brooks",
        director_birth : "6/28/1926",
        director_death : "n/a",
        id : "7"
    },

    {
        title : "Lord of the Rings: The Fellowship of the Ring" ,
        genre : "Action/Fantasy",
        release_year: "2001",
        director : "Peter Jackson",
        director_birth : "10/31/1961",
        director_death : "n/a",
        id : "8"
    },

    {
        title : "The Princess Bride" ,
        genre : "Romance/Adventure",
        release_year: "1987",
        director : "Rob Reiner",
        director_birth : "3/6/1947",
        director_death : "n/a",
        id : "9"
    },

    {
        title : "Warcraft" ,
        genre : "Action/Fantasy",
        release_year: "2016",
        director : "Ducan Jones",
        director_birth : "5/30/1971",
        director_death : "n/a",
        id : "10"
    }
];
    

let userList = [
    {
        id : "1",
        name : "josh",
        username : "jwass01"
    },
    {
        id : "2",
        name : "fred",
        username : "freddo02"
    }
]


app.use(morgan('common',));

// GET request for all movies
app.get('/movies', (req, res) => {
    res.json(movieList);
});

// Get request for homepage
app.get('/', (req, res) => {
    res.send('Homepage works!');
});

//GET request to pull up user profile
app.get('/users/:username', (req, res) => {
    res.json(userList.find((user) =>
    { return user.username === req.params.username }));
});
    

//GET request to search a specific movie
app.get('/movies/:title', (req, res) => {
    res.json(movieList.find((movie) =>
    { return movie.title === req.params.title }));
});

app.use (express.static('public'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});


app.listen(8080, () => {
    console.log('Listening on port 8080.');
});

