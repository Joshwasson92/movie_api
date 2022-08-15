const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require("express-validator");
const port = process.env.PORT || 5000;
console.log(process.env);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cors = require("cors");
// old dynamic
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn't allow access from origin" +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// app.options(
//   "*",
//   cors(function (req, callback) {
//     var corsOptions;
//     if (allowedOrigins.indexOf(req.header("Origin")) == -1) {
//       corsOptions = {
//         origin: "*",
//         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//         preflightContinue: false,
//         optionsSuccessStatus: 204,
//         allowedHeaders: "Content-Type,Authorization",
//       };
//     } else {
//       corsOptions = { origin: false };
//     }
//     callback(null, corsOptions);
//     console.log("cors has been reached" + corsOptions);
//   })
// );

// app.use(
//   cors(function (req, callback) {
//     var corsOptions;
//     if (allowedOrigins.indexOf(req.header("Origin")) == -1) {
//       corsOptions = {
//         origin: "*",
//         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//         preflightContinue: false,
//         optionsSuccessStatus: 204,
//         allowedHeaders: "Content-Type,Authorization",
//       };
//     } else {
//       corsOptions = { origin: false };
//     }
//     callback(null, corsOptions);
//     console.log("cors has been reached" + corsOptions);
//   })
// );

const passport = require("passport");
// require('./passport');

const allowedOrigins = [
  "https://joshwasson92.github.io/myFlixAngular/",

  "http://localhost:8080",
  "https://jwmovieapi.herokuapp.com/",
  "http://localhost:1234",
  "http://localhost:4200",
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("common"));
let auth = require("./auth")(app);

// GET request for homepage
app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send("Welcome to the Flix Libray!");
});

//POST request to add movie
app.post(
  "/addmovies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(JSON.stringify(req.body));

    Movies.findOne({ Title: req.body.Title })
      .then((movie) => {
        if (movie) {
          return res.status(400).send(req.body.Title + " already exists.");
        } else {
          Movies.create({
            Title: req.body.Title,
            Description: req.body.Description,
            Genre: req.body.Genre,
            Director: req.body.Director,
            Featured: req.body.Featured,
            Actors: req.body.Actors,
            ImagePath: req.body.ImagePath,
          })
            .then((movie) => {
              res.status(201).json(movie);
              console.log("Movie Added");
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//DELETE request by movie title
app.delete(
  "/moviesdelete/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOneAndRemove({ Title: req.params.Title })
      .then((movie) => {
        if (!movie) {
          res.status(400).send(req.params.Title + " was not found.");
        } else {
          res.status(200).send(req.params.Title + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET Genre information
app.get(
  "/moviesgenre/:genre",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genre })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET Director information.
app.get(
  "/findbydirectorname/:director",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.director })
      .then((movie) => {
        console.log(req.params.director);
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET ALL Directors
app.get(
  "/directors",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({})
      .distinct("Director")
      .then((movie) => {
        console.log(movie);
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET request to pull  all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// GET request user by username
app.get(
  "/usersfind/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      // .populate("FavoriteMovies", ["Title", "Description"])
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//POST request to create a user
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//PUT request to update a users information
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);

    console.log(req.body, req.params);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, //This confirms updated document returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//POST request to add movie to users list
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, //This confirms updated array is returned.
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//GET request to view favorite movies of a users list

app.get(
  "/:Username/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ FavoriteMovies: req.params.FavoriteMovies })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//DELETE request to delete movie from users list
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, //This confirms updated array is returned.
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//DELETE a user by username
app.delete(
  "/usersdelete/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET request for all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use(express.static("public"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something is broken");
});

//GET request to search a specific movie
app.get(
  "/moviesearch/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Server

app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
