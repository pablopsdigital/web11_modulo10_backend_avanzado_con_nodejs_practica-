'use strict';

const { Responder } = require('cote');
var Jimp = require('jimp');
const sharp = require('sharp');
var path = require('path');

//Microservice for create thumbnail
const responder = new Responder({ name: 'responseThumbnailMicroservice' });

//Save data service

//Taks microservice
responder.on('createThumbnail', (req, done) => {
  const { type, file, height, width } = req;
  console.log(
    `Inside ${type} microservice with request: ${JSON.stringify(
      req,
      null,
      '\t'
    )}`
  );
  resizeJimp(file, parseInt(height), parseInt(width));
  //resizeSharp(file, parseInt(height), parseInt(width));
  done('finished');
});

//==============================================================
//Example whit Jimp.js library
//==============================================================
async function resizeJimp(file, width = 100, height = 100) {
  try {
    // Read original image
    const thumbnail = await Jimp.read(
      `../public/images/advertisements/${file}`
    );
    // Resize image
    await thumbnail.resize(width, height);
    // Save resize image
    await thumbnail.write(`../public/images/thumbnails/${file}`);
  } catch (err) {
    console.log('Error', err);
  }
}

//==============================================================
//Example whit Sharp.js library
//==============================================================
async function resizeSharp(file, width = 100, height = 100) {
  // Read original image
  const resultado = sharp(`../public/images/advertisements/${file}`)
    // Resize image
    .resize(width, height)
    // Save resize image
    .toFile(`../public/images/thumbnails/${file}`, (err, info) => {
      console.log('Error: ', err);
      console.log('Info', info);
    });
}
