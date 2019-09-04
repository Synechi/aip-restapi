var express = require("express");
var router = express.Router();

//User Schema
const User = require("../models/user");

//User Login Endpoint
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (user === null) {
      return res.status(400).send({
        message: "Not matching user."
      });
    } else {
      if (user.validPassword(req.body.password)) {
        return res.status(201).send({
          message: "User Logged In."
        });
      } else {
        return res.status(400).send({
          message: "Invalid Password"
        });
      }
    }
  });
});

//User Signup Endpoint

router.post("/signup", (req, res, next) => {
  let newAccount = new User();
  newAccount.username = req.body.username;
  newAccount.email = req.body.email;
  newAccount.setPassword(req.body.password);
  newAccount.save((err, User) => {
    if (err) {
      return res.status(400).send({
        message: "Failed to add user"
      });
    } else {
      return res.status(201).send({
        message: "User added"
      });
    }
  });
});

module.exports = router;
