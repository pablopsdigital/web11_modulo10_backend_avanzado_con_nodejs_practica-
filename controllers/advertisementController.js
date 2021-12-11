'use strict';

const Advertisement = require('../models/Advertisement');
const { Requester } = require('cote');

//List advertisement
const getAllAdvertisements = async (req, res, next) => {
  try {
    const name = req.query.name;
    const sale = req.query.sale;
    const price = req.query.price;
    const tags = req.query.tags;

    const select = req.query.select;
    const sort = req.query.sort;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const filter = {};

    if (name) {
      filter.name = new RegExp('^' + name.toLowerCase(), 'i');
    }

    if (sale) {
      filter.sale = sale;
    }

    if (price) {
      const priceSplitted = price.split('-');

      //10-50  Price indluded between the two value
      if (priceSplitted[0] !== '' && priceSplitted[1] !== '') {
        // console.log(`Price between ${priceSplitted[0]} and ${priceSplitted[1]}`);

        filter.price = {
          $gte: priceSplitted[0],
          $lte: priceSplitted[1],
        };
      }

      //10- Price greater than value, excluding value
      if (priceSplitted[0] !== '' && priceSplitted[1] === '') {
        //console.log(`Price greater than ${priceSplitted[0]}`);

        filter.price = {
          $gt: priceSplitted[0],
        };
      }

      //-50 Price less than value, excluding value
      if (priceSplitted[0] === '' && priceSplitted[1] !== '') {
        //console.log(`Price less than ${priceSplitted[1]}`);

        filter.price = {
          $lte: priceSplitted[1],
        };
      }

      //50 Price equal to value
      if (priceSplitted[0] !== '' && priceSplitted[1] === undefined) {
        //console.log(`Price is equal to ${priceSplitted[1]}`);

        filter.price = {
          $eq: priceSplitted[0],
        };
      }
    }

    if (tags) {
      filter.tags = { $all: tags };
    }

    const advertisementList = await Advertisement.findList(
      filter,
      skip,
      limit,
      select,
      sort
    );
    res.status(200).json({ results: advertisementList });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while consulting the list of advertisements.',
    });
    next(err);
  }
};

//Query a advertisement for id whit get
const getOneAdvertisement = async (req, res, next) => {
  try {
    const _id = req.params.advertisementId;
    const resultQuery = await Advertisement.findOne({ _id });

    if (!resultQuery) {
      res.status(404).json({
        error: `The record with id: ${_id} does not exist`,
      });
      return;
    }
    res.status(200).json({ result: resultQuery });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while viewing the advertisement.',
    });
    next(err);
  }
};

//List tags all advertisement
const getAllTagsAdvertisements = async (req, res, next) => {
  try {
    const advertisementList = await Advertisement.find();

    let finalList = await [
      //Delete duplicates array tags
      ...new Set(
        //Return only the tags from each object
        advertisementList.flatMap(function (advertisement) {
          return advertisement.tags;
        })
      ),
    ];

    res.status(200).json({ results: finalList });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while trying to display the list of tags.',
    });
    next(err);
  }
};

//Add a advertisement
const createAdvertisement = async (req, res, next) => {
  try {
    var advertisementData = req.body;
    var image = req.file.filename;

    //Save in database new advertisemnt
    advertisementData = {
      name: req.body.name,
      sale: req.body.sale,
      price: req.body.price,
      tags: req.body.tags,
      photo: '' + `./images/thumbnails/${image}`,
    };
    console.log('Datos: ', advertisementData);

    var advertisementCreated = await new Advertisement(
      advertisementData
    ).save();

    res.status(201).json({ result: advertisementCreated });

    //Call to microservice
    const requester = new Requester({ name: 'publisherThumbnailMicroservice' });

    //Send data to microservice
    requester.send(
      {
        type: 'createThumbnail',
        file: image,
        height: '100',
        width: '100',
      },
      (resultado) => {
        console.log('Result Create Thumbnail:', resultado);
      }
    );
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while creating the advertisement.',
    });
    next(err);
  }
};

//Update advertisement
const updateAdvertisement = async (req, res, next) => {
  try {
    const _id = req.body._id;
    const advertisementData = req.body;
    const resultQuery = await Advertisement.findOneAndUpdate(
      { _id },
      advertisementData,
      { new: true }
    );

    if (!resultQuery) {
      res.status(404).json({
        error: `The record with id: ${_id} does not exist`,
      });
      return;
    }

    res.status(200).json({ result: resultQuery });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while updating the advertisement.',
    });
    next(err);
  }
};

//Remove advertisement
const deleteAdvertisement = async (req, res, next) => {
  try {
    const _id = req.body._id;
    const resultQuery = await Advertisement.findByIdAndDelete({ _id });

    if (!resultQuery) {
      res.status(404).json({
        error: `The record with id: ${_id} does not exist`,
      });
      return;
    }
    res.status(200).json({ result: resultQuery });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while the advertisement was being removed.',
    });
    next(err);
  }
};

module.exports = {
  getAllAdvertisements,
  getOneAdvertisement,
  getAllTagsAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
};
