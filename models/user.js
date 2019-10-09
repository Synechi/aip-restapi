const mongoose = require("mongoose");
var crypto = require("crypto");

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  numPosts: {
    type: Number,
    required: true
  },
  hash: String,
  salt: String
});

//Method to salt and hash the password.

UserSchema.methods.setPassword = function(password) {
  //Create unique salt
  this.salt = crypto.randomBytes(16).toString("hex");
  //Hashing salt and pword with 1000 itr
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

//Method to check if password is valid

UserSchema.methods.validPassword = function(password) {
  //Hashing password with found user's salt
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  //Checking if stored hashed password matches provided hashed password
  return this.hash == hash;
};

const User = (module.exports = mongoose.model("User", UserSchema));
