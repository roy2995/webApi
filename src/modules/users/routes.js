const express = require('express');
const jwt = require('jsonwebtoken');
const responded = require('../../red/response');
const controller = require('./Controller');
const authenticateToken = require('../../authMiddleware');

const router = express.Router();

// Middleware verify admin rol
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access forbidden: Admins only');
    }
    next();
}

// GET users only by admins
router.get('/', authenticateToken, authorizeAdmin, async function(req, res) {
    try {
        const allUsers = await controller.getAll();
        responded.success(req, res, allUsers, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

// GET a user by ID, protected by authentication. Any authenticated user can access.
router.get('/:id', authenticateToken, async function(req, res) {
    try {
        const user = await controller.getUser(req.params.id);
        responded.success(req, res, user, 200);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

// PUT a new user, Normally this route is open for new user registration and does not require authentication
router.post('/', async function(req, res) {
    try {
        const newUser = await controller.createUser(req.body);
        responded.success(req, res, newUser, 201);
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

// DELETE a user, Protected by admin authentication and authorization. Only administrators can delete users.
router.delete('/', authenticateToken, authorizeAdmin, async function(req, res) {
    try {
        const { id, user } = req.query;

        if (!id && !user) {
            return responded.error(req, res, 'Must provide an ID or username to delete', 400);
        }

        const result = await controller.deleteUser(id, user);

        if (result) {
            responded.success(req, res, `User successfully deleted`, 200);
        } else {
            responded.error(req, res, `User not found`, 404);
        }
    } catch (err) {
        responded.error(req, res, err, 500);
    }
});

//POST login,Does not require prior authentication. Allows you to obtain an access token
router.post('/login', async function(req, res) {
    const { username, password } = req.body;

    // Validar credenciales y generar token
    const userData = await controller.loginUser(username, password);

    if (userData) {
        res.json({
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
            role: userData.role  // Aquí devolvemos el rol
        });
    } else {
        res.status(401).send('Invalid credentials');
    }
});


//refresh the token.Protected by token authentication. Only an authenticated user can renew their token
router.post('/token/refresh', authenticateToken, (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ accessToken });
    });
});

module.exports = router;
