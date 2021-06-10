const UserRepository = require('../repositories/userRepository');
const userRepository = new UserRepository('data/users.json');

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

        const user = await userRepository.getUserById(req.params._id);


        if (user) {

            res.status(200).render('user', { user: user });

        }
        else {

            res.status(404).send({ photo: null, message: "User id is incorrect." });

        }
    }
};