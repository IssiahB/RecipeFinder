const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: console.log // Output logs to the console
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully');
    })
    .catch((error) => {
        console.error('Error connecting to the database: ', error);
    });

module.exports = sequelize;