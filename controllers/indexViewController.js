"use strict";

const Advertisement = require("../models/Advertisement");
const advertisementController = require("./advertisementController");

//List advertisement
const getAllAdvertisementsInView = async (req, res, next) => {
  try {
    //Req data
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
      filter.name = new RegExp("^" + name.toLowerCase(), "i");
    }

    if (sale) {
      filter.sale = sale;
    }
    if (price) {
      const priceSplitted = price.split("-");

      //10-50  Price indluded between the two value
      if (priceSplitted[0] !== "" && priceSplitted[1] !== "") {
        // console.log(`Price between ${priceSplitted[0]} and ${priceSplitted[1]}`);

        filter.price = {
          $gte: priceSplitted[0],
          $lte: priceSplitted[1],
        };
      }

      //10- Price greater than value, excluding value
      if (priceSplitted[0] !== "" && priceSplitted[1] === "") {
        //console.log(`Price greater than ${priceSplitted[0]}`);

        filter.price = {
          $gt: priceSplitted[0],
        };
      }

      //-50 Price less than value, excluding value
      if (priceSplitted[0] === "" && priceSplitted[1] !== "") {
        //console.log(`Price less than ${priceSplitted[1]}`);

        filter.price = {
          $lte: priceSplitted[1],
        };
      }

      //50 Price equal to value
      if (priceSplitted[0] !== "" && priceSplitted[1] === undefined) {
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
    res.status(200).render("pages/index", {
      advertisementList: advertisementList,
    });
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while consulting the list of advertisements.",
    });
    next(err);
  }
};

module.exports = { getAllAdvertisementsInView };
