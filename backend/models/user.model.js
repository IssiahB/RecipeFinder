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

async function findUserById(givenId) {
    try {
        const user = await User.findOne({
            where: {
                id: givenId
            }
        });
        return user;
    } catch (error) {
        console.log('Error finding user by id: ', error);
        return null;
    }
}

async function findUserByUsername(givenUsername) {
    try {
        const user = await User.findOne({
            where: {
                username: givenUsername
            }
        });
        return user;
    } catch (error) {
        console.log('Error finding user by username: ', error);
        return null;
    }
}

module.exports = {
    User, createUser, findUserById, findUserByUsername
};