const { doesUserExist, createUser } = require("../models/user.model");

async function createNewUser(req, res) {
    const { username, password } = req.body;
    const userExists = await doesUserExist(username);

    if (!userExists) {
        try {
            createUser(username, password);
        } catch (error) {

        }
    } else {
        throw new Error('User already exists');
    }
}

module.exports = {
    createNewUser,
}