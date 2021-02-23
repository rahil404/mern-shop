// imports
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../models/User');


/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */

router.post('/create', (req, res) => {
  const {name, email, password} = req.body;

  // validation
  if (!name || !email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }

  // check is user exist
  User.findOne({ email })
    .then(user => {
      if (user) return res.status(400).json({msg: 'User already exist'});

      //if does not exist
      const newUser = new User({
        name,
        email,
        password
      });

      // create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                {id: user.id},
                process.env.JWT_KEY,
                (err, token) => {
                  if (err) throw err;

                  res.json({
                    token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      isAdmin: user.isAdmin
                    }
                  });
                }
                )

              
            });
        })
      })
    })
});

/**
 * @route   POST api/users
 * @desc    Auth user
 * @access  Public
 */

router.post('/login', (req, res) => {
  const {email, password} = req.body;

  // validation
  if (!email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }

  // check is user exist
  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({msg: 'User does not exist'});

      // password validation
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({msg: 'Invalid credentials'});

          jwt.sign(
                {id: user.id},
                process.env.JWT_KEY,
                (err, token) => {
                  if (err) throw err;

                  res.json({
                    token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email
                    }
                  });
                }
                )
        })


    })
    .catch((error) => {
      res.status(400).json({msg: 'User does not exist'});
    })
});

module.exports = router;