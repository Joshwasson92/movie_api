const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    models = require('./models.js'),
    passportJWT = require('passport-jwt');

    let Users = Models.User,
        JWTStrategy = passportJWT.Strategy,
        ExtractJWT = passportJWT.ExtractJWT;
    
    passport.use(new localStrategy({usernameField: 'Username',
passwordField: 'Password'}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ Username: username}, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }

        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }

        console.log('finished');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'},
    (jwtPayload, callback) => {
        return Users.findByID(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
    }));
