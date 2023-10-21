const axios = require("axios");
const fs = require("fs");
const HttpError = require("../../../models/http-error");

const downloadReels = async (reelsURLfilters, uploadCategory, next) => {
  let REELDATA = [];
  let description;
  let pageName;
  let FixFile = reelsURLfilters.length;

  console.log("fixFile before youtube :: " + FixFile);
  if (uploadCategory == "InstagramtoYoutube") {
    FixFile = reelsURLfilters.length > 7 ? 7 : reelsURLfilters.length;
    console.log("fixFile after youtube :: " + FixFile);
  }

  for (let index = 0; index < FixFile; index++) {
    let url = reelsURLfilters[index];
    console.log("url :: " + url);

    const parts = url.split("/");
    const postID = `https://www.instagram.com/graphql/query/?query_hash=b3055c01b4b222b8a47dc12b090e4e64&variables={%22shortcode%22:%22${
      parts[parts.length - 2]
    }%22}`;

    let response;
    try {
      response = await axios.get(postID);
    } catch (error) {
      try {
        response = await axios.get(postID);
      } catch (error1) {
        const err = new HttpError("Failed axios.get in downloadReels", 500);
        return next(err);
      }
    }
    console.log("res :: "+response.data);
    try {
      if (
        response.data.data.shortcode_media.edge_media_to_caption.edges[0].node
          .text.length > 1
      ) {
        description =
          response.data.data.shortcode_media.edge_media_to_caption.edges[0].node
            .text;
      }
      if (response.data.data.shortcode_media.owner.username.length > 1) {
        pageName = response.data.data.shortcode_media.owner.username;
      }
    } catch (error) {
      try {
        if (
          response.data.data.shortcode_media.edge_media_to_caption.edges[0].node
            .text.length > 1
        ) {
          description =
            response.data.data.shortcode_media.edge_media_to_caption.edges[0]
              .node.text;
        }
        if (response.data.data.shortcode_media.owner.username.length > 1) {
          pageName = response.data.data.shortcode_media.owner.username;
        }
      } catch (error1) {}
    }

    console.log("description :: " + description);
    console.log("pageName :: " + pageName);
    console.log("in downloadreels 1");
    
    let videoResponse;
    console.log("run 1");
    try {
      
      console.log("run 2");
      
      videoResponse = await axios.get(
        response.data.data.shortcode_media.video_url,
        {
          responseType: "arraybuffer",
        }
      );
          console.log("run 3");
        } catch (error) {
          try {
        console.log("run 4");
        videoResponse = await axios.get(json[0].video[0].contentUrl, {
          responseType: "arraybuffer",
        });
        console.log("run 4");
      } catch (error1) {
        console.log("run 5");
        const err = new HttpError("Failed videoResponse in downloadReels", 500);
        return next(err);
      }
    }

    //  const fileName = `reel_${Date.now()}.mp4`;
    console.log("in downloadreels 2");

    try {
      // console.log("videoResponse.data :: "+videoResponse.data);
      fs.writeFileSync(`./Downloads/${index}.mp4`, videoResponse.data);
    } catch (error) {
      try {
        fs.writeFileSync(`./Downloads/${index}.mp4`, videoResponse.data);
      } catch (error1) {
        const err = new HttpError(
          "Failed writefile reels download in downloadReels",
          500
        );
        return next(err);
      }
    }
    REELDATA.push({
      fileName: `${index}.mp4`,
      description: description ? description : "",
      pageName: pageName ? pageName : "",
    });
    console.log(`Reel downloaded successfully: ${index}.mp4`);
  }
  return REELDATA;
};

exports.downloadReels = downloadReels;
