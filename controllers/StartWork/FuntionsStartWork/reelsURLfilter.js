const reelsURLfilter = async (userPageReelsUrls, reelsUrlData) => {
  console.log("userPageReelsUrls :: " + userPageReelsUrls);
  console.log("reelsUrlData :: " + reelsUrlData);
  if (reelsUrlData && reelsUrlData.length > 6) {
    const urls1 = reelsUrlData.toString().split(",");
    const urls2 = userPageReelsUrls.toString().split(",");

    const uniqueURLs1 = new Set(urls1);
    const uniqueInData = urls2.filter((url) => !uniqueURLs1.has(url));

    if (urls1.length >= uniqueInData.length) {
      urls1.splice(-uniqueInData.length);
    }

    if (!uniqueInData.length) {
      return ["", ""];
    }
    const result = urls1.join(",");
    let result2 = uniqueInData + "," + result;
    console.log("inside uniqueInData if :: " + uniqueInData);
    console.log("inside result2 :: " + result2);
    return [uniqueInData, result2];
  } else {
    console.log("inside uniqueInData else :: " + userPageReelsUrls);
    return [userPageReelsUrls, userPageReelsUrls];
  }
};

exports.reelsURLfilter = reelsURLfilter;
