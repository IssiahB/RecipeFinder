require('dotenv').config();
const express = require('express');
const app = express();

const passport = require('passport');
const routes = require('./routes/main.routes.js');

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const port = 3000;
app.listen(port, () => {
    console.log('Server started on port: '+port);
});