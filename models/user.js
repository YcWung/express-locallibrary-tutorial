var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true, min: 3, max: 32 },
  password: { type: String, required: true }
});

UserSchema.virtual('url').get(function () {
  return "/users/" + this._id;
});

module.exports = mongoose.model('User', UserSchema);