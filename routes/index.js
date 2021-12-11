"use strict";
const express = require("express");
const router = express.Router();
const indexViewController = require("../controllers/indexViewController");

router.get("/", indexViewController.getAllAdvertisementsInView);

module.exports = router;
