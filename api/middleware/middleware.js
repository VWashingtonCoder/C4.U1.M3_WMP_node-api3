const Users = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url}` 
  );
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  Users.getById(req.params.id)
    .then(user => {
      if(user){
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retieving userId' });
    })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.name){
    res.status(400).json({ message: "missing required name field" });
    return;
  };
  
  req.userName = { name: req.body.name.trim() };
  next();
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.text){
    res.status(400).json({ message: "missing required text field" });
    return;
  };

  req.post = req.body.text.trim();
  next();
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost 
}