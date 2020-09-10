const { check,validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle: check('title')
        .trim()
        .isLength({min: 5, max: 40}),
    requirePrice: check('price')
        .trim()
        .toFloat()
        .isFloat({min: 1}),
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be an email!')
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({
                email
            });
            if (existingUser) {
                throw new Error('Email in use!');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters long!'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters long!')
        .custom((passwordConfirmation, { req }) => {
            if (req.body.password !== passwordConfirmation) {
                throw new Error('Passwords do not match!');
            }
            return true;
        }),
    requireEmailExists: check('email')
            .trim()
        .normalizeEmail()
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({
                email
            });
            if (!user) {
                throw new Error('Email not found!');
            }
        }),
    requireValidPasswordForUser: check('password')
            .trim()
        .custom(async (password, { req, res }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });
            if (!user) {
                throw new Error('Invalid password!');
            }
            const validPassword = await usersRepo.comparePasswords(user.password, password);
            if (!validPassword) {
                throw new Error('Invalid password!');
            }
            return true;
        })
}