const express = require('express');
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

// Create a new user
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newUser = await controller.createUser(req.body);
        responded.success(req, res, newUser, 201);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

// Modify a user by ID
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updatedUser = await controller.updateUser(req.params.id, req.body);
        responded.success(req, res, updatedUser, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

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

// User authentication (Login)
router.post('/login', async (req, res) => {
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
            responded.error(req, res, 'Invalid username or password', 401);
        }
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

module.exports = router;
