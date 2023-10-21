const HttpError = require("../../../models/http-error");

const Place = require("../../../models/place");

const extractDataDB = async (placeId, next) => {
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  const reelsUrlData = await place.reelsUrlFilter;
  const userProfileUrl = await place.userProfileUrl;
  const instagramUsername = await place.instagramUsername;
  const instagramPassword = await place.instagramPassword;
  const instagramCaption = await place.instagramCaption;
  const reelsDownloadedDelete = await place.reelsDownloadedDelete;
  const uploadCategory = await place.uploadCategory;
  const channelCategory = await place.channelCategory;
  const cookies = await place.cookies;

  return [
    reelsUrlData,
    userProfileUrl,
    instagramUsername,
    instagramPassword,
    instagramCaption,
    reelsDownloadedDelete,
    uploadCategory,
    channelCategory,
    cookies
  ];
};

exports.extractDataDB = extractDataDB;
