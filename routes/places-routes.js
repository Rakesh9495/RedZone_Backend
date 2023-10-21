const express = require("express");
const { check } = require("express-validator");

let multer = require("multer");
let formDataFilter = multer();

const startWorkPlace = require("../controllers/StartWork/places-Startwork-controllers");
const StartAllYtWorkPlace = require("../controllers/StartWork/FuntionsStartAllWork/places-StartAllYtwork-controllers");
const StartAllInstaWorkPlace = require("../controllers/StartWork/FuntionsStartAllWork/places-StartAllInstawork-controllers");
const placesControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  formDataFilter.fields([]),
  check("title").not().isEmpty(),
  check("userProfileUrl").not().isEmpty(),
  check("instagramUsername").not().isEmpty(),
  check("instagramPassword").not().isEmpty(),
  check("uploadCategory").not().isEmpty(),
  check("channelCategory").not().isEmpty(),
  placesControllers.createPlace
);

router.post("/startwork/:pid", startWorkPlace.StartWorkPlace);

router.post(
  "/startAllInstaWork/:uid",
  StartAllInstaWorkPlace.StartAllInstaWorkPlace
);
router.post(
  "/startAllYtWork/:uid",
  StartAllYtWorkPlace.StartAllYtWorkPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("userProfileUrl").not().isEmpty(),
    check("instagramUsername").not().isEmpty(),
    check("instagramPassword").not().isEmpty(),
    check("uploadCategory").not().isEmpty(),
    check("channelCategory").not().isEmpty(),
  ],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
