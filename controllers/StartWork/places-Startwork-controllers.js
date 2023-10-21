const fs = require("fs");
const HttpError = require("../../models/http-error");

const userPageReelsFind = require("./FuntionsStartWork/userPageReelsFind");
const downloadReels = require("./FuntionsStartWork/downloadReels");
const readDownloadsReels = require("./FuntionsStartWork/readDownloadsReels");
const uploadInInstagram = require("./FuntionsStartWork/uploadInInstagram");
const uploadInYoutube = require("./FuntionsStartWork/uploadInYoutube");
const reelsURLfilter = require("./FuntionsStartWork/reelsURLfilter");

const extractDataDB = require("./FuntionsStartWork/extractDataDB");

const INSTAGRAM_Url = "https://www.instagram.com/";
const UPLOAD_FILE_DIRECTORY = "./Downloads/";

const StartWorkPlace = async (REQ, RES, NEXT) => {
  let placeId = null;
  let RESCheack = true;
  try {
    placeId = REQ.params.pid;
  } catch (error) {
    placeId = REQ;
    RESCheack = false;
  }

  console.log("placeId testtest :: ", placeId);
  let Cookie = "";
  const [
    reelsUrlData,
    userProfileUrl,
    instagramUsername,
    instagramPassword,
    instagramCaption,
    reelsDownloadedDelete,
    uploadCategory,
    channelCategory,
    cookies,
  ] = await extractDataDB.extractDataDB(placeId);

  console.log("extractDataDb done");

  if (1) {
    try {
      fs.readdirSync(UPLOAD_FILE_DIRECTORY).forEach((f) =>
        fs.rmSync(`${UPLOAD_FILE_DIRECTORY}/${f}`)
      );
    } catch (error) {
      const err = new HttpError("Failed Not delete download folder reels", 500);
      return NEXT(err);
    }
  }
  console.log("Remove reels done");

  const userPageReelsUrls = await userPageReelsFind.userPageReelsFind(
    userProfileUrl,
    NEXT
  );
  console.log("userpagereelsfind done");

  if (!userPageReelsUrls) {
    const error = new HttpError(
      "Could not find PageReels for the provided URL.",
      500
    );
    return NEXT(error);
  }
  const [reelsURLfilters, savedata] = await reelsURLfilter.reelsURLfilter(
    userPageReelsUrls,
    reelsUrlData
  );
  console.log("reelsurlfilter done");

  console.log(
    "reelsURlFilter :: " + reelsURLfilters + " legnt " + reelsURLfilters.length
  );
  console.log("savedata :: " + savedata + " legnt " + reelsURLfilters.length);
  if (!reelsURLfilters) {
    const error = new HttpError(
      "--->   Could not find New Reels for the provided URL. In reelsUrlFilters  <---",
      500
    );
    return NEXT(error);
  }

  let REELDATA;
  try {
    REELDATA = await downloadReels.downloadReels(
      reelsURLfilters,
      uploadCategory,
      NEXT
    );
  } catch (err) {
    const error = new HttpError("Could not Download reels. " + err, 500);
    return NEXT(error);
  }

  console.log("downloadreels done");

  let files = null;
  files = await readDownloadsReels.readDownloadsReels();

  console.log("readdownloadreels done :: " + files);
  console.log("files length :: " + files.length);
  if (files.length > 1) {
    const error = new HttpError(
      "Could not find ReadDownloadReels. Download Folder not found reels. file length",
      500
    );
    return NEXT(error);
  }
  console.log("files length done :: " + files.length);

  console.log("cheack which open run insta ya youtube");
  if (uploadCategory == "InstagramtoInstagram") {
    try {
      await uploadInInstagram.uploadInInstagram(
        INSTAGRAM_Url,
        files,
        instagramUsername,
        instagramPassword,
        instagramCaption,
        REELDATA,
        UPLOAD_FILE_DIRECTORY,
        channelCategory,
        cookies,                 
        savedata,
        placeId,
        RESCheack,
        RES,
        NEXT
      );
    } catch (err) {
      const error = new HttpError("Could not Upload in Instagram." + err, 500);
      return NEXT(error);
    }
  }
  console.log("Run Youtube section");
  if (uploadCategory == "InstagramtoYoutube") {
    try {
      await uploadInYoutube.uploadInYoutube(
        INSTAGRAM_Url,
        files,
        instagramUsername,
        instagramPassword,
        instagramCaption,
        REELDATA,
        UPLOAD_FILE_DIRECTORY,
        channelCategory,
        cookies,                 
        savedata,
        placeId,
        RESCheack,
        RES,
        NEXT
      );
    } catch (err) {
      const error = new HttpError("Could not Upload in youtube." + err, 500);
      return NEXT(error);
    }
  }
  console.log("all done");
};

exports.StartWorkPlace = StartWorkPlace;
