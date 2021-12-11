'use strict';

const { __ } = require('i18n');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Post api login
 * */
const authJWT = async (req, res, next) => {
  try {
    //Read send body params
    const email = req.body.email;
    const password = req.body.password;

    //Find user in database for email
    const user = await User.findOne({ email });

    //Check user and password
    if (!user || !(await user.comparePassword(password))) {
      res.json({ error: __('Invalid credentials') });
      return;
    }

    //If user is correct create a JWT
    jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
      (err, jwToken) => {
        if (err) {
          next(err);
          return;
        }

        //Return token
        res.json({ token: jwToken });
      }
    );
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred.',
    });
    next(err);
  }
};

module.exports = { authJWT };
