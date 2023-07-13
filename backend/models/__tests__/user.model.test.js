const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { User, createUser, findUserById, findUserByUsername } = require('../user.model.js');

jest.mock('sequelize', () => {
    const originalModule = jest.requireActual('sequelize');
    const sequelizeInstance = new originalModule.Sequelize({
        dialect: 'sqlite',
    });

    return {
        ...originalModule,
        Sequelize: jest.fn(() => sequelizeInstance),
        __esModule: true,
    };
});

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

describe('User Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should define User model', () => {
        const defineMock = jest.fn();
        const sequelizeInstance = new Sequelize();
        sequelizeInstance.define = defineMock;

        const expectedModelName = 'users';
        const expectedAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        };

        defineMock.mockReturnValueOnce({ modelName: expectedModelName, rawAttributes: expectedAttributes });

        expect(defineMock).toHaveBeenCalledTimes(1);
        expect(defineMock).toHaveBeenCalledWith(expectedModelName, expectedAttributes);
    });

    test('Should create user and hash password', async () => {
        const hashMock = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        const createMock = jest.spyOn(User, 'create').mockResolvedValue({ id: 1, username: 'testuser', password: 'hashedPassword' });

        const username = 'testuser';
        const password = 'testpassword';

        const expectedUser = {
            id: 1,
            username,
            password: 'hashedPassword',
        };

        const user = await createUser(username, password);

        expect(User.create).toHaveBeenCalledTimes(1);
        expect(User.create).toHaveBeenCalledWith({
            username,
            password: 'hashedPassword',
        });

        expect(user).toEqual(expectedUser);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);

        hashMock.mockRestore();
        createMock.mockRestore();
    });

    // Add more test cases for other functions (findUserById, findUserByUsername) if needed

});
