const HttpError = require("../../../models/http-error");

const Place = require("../../../models/place");

let place;

const saveInDataBase = async (
  savedata,
  placeId,
  Cookie,
  RESCheack,
  RES,
  NEXT
) => {
  console.log("inside run savedata :: " + savedata);
  console.log("inside run placeId :: " + placeId);
  console.log("inside run Cookie :: " + Cookie);
  try {
    console.log("inside run try");
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, can't find reelsurlfilter.",
      500
    );
    return NEXT(error);
  }

  console.log("inside run savedata");
  try {
    console.log("inside place section");
    const expirationDate = place.btnTime;
    const tokenExpirationDate = 
      expirationDate.lenght > 1 ||
      new Date(new Date().getTime() + 9000 * 60 * 60);
    place.btnTime = tokenExpirationDate.toString();
    place.btnStatus = true;
    place.reelsUrlFilter = savedata.toString();
    place.cookies = Cookie.toString();
    console.log("done place section");
  } catch (erro) {
    const error = new HttpError(
      "Something went wrong, error place section",
      500
    );
    return NEXT(error);
  }
  
  try {
    await place.save();
    console.log(" save done :: "+RESCheack);
    if (RESCheack) {
      return RES.status(200).json({ place: place.toObject({ getters: true }) });
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not savedata.",
      500
    );
    return NEXT(error);
  }
};

exports.saveInDataBase = saveInDataBase;
