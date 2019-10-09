var express = require("express");
var router = express.Router();

//User Schema
const User = require("../models/user");

//User Login Endpoint
router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (user === null) {
      return res.status(201).send({
        message: "No matching user.",
        success: false
      });
    } else {
      if (user.validPassword(req.body.password)) {
        return res.status(201).send({
          message: "User Logged In.",
          success: true
        });
      } else {
        return res.status(201).send({
          message: "Invalid Password",
          success: false
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
  newAccount.numPosts = 0;
  newAccount.setPassword(req.body.password);
  newAccount.accountType = 0;
  User.findOne({ username: req.body.username }, function (err, user) {
    if (user === null) {
      newAccount.save((err, User) => {
        if (err) {
          return res.status(201).send({
            message: "Failed to add user",
            success: false
          });
        } else {
          return res.status(201).send({
            message: "User added",
            success: true
          });
        }
      })
    } else {
      return res.status(201).send({
        message: "Username Already Exits",
        success: false
      });
    }
  }
  );
});

router.get("/get-all-users", (req, res) => {
  User.find({}, function (err, users) {
    if (users === null) {
      return res.status(201).send({
        message: "There are no users",
        success: false
      });
    } else {
      return res.json(users);
    }
  });
});


module.exports = router;
