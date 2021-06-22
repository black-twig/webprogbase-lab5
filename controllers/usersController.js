const UserRepository = require('../repositories/userRepository');
const userRepository = new UserRepository('data/users.json');
const userProperty = Symbol('user');

module.exports = {
    async getUsers(req, res) {
        try {
        const users = await userRepository.getUsers();
            
        res.status(200).render('users', { users: users});

        } catch (err) {

            console.log(err.message);
            res.status(500).send({ users: null, message: 'Server error.' });

        }
    },
    async getUserById(req, res) {
        console.log(req.params._id);
        try {
            const user = await userRepository.getUserById(req.params.id);
            if (user) {
                req[userProperty] = user;
                res.send(req[userProperty]);
                res.end();
            }
            else
                res.sendStatus(404);
        } catch {
            console.log(err.message);
            res.sendStatus(500);
        }
    }
};