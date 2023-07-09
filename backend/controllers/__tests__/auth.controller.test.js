const passport = require('passport');
const { compare } = require('bcrypt');
const { setupStrategy, ensureAuthenticated, _strategyFunc } = require('../auth.controller.js');
const { findUserByUsername } = require('../../models/user.model.js');

// Mocking passport function used in setupStrategy()
jest.mock('passport', () => ({
    use: jest.fn(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn()
}));

jest.mock('../../models/user.model.js', () => ({
    findUserByUsername: jest.fn()
}));

describe('Authentication Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should set up local strategy and authentication functions', () => {
        setupStrategy();

        expect(passport.use).toHaveBeenCalledTimes(1);
        expect(passport.serializeUser).toHaveBeenCalledTimes(1);
        expect(passport.deserializeUser).toHaveBeenCalledTimes(1);
    });

    test('Should call findUserByUsername with the provided username', async() => {
        const mockedCompare = compare.mockResolvedValue(true);
        
        const mockedFindUserByUsername = findUserByUsername.mockImplementation(() =>
            Promise.resolve({ username: 'testuser', password: 'testpassword' })
        );

        const done = jest.fn();
        await _strategyFunc('testuser', 'testpassword', done);

        expect(compare).toHaveBeenCalledWith('testpassword', 'testpassword');
        expect(findUserByUsername).toHaveBeenCalledWith('testuser');
        expect(done).toHaveBeenCalledWith(null, { username: 'testuser', password: 'testpassword' });

        mockedCompare.mockRestore();
        mockedFindUserByUsername.mockRestore();
    });

    test('Should return error message when user is not found', async () => {
        const mockedFindUserByUsername = findUserByUsername.mockImplementation(() =>
        Promise.resolve(null));

        const done = jest.fn();
        await _strategyFunc('nonexistent', 'password', done);

        expect(findUserByUsername).toHaveBeenCalledWith('nonexistent');
        expect(done).toHaveBeenCalledWith(null, false, { message: 'Incorrect username.' });

        mockedFindUserByUsername.mockRestore();
    });

    test('Should return error message when password is incorrect', async () => {
        const mockedFindUserByUsername = findUserByUsername.mockImplementation(() =>
            Promise.resolve({ username: 'testuser', password: 'testpassword' })
        );

        const done = jest.fn();
        await _strategyFunc('testuser', 'incorrectpassword', done);

        expect(findUserByUsername).toHaveBeenCalledWith('testuser');
        expect(done).toHaveBeenCalledWith(null, false, { message: 'Incorrect password.' });

        mockedFindUserByUsername.mockRestore();
    });

    test('Should call done with user when authentication is successful', async () => {
        const mockedCompare = compare.mockResolvedValue(true);
        const mockedFindUserByUsername = findUserByUsername.mockImplementation(() => 
            Promise.resolve({ username: 'testuser', password: 'testpassword' })
        );

        const done = jest.fn();
        await _strategyFunc('testuser', 'testpassword', done);

        expect(compare).toHaveBeenCalledWith('testpassword', 'testpassword');
        expect(findUserByUsername).toHaveBeenCalledWith('testuser');
        expect(done).toHaveBeenCalledWith(null, { username: 'testuser', password: 'testpassword' });

        mockedFindUserByUsername.mockRestore();
    });

    test('Should ensure authentication', () => {
        const next = jest.fn();
        const req = {
            isAuthenticated: jest.fn().mockReturnValue(true)
        };

        ensureAuthenticated(req, {}, next);

        expect(req.isAuthenticated).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
    })
});