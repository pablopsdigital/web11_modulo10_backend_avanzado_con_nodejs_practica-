const { cookie } = require('express-validator');
const i18n = require('i18n');
var path = require('path');

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  autoReload: true,
  syncFiles: true,

  //Set and read user preferences with cookie
  cookie: 'nodepop-locale',
});

i18n.setLocale('en');

module.exports = i18n;
