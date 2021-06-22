const express = require('express');

const router = express.Router();
const userController = require('../controllers/usersController');
/**
 * @route GET /api/users
 * @group Users - user operations
 * @param {integer} page.query - page number
 * @param {integer} per_page.query - items per page
 * @returns {User[]} 200 - User object
 */
router.get('/', userController.getUsers);

/**
 * @route GET /api/users/{id}
 * @group Users - user operations
 * @param {integer} id.path.required - id of the User - eg: 1
 * @returns {User.model} 200 - User object
 * @returns {Error} 404 - User not found
 */
router.get('/:id', userController.getUserById);

module.exports = router;