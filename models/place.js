const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  userProfileUrl: { type: String, required: true },
  instagramUsername: { type: String, required: true },
  instagramPassword: { type: String, required: true },
  uploadCategory: { type: String, required: true },
  channelCategory: { type: String, required: true },
  cookies: { type: String, default: "" },
  reelsUrlFilter: { type: String, default: "" },
  instagramCaption: { type: String, default: "" },
  reelsDownloadedDelete: { type: String, default: "" },
  btnTime: { type: String, default: "" },
  btnStatus: { type: Boolean, default: false },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
