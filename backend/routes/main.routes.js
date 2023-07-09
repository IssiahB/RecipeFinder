const express = require('express');
const router = express.Router();
const passport = require('passport');

const { ensureAuthenticated } = require('../controllers/auth.controller.js');

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.status(200).json({ message: 'Login Successful' });
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.log('Error during logout:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json({ message: 'Logout Successful' });
    });
  });
  
  
 // TODO send whether or not authenticated
router.get('/auth', ensureAuthenticated, (req, res) => {
    res.sendStatus(403);
});

module.exports = router;