const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');
const secretKey = require('../../config/keys');
const validResgistraion = require('../../validator/registration');
const validLogin = require('../../validator/login');

const router = express.Router();

router.get('/test', (req, res) => res.json({ meassge: 'users route ' }));

// @route   api.users/register
// @desc    Register User
// @access  Public

router.post('/register', (req, res) => {
    const { isVaild, errors } = validResgistraion(req.body);

    if (!isVaild) {
        return res.json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'Email ALready Exist';
                return res.json(errors);
            }
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: '404',
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    // Save new User
                    newUser
                        .save()
                        .then(newuser => res.json(newuser))
                        .catch(err => console.log(err));
                });
            });
        })
        .catch(err => res.json({ meassge: 'Please Try Again' }));
});

// @route   api.users/login
// @desc    Login User // Created JSON WEB TOKEN
// @access  Public

router.post('/login', (req, res) => {
    const { isVaild, errors } = validLogin(req.body);
    if (!isVaild) {
        return res.json(errors);
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                errors.email = 'Email is not Exist!';
                res.json(errors);
            } else {
                bcrypt.compare(req.body.password, user.password).then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.email,
                            avatar: user.avatar,
                        };
                        jwt.sign(payload, secretKey.key, { expiresIn: '24h' }, (err, token) => {
                            res.json({
                                succes: true,
                                token: `Bearer ${token}`,
                            });
                        });
                    } else {
                        errors.password = 'Invald Password';
                        res.json(errors);
                    }
                });
            }
        })
        .catch(err => console.log(err));
});

// @route   api.users/current
// @desc    GEt Current User
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});
module.exports = router;
