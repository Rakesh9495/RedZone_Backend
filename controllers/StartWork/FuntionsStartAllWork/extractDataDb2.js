const HttpError = require("../../../models/http-error");

const Place = require("../../../models/place");

const extractDataDB2 = async (creator, work, next) => {
  let place;
  let filteredIds;
  try {
    place = await Place.find({ creator });
    filteredIds = place
      .filter((item) => item.uploadCategory === work)
      .map((item) => item._id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  return filteredIds;
};

exports.extractDataDB2 = extractDataDB2;
