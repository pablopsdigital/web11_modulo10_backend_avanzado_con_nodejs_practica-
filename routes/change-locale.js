'use strict';
const express = require('express');
const router = express.Router();

//Change locale
router.get('/:locale', (req, res, next) => {
  const locale = req.params.locale;

  //Set cookie
  res.cookie('nodepop-locale', locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30, //One month
  });

  //Redirect
  res.redirect(req.get('referer'));
});

module.exports = router;
