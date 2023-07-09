const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { findUserById, findUserByUsername } = require('../models/user.model.js');

/**
 * Defines the local strategy and how to authenticate a user. The reason
 * for the standalone function is mainly for testing purposes.
 * @param {string} username The username to find in database
 * @param {string} password The password for the given user
 * @param {func} done A function that is called with related info about the user
 * @returns The 'done' function
 */
async function _strategyFunc(username, password, done) {
    try {
        const user = await findUserByUsername(username);
        
        // Error with finding user
        if (!user || user === null) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        // Incorrect password
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        // Authentication successful
        return done(null, user);
    } catch (error) {
        console.log('Error finding user by username: ', error);
        return done(error);
    }
}


function setupStrategy() {
    passport.use(new LocalStrategy(_strategyFunc));

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
    setupStrategy, ensureAuthenticated, _strategyFunc
}