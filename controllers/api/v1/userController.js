const User = require('../../../modals/User');

const jwt = require('jsonwebtoken');

const fs = require('fs');

const path = require('path');

module.exports.login = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: 'Invalid Username or password',
      });
    }
    let filterUser = await User.findOne({ email: req.body.email })
      .select('-password')
      .select('-__v');
    return res.status(200).json({
      message: 'Sign In successful',
      data: {
        token: jwt.sign(filterUser.toJSON(), 'something', {
          expiresIn: '1000000',
        }),
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.create = async function (req, res) {
  try {
    let imageCorrection = 'http://localhost:8000';
    User.uploadedAvatar(req, res, async function (err) {
      if (err) {
        console.log('Multer Error', err);
        res.status(500).json({ message: 'Error Uploading Image' });
      }
      if (req.body.password != req.body.confirm_password) {
        return res
          .status(403)
          .json({ message: 'Password and Confirm Password does not match' });
      }
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        let newUser = await User.create(req.body);
        if (newUser) {
          if (req.file) {
            if (newUser.avatar) {
              let avatarPath = newUser.avatar.substr(21);
              if (
                fs.existsSync(path.join(__dirname, '../../../', avatarPath))
              ) {
                fs.unlinkSync(path.join(__dirname, '../../../', avatarPath));
                console.log('file removed');
              }
            }

            console.log(req.file);
            //this is saving the path of the uploaded file into the avatar field of the user
            newUser.avatar =
              imageCorrection + User.AvatarPath + '/' + req.file.filename;
          }
          newUser.save();
          let filterUser = await User.findOne({ email: req.body.email })
            .select('-password')
            .select('-__v');
          return res.status(200).json({
            message: 'Sign In successful',
            data: {
              token: jwt.sign(filterUser.toJSON(), 'something', {
                expiresIn: '1000000',
              }),
            },
          });
        } else {
          return res.status(500).json({
            message: 'User not registered',
          });
        }
      } else {
        return res.status(403).json({ message: 'Username Exists' });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.update = async function (req, res) {
  try {
    let imageCorrection = 'http://localhost:8000';
    User.uploadedAvatar(req, res, async function (err) {
      if (err) {
        console.log('Multer Error', err);
        res.status(500).json({ message: 'Error Uploading Image' });
      }
      if (req.user._id == req.params.id) {
        let user = await User.findById(req.user._id);
        if (user) {
          if (req.body.newPassword != 'undefined') {
            if (req.body.oldPassword == user.password) {
              if (req.body.newPassword == req.body.confirmNewPassword) {
                user.password = req.body.newPassword;
              } else {
                return res.status(403).json({
                  message: 'New Password and Confirm Password do not match',
                });
              }
            } else {
              return res.status(401).json({ message: 'Wrong Password' });
            }
          }

          user.username = req.body.username;
          user.bio = req.body.bio;
          if (req.file) {
            if (user.avatar) {
              let avatarPath = user.avatar.substr(21);
              if (
                fs.existsSync(path.join(__dirname, '../../../', avatarPath))
              ) {
                fs.unlinkSync(path.join(__dirname, '../../../', avatarPath));
              }
            }

            console.log(req.file);
            //this is saving the path of the uploaded file into the avatar field of the user
            user.avatar =
              imageCorrection + User.AvatarPath + '/' + req.file.filename;
          }
          user.save();
          return res
            .status(200)
            .json({ message: 'Credentials Successfully Updated' });
        }
        return res.status(404).json({ message: 'User Not Found' });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
