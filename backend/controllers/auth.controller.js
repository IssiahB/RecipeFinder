const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { findUserById, findUserByUsername } = require('../models/user.model.js');

function setupStrategy() {
    passport.use(
        new LocalStrategy((username, password, done) => {
            findUserByUsername(username)
                .then((user) => {
                    // Error with finding user
                    if (user === null) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    
                    // Incorrect password
                    if (user.password !== password) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }

                    // Authentication successful
                    return done(null, user);
                });
        })
    );

    // Serializing only the user id 
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = findUserById(id)
            .then((user) => {
                if (user === null) {
                    return done(new Error('Unable to find user with id: '+id));
                }
        
                return done(null, user);
            });
    });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
}

module.exports = {
    setupStrategy, ensureAuthenticated
}