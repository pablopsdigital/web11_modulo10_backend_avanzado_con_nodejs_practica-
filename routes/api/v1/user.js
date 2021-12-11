'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');

router.post('/authenticate', userController.authJWT);

module.exports = router;
