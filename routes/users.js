const userRouter = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:userId', getUser);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
