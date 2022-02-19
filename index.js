const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

    const morgan = require('morgan');
    const app = express();
    const mongoose = require("mongoose");
    const Models = require('./models.js');

    const Movies = Models.Movie;
    const Users = Models.User;
    
 



mongoose.connect('mongodb://localhost:27017/myFlixDB',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

app.use(bodyParser.json());

app.use(morgan('common'));





// GET request for homepage
app.get('/', (req, res) => {
    res.send('Welcome to the Flix Libray!');
});

//POST request to add movie
app.post('/addmoviestolist', (req, res) => {
    Movies.findOne({ Title: req.body.Title })
      .then((movie) => {
          if (movie) {
              return res.status(400).send(req.body.Title + ' already exists.');
          } else {
              Movies.create({
                  Title: req.body.Title,
                  Description: req.body.Description,
                  Genre: req.body.Genre,
                  Director: req.body.Director,
                  Featured: req.body.Featured,
                  Actors: req.body.Actors,
                  ImagePath: req.body.ImagePath
                  })
                      .then((movie) => {
                          res.status(201).json(movie);
                          console.log('Movie Added')
                      })
                      .catch((error) => {
                      console.error(error);
                      res.status(500).send('Error: ' + error);
                  });
          }
      })
      .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
      });
});

//DELETE request by movie title
app.delete('/moviesdelete/:Title', (req, res) => {
    Movies.findOneAndRemove({ Title: req.params.Title })
    .then((movie) => {
        if (!movie) {
            res.status(400).send(req.params.Title + ' was not found.');
        } else {
            res.status(200).send(req.params.Title + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//GET Genre information
app.get("/moviesgenre/:genre", (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genre })
    .then((movie) => {
        res.json(movie.Genre.Description);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//GET Director information.
app.get("/findbydirectorname/:director", (req, res) => {
    Movies.findOne({ "Director.Name": req.params.director })
    .then((movie) => {
        console.log(req.params.director)
        res.json(movie.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//GET ALL Directors
app.get("/directors", (req, res) => {
    Movies.find({}).distinct("Director")
    .then((movie) => {
        console.log(movie)
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});



//GET request to pull  all users
app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// GET request user by username
app.get('/usersfind/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
    
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

  //POST request to create a user
  app.post('/users', (req, res) => {
      Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                    })
                        .then((user) => {
                            res.status(201).json(user);
                        })
                        .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
  });


//PUT request to update a users information
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
   },
    { new: true }, //This confirms updated document returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
    });
});


//POST request to add movie to users list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, //This confirms updated array is returned.
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        };
    });
});

//DELETE request to delete movie from users list
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, //This confirms updated array is returned.
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        };
    });
});


//DELETE a user by username
app.delete('/usersdelete/:Username', (req, res) => {
    Users.findOneAndRemove({ username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


  // GET request for all movies
app.get('/movies', (req, res) => {
    Movies.find({})
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//GET request to search a specific movie
app.get('/moviesearch/:title', (req, res) => {
    Movies.findOne({ Title: req.params.title })
    .then((movies) => {
        res.json(movies);
        
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


app.use (express.static('public'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});

// Server
app.listen(8080, () => {
    console.log('Listening on port 8080.');
});


