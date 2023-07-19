const { DataTypes } = require('sequelize');
const sequelize = require('./connection.js');
const bcrypt = require('bcrypt');

const User = sequelize.define('users', {
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

async function createUserTable() {
    try {
        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.log('Error synchronizing database: ', error);
    }
}

async function createUser(username, password) {
    try {
      await createUserTable(); // Ensure user table created

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        username: username,
        password: hashedPassword
      });

      console.log('User Created: ', user.username);
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

async function doesUserExist(givenUsername) {
    try {
        const user = await User.findOne({
            where: {
                username: givenUsername
            }
        });

        return !!user;
    } catch (error) {
        console.error('Error checking users existance: ', error);
        return false;
    }
}

async function findUserByUsername(givenUsername) {
    try {
        const query = `SELECT * FROM users WHERE username = '${givenUsername}'`;
        const [users, _] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        if (!users || users.length === 0) {
            return null; // User not found
        }
        
        if (Array.isArray(users)) {
            return users[0]; // Return the first user found
        }

        return users // Return the one user object found
    } catch (error) {
        console.log('Error finding user by username: ', error);
        return null;
    }
}

module.exports = {
    User,
    createUser,
    findUserById,
    findUserByUsername,
    doesUserExist,
};