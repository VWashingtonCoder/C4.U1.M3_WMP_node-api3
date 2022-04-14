const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retieving users' })
    })
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  console.log(req.userName)
  Users.insert(req.userName)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'User could not be added' })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const id = req.user.id;
  const changes = req.userName;
  
  Users.update(id, changes)
    .then(updates => {
      res.status(200).json(updates);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "User could not be updated"});
    })
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const user = req.user
  
  Users.remove(user.id)
    .then(() => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ message: 'User could not be removed' })
    })
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "User posts could not be retrieved" })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const newPost = { text: req.post, user_id: req.user.id }

  Posts.insert(newPost)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "User post could not be added" })
    })
  
});

// do not forget to export the router
module.exports = router