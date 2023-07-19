const express = require('express');
const router = express.Router();
const passport = require('passport');

const { isAuthenticated } = require('../controllers/auth.controller.js');
const { createNewUser } = require('../controllers/user.controller.js');

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
  
router.post('/user', (req, res) => {
    try {
      createNewUser(req, res);
    } catch (error) {
      //console.log(error);
    }
});

router.get('/history', isAuthenticated, (req, res) => {
    res.sendStatus(200);
});

module.exports = router;