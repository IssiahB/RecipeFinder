const express = require('express');
const router = express.Router();
const passport = require('passport');

const { ensureAuthenticated } = require('../controllers/auth.controller.js');

router.post('/login', passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login'}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})
 // TODO send whether or not authenticated
router.get('/auth', ensureAuthenticated, (req, res) => {
    res.sendStatus(403);
});

module.exports = router;