const express = require('express');
const { check, validationResult } = require('express-validator');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Get all users (admins only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await controller.getAllUsers();
        responded.success(req, res, users, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

// Get a user by ID (admins only)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await controller.getUserById(req.params.id);
        responded.success(req, res, user, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

// Create a new user with validation and sanitization
router.post(
    '/',
    authenticateToken,
    [
        check('username')
            .isAlphanumeric().withMessage('El nombre de usuario debe contener solo letras y números')
            .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres')
            .trim().escape(),
        check('password')
            .isLength({ min: 5 }).withMessage('La contraseña debe tener al menos 5 caracteres')
            .trim().escape()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newUser = await controller.createUser(req.body);
            responded.success(req, res, newUser, 201);
        } catch (err) {
            responded.error(req, res, err, 500);
        }
    }
);

// Modify a user by ID with validation and sanitization
router.put(
    '/:id',
    authenticateToken,
    [
        check('username')
            .optional()
            .isAlphanumeric().withMessage('El nombre de usuario debe contener solo letras y números')
            .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres')
            .trim().escape(),
        check('password')
            .optional()
            .isLength({ min: 5 }).withMessage('La contraseña debe tener al menos 5 caracteres')
            .trim().escape()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedUser = await controller.updateUser(req.params.id, req.body);
            responded.success(req, res, updatedUser, 200);
        } catch (err) {
            responded.error(req, res, err, 500);
        }
    }
);

// Delete a user by ID (admins only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await controller.deleteUser(req.params.id);
        if (result) {
            responded.success(req, res, `User deleted successfully`, 200);
        } else {
            responded.error(req, res, `User not found`, 404);
        }
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

// User authentication (Login) with validation and sanitization
router.post(
    '/login',
    [
        check('username')
            .isAlphanumeric().withMessage('El nombre de usuario debe contener solo letras y números')
            .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres')
            .trim().escape(),
        check('password')
            .not().isEmpty().withMessage('La contraseña es obligatoria')
            .trim().escape()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const result = await controller.loginUser(username, password);
            if (result) {
                res.json({
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                });
            } else {
                responded.error(req, res, 'Usuario o contraseña incorrectos', 401);
            }
        } catch (err) {
            responded.error(req, res, err, 500);
        }
    }
);

// Refresh token route
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return responded.error(req, res, 'Refresh token is required', 401);
    }

    try {
        const newAccessToken = await controller.refreshAccessToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        responded.error(req, res, err, 403);
    }
});

module.exports = router;
