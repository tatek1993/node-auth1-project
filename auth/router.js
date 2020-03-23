const bcrypt = require('bcryptjs');
const router = require('express').Router();
const Users = require('../users/usersModel.js');

router.post('/register', (req, res) => {
    const userInfo = req.body;

    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

    userInfo.password = hash;

    Users.add(userInfo)
        .then(user => {
            res.json(user);
        })
        .catch(err => res.send(err));
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(([user]) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = {
                    id: user.id, 
                    username: user.username
                };

                res.status(200).json({ message: `Come on in, ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Those credentials are no good...' });
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Couldn't find that user..." })
        })
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy( err => {
            if (err) {
                res.status(500).json({ message: "Guess you're stuck here, pal..." });
            } else {
                res.status(200).json({ message: "Come back soon!" });
            }
        });
    } else {
        res.status(200).json({ message: "Uhhh, do I know you?" });
    }
});

module.exports = router;