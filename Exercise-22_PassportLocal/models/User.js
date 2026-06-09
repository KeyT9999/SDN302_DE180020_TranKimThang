const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const userSchema = new Schema({
  fullname: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  }
});

// Plugin này tự thêm username, hash, salt
// và các method như register(), authenticate(), serializeUser(), deserializeUser()
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
