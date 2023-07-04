const { DataTypes } = require('sequelize');
const connection = require('./connection.js');

const User = connection.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

async function createUser(username, password) {
    try {
      await connection.sync();
      console.log('Database synchronized');
  
      const user = await User.create({
        username: username,
        password: password
      });
      console.log('User created:', user.toJSON());
      return user.toJSON();
    } catch (error) {
      console.log('Error creating user:', error);
      return null;
    }
  }


module.exports = {
    User, createUser
};