/* eslint-disable no-shadow */
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const profileValidation = require('../../validator/profile');
const experienceValidation = require('../../validator/experience');
const educationValid = require('../../validator/educations');

const router = express.Router();

router.get('/test', (req, res) => res.json({ meassge: 'Profile route ' }));

// @route    GET  api/profile
// @desc     Current User Profile
// @acess     Private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'email', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => console.log(err));
});

// @route       GET  api/profile/handle/:handler
// @desc        GEta a profile with handler
// @acess       Public

router.get('/handle/:handler', (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handler })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.profile = 'There is no profile';
                res.json(errors);
            } else {
                res.json(profile);
            }
        })
        .catch(err => {
            errors.profile = 'There is no profile';
            res.json(errors);
        });
});
// @route       GET  api/profile/user/:id
// @desc        GET a profile with user id
// @acess       Public

router.get('/user/:id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.profile = 'There is no profile';
                res.json(errors);
            } else {
                res.json(profile);
            }
        })
        .catch(err => {
            errors.profile = 'There is no profile';
            res.json(errors);
        });
});

// @route       GET  api/all
// @desc        Get all user profile
// @acess       Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.profile = 'There are no profile';
                res.json(errors);
            } else {
                res.json(profile);
            }
        })
        .catch(err => {
            errors.profile = 'There is no profile';
            res.json(errors);
        });
});

// @route       POST  api/profile
// @desc        Create or Update User Profile
// @acess       Protected

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = profileValidation(req.body);
    if (!isValid) {
        return res.json(errors);
    }
    const profileField = {};
    profileField.user = req.user.id;
    if (req.body.handle) profileField.handle = req.body.handle;
    if (req.body.company) profileField.company = req.body.company;
    if (req.body.website) profileField.website = req.body.website;
    if (req.body.location) profileField.location = req.body.location;
    if (req.body.status) profileField.status = req.body.status;
    if (req.body.bio) profileField.bio = req.body.bio;
    if (req.body.githubusername) profileField.githubusername = req.body.githubusername;
    // skill
    if (typeof req.body.skills !== 'undefined') {
        profileField.skills = req.body.skills.split(',');
    }
    profileField.social = {};
    if (req.body.youtube) profileField.social.youtube = req.body.youtube;
    if (req.body.twitter) profileField.social.twitter = req.body.twitter;
    if (req.body.facebook) profileField.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileField.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileField.social.instagram = req.body.instagram;

    // Save or update Profile

    Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileField }, { new: true }).then(profile =>
                res.json(profile)
            );
        } else {
            Profile.findOne({
                handle: profileField.handle,
            }).then(profile => {
                if (profile) {
                    errors.handle = 'The handle Already Exist!';
                    res.status(400).json(errors);
                } else {
                    // Save Profile
                    new Profile(profileField).save().then(profile => res.json(profile));
                }
            });
        }
    });
});

// @route       POST  api/profile/experience
// @desc        Create or Update User Profile
// @acess       Protected

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { isVaild, errors } = experienceValidation(req.body);
    if (!isVaild) {
        return res.json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                tittle: req.body.tittle,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            };
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => {});
});

// @route       DELETE  api/profile/experience/exp_id
// @desc        delete  experience
// @acess       Protected

router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // get delte experience index
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
            // splice remove experience
            profile.experience.splice(removeIndex, 1);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => {
            res.json({ meassge: 'There is no profile!' });
        });
});

// @route       POST  api/profile/education
// @desc        Create or Update User Profile
// @acess       Protected

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { isVaild, errors } = educationValid(req.body);
    if (!isVaild) {
        return res.json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            };
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.json(err));
});

// @route       DELETE  api/profile/education/edu_id
// @desc        delete  experience
// @acess       Protected

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // get delte experience index
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id);
            // splice remove experience
            profile.education.splice(removeIndex, 1);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.json(err));
});

// @route       DELETE  api/profile
// @desc        delete  profile and user
// @acess       Protected

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ succes: true }));
        })
        .catch(err => res.json(err));
});
module.exports = router;
