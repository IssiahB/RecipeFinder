require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');

const routes = require('./routes/main.routes.js');
const { setupStrategy } = require('./controllers/auth.controller.js');
const { createUser } = require('./models/user.model.js');

const app = express();
const port = 3000;
// Middleware
app.use(express.json());
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.sess_key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Setup authentication strategy
setupStrategy();

// Routes
app.use(routes);

// Start server
app.listen(port, () => {
  console.log('Server started on port:', port);
});