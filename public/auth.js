const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy.

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //local passport file



let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // username thats being encoded in jwt
        expiresIn: '7d', // specified token expiration date
        algorithm: 'HS256' // algorithm used to sign values of jwt
    } );
}

// POST login
modules.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON
            ());
                return res.json({ user, token});
            });
        })(req, res);
    });
}

let auth = require('./auth')(app);