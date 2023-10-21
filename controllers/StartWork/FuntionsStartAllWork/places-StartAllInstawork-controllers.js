const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../../../models/http-error");
const User = require("../../../models/user");

const StartWorkPlace = require("../places-Startwork-controllers");
const extractDataDB2 = require("./extractDataDb2");

const StartAllInstaWorkPlace = async (req, res, next) => {
  const creator = req.params.uid;
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  // const isCreatorPresent = users.some(
  //   (user) => String(user._id).trim() === String(creator).trim()
  // );
  // console.log(isCreatorPresent);
  // if (isCreatorPresent) {
  //   console.log("The creator is present in the users array.");
  // } else {
  //   console.log("The creator is not present in the users array.");
  // }

  const placeIds = await extractDataDB2.extractDataDB2(
    creator,
    "InstagramtoInstagram",
    next
  );

  if (placeIds.length === 0) {
    const error = new HttpError("placeIds 0 length, could not place.", 500);
    return next(error);
  }

  for (let runTime = 0; runTime < placeIds.length; runTime++) {
    console.log("RUN work :: " + runTime);
    await StartWorkPlace.StartWorkPlace(placeIds[runTime], res, next);
    console.log("RUN work end:: " + runTime);
  }
  console.log("the End ..... ");
  res.status(200).json({ message: "Work Done." });
};

exports.StartAllInstaWorkPlace = StartAllInstaWorkPlace;
