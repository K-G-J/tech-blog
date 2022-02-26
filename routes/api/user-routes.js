const router = require('express').Router();
const { User } = require('../../models');

// get all users
router
    .route('/')
    .get((req, res) => {
        User.findAll({
            attributes: { exclude: ['password'] }
        })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    })
    .post((req, res) => {
        // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    });
// get single user
router
    .route('/:id')
    .get((req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router
    .route('/login')
    // login a user
    .post((req, res) => {
        // expects {email: 'lernantino@gmail.com', password: 'password1234'}
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then((dbUserData) => {
            if (!dbUserData) {
                res.status(400).json({
                    message: 'No user with that email address!'
                });
                return;
            }
            const validPassword = dbUserData.checkPassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });

router
    .route('/id')
    // update a user
    .put((req, res) => {
        // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
        User.update(req.body, {
            individualHooks: true,
            where: { id: req.params.id }
        })
            .then((dbUserData) => {
                if (!dbUserData[0]) {
                    res.status(404).json({
                        message: 'No user found with this id'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    })
    // delete a user
    .delete((req, res) => {
        User.destroy({ where: { id: req.params.id } })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with this id'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    });

module.exports = router;