const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../controllers/auth.controller.js');

router.post('/login', (req, res) => {

});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

router.get('/profile', ensureAuthenticated, (req, res) => {

});

module.exports = router;