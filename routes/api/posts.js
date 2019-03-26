const express = require('express');
const passport = require('passport');
const Post = require('../../models/Post');
const postValidation = require('../../validator/post');
const Profile = require('../../models/Profile');

const router = express.Router();

// @route      GET api/posts
// @desc       Get All Posts
// @access     public
router.get('/', (req, res) => [
    Post.find()
        .sort({ date: -1 })
        .then(post => res.json(post))
        .catch(err => res.json({ meassge: 'No Post found' })),
]);

// @route      GET api/posts/:id
// @desc       Get a Single Post
// @access     Public
router.get('/:id', (req, res) => [
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.json({ meassge: 'No Post found' })),
]);

// @route       delete api/posts/:id
// @desc        delte a single post
// @acess       Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                // Check User
                console.log(post);
                if (post.user.toString() !== req.user.id) {
                    return res.status(401).json({ unauthorized: 'Uuser not authorized' });
                }
                // Delete psot
                post.remove().then(() => res.json({ success: true }));
            })
            .catch(() => res.json({ post: 'Post not found' }));
    });
});

// @route      POST api/posts
// @desc        Create Post
// @access      Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { isVaild, errors } = postValidation(req.body);
    if (!isVaild) {
        return res.json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    });

    newPost
        .save()
        .then(post => res.json(post))
        .catch(err => res.json(err));
});

// @route      POST api/posts/like/:id
// @desc        Like Post
// @access      Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.json({ meassge: 'Already Liked' });
                }
                // add use likes arry
                post.likes.unshift({ user: req.user.id });
                post.save().then(post => res.json(post));
            })
            .catch(() =>
                res.json({
                    post: 'Post not found',
                })
            );
    });
});
// @route      POST api/posts/unlike/:id
// @desc       Unlike Post
// @access     Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                    return res.json({ meassge: 'You are not yet to like!' });
                }
                // add use likes arry
                const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
                post.likes.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
            })
            .catch(() =>
                res.json({
                    post: 'Post not found',
                })
            );
    });
});


// @route      POST api/posts/comment/:id
// @desc        Create a comment 
// @access      Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { isVaild, errors } = postValidation(req.body);
    if (!isVaild) {
        return res.json(errors);
    }
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
            };
            // add to comment array
           post.comments.unshift(newComment);
            //  save comment
            post.save().then(post => res.json(post))
        })
        .catch(err => res.json({ meassge: 'There are no posts!' }));
});
// @route      delete  api/posts/comment/:id/:comment_id
// @desc        Like Post
// @access      Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length ===0) {
                return res.json({ meassge: 'Comment does not exist!' })
            }
            // Get remove index
            const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id);
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post))
        })
        .catch(err => res.json({ meassge: 'No post found' } ));
});

module.exports = router;
