const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function setupStrategy() {
    passport.use(
        new LocalStrategy((username, password, done) => {
    
        })
    );

    // Using default serialization of whole user object
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = {
    setupStrategy, ensureAuthenticated
}