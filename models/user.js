const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AUTHORIZATION_ERROR = require('../errors/AuthorizationError');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив Кусто',
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    validate: {
      validator: (avatar) => validator.isURL(avatar),
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
  },
  email: {
    validate: {
      validator: (email) => validator.isEmail(email),
    },
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
function deletePasswordFromUser() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AUTHORIZATION_ERROR('Wrong email or password');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AUTHORIZATION_ERROR('Wrong email or password');
        }
        return user; // теперь user доступен
      });
    });
};
userSchema.methods.deletePasswordFromUser = deletePasswordFromUser;

module.exports = mongoose.model('user', userSchema);
