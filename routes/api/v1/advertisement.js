'use strict';

const express = require('express');
const router = express.Router();
const advertisementController = require('../../../controllers/advertisementController');
const jwtAuth = require('../../../services/jwtAuth');
const uploadFile = require('../../../services/multerConfigure');

router.get('/', jwtAuth, advertisementController.getAllAdvertisements);
// router.get('/', advertisementController.getAllAdvertisements); //For test
router.get('/:advertisementId', advertisementController.getOneAdvertisement);
router.get('/tags/list', advertisementController.getAllTagsAdvertisements);
router.post(
  '/add',
  jwtAuth,
  uploadFile,
  advertisementController.createAdvertisement
);
router.put('/update', jwtAuth, advertisementController.updateAdvertisement);
router.delete('/delete', jwtAuth, advertisementController.deleteAdvertisement);

module.exports = router;
