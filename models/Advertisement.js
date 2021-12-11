"use strict";

//Import mongoose module
const mongoose = require("mongoose");

//Definition the schema of advertisement
const advertisementSchema = mongoose.Schema(
  {
    name: { type: String, maxLength: 100, required: true, index: true },
    sale: { type: Boolean, required: true, index: true },
    price: { type: Number, required: true },
    photo: {
      type: String,
      maxLength: 500,
      default: "no-picture.png",
    },
    tags: {
      type: [String],
      enum: ["uncategorized", "work", "lifestyle", "motor", "mobile"],
      required: [true, "Tag required"],
      default: ["uncategorized"],
    },
  },
  { timestamps: true }
);

// //Create filters
advertisementSchema.statics.findList = function (
  filter,
  skip,
  limit,
  select,
  sort
) {
  const query = Advertisement.find(filter);
  query.skip(skip);
  query.limit(limit);
  query.select(select);
  query.sort(sort);
  return query.exec();
};

// Create the model
const Advertisement = mongoose.model("Advertisement", advertisementSchema);

// Export model
module.exports = Advertisement;
