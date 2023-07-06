const passport = require('passport');
const { setupStrategy, ensureAuthenticated } = require('../auth.controller.js');
const { findUserByUsername } = require('../../models/user.model.js');

// Mocking passport function used in setupStrategy()
jest.mock('passport', () => ({
    use: jest.fn(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn()
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
        const mockedFindUserByUsername = findUserByUsername.mockImplementation(() =>
            Promise.resolve({ username: 'testuser', password: 'testpassword' })
        );

        const done = jest.fn();
        await passport._strategies.local._verify('testuser', 'testpassword', done);

        expect(findUserByUsername).toHaveBeenCalledWith('testuser');
        expect(done).toHaveBeenCalledWith(null, { username: 'testuser', password: 'testpassword' });

        mockedFindUserByUsername.mockRestore();
    });
});