// imports
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
// User Model
const User = require('../models/User');


/**
 * @route   POST api/auth
 * @desc    Auth user
 * @access  Public
 */

router.post('/', (req, res) => {
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
                      email: user.email,
                      isAdmin: user.isAdmin
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


/**
 * @route   GET api/auth/user
 * @desc    GET user data
 * @access  Private
 */

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw Error('User does not exist');
    res.json({'id': user._id,'name': user.name, 'email': user.email, 'isAdmin': user.isAdmin});
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});



router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = await req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = await jwt.verify(token, process.env.JWT_KEY);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});


module.exports = router;