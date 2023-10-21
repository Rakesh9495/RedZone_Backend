const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const buff = Buffer.alloc(100);
const header = Buffer.from("mvhd");
const HttpError = require("../../../models/http-error");
const saveInDataBase = require("../FuntionsStartWork/saveInDataBase");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const listUserAgent = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
];


const uploadInInstagram = async (
  instagram_url,
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
  next
) => {
  let Cookie = "";
  const browser_1 = await puppeteer.launch({
    headless: "new",
    // executablePath: "./Browers/BraveBrower/brave",
    executablePath: "./Browers/Chrome/chrome",
  });
  const page_1 = await browser_1.newPage();

  const randomIndex = Math.floor(Math.random() * listUserAgent.length);
  const randomUserAgent = listUserAgent[randomIndex];
  console.log(randomUserAgent);
  await page_1.setUserAgent(randomUserAgent);
  await page_1.setViewport({ width: 1366, height: 768 });
  const cookieJSON = cookies ? JSON.parse(cookies) : "";
  console.log("cookie json :: " + cookieJSON);
  let cookieJsonCheack = cookies ? cookieJSON[1].expires : null;
  try {
    console.log("set cookies");
    // 7-9-2023 time : 7:30PM 20 days run
    for (let i = 0; i < cookieJSON.length; i++) {
      await page_1.setCookie(cookieJSON[i]);
    }
  } catch (error) {
    console.log("error in set cookies");
  }

  console.log("goto instagram page");
  try {
    await page_1.goto(instagram_url);
  } catch (error) {
    try {
      await page_1.goto("https://www.instagram.com/");
    } catch (err) {
      await page_1.close();
      await browser_1.close();
      const error = new HttpError("Failed goto instagram url" + err, 500);
      return next(error);
    }
  }

  try {
    let ccookies = await page_1.cookies();
    let currentDate = new Date();
    let sessionidcheck = true;
    for (const ccookie of ccookies) {
      const expirationDate = new Date(ccookie.expires * 1000);

      if (ccookie.name == "sessionid") {
        sessionidcheck = false;
      }
      if (expirationDate < currentDate) {
        console.log(`Cookie '${ccookie.name}' has expired.`);
        if (ccookie.name == "sessionid" || ccookie.name == "csrftoken") {
          console.log("inside if sessionid csrftoken ");
          cookieJsonCheack = false;
        }
      } else {
        console.log(`Cookie '${ccookie.name}' is still valid.`);
      }
    }
    if (sessionidcheck) {
      console.log(`if inside sessionidcheck`);
      cookieJsonCheack = false;
    }
  } catch (error) {
    console.log("error cheacking cookies expries");
  }

  console.log("wait login section " + cookieJsonCheack);

  if (!cookieJsonCheack) {
    try {
      await page_1.waitForSelector('input[name="username"]');
    } catch (error) {
      try {
        await page_1.waitForSelector('input[name="password"]');
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed waitForSelector input name=password and name=username." + err,
          500
        );
        return next(error);
      }
    }
    console.log("login input section");

    try {
      await page_1.type('input[name="username"]', instagramUsername);
      await page_1.type('input[name="password"]', instagramPassword);
    } catch (error) {
      try {
        await page_1.type('input[name="username"]', instagramUsername);
        await page_1.type('input[name="password"]', instagramPassword);
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Could not input username and password in instagram." + err,
          500
        );
        return next(error);
      }
    }

    console.log("login submit section");
    try {
      await page_1.click('button[type="submit"]');
    } catch (error) {
      try {
        await page_1.click('button[type="submit"]');
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Could not Click on submit button." + err,
          500
        );
        return next(error);
      }
    }

    console.log("wait div not now");

    try {
      console.log("wait div not now 1");
      await page_1.waitForXPath("//div[contains(text(),'Not Now')]");
    } catch (error) {
      console.log("error in wait div not now 1");
    }
    try {
      console.log("wait div not now 2");
      await page_1.waitForXPath("//div[contains(text(),'Not Now')]");
    } catch (error) {
      console.log("error in wait div not now 2");
    }

    console.log("click div not now");
    try {
      console.log("click div not now 1");
      const notNow = await page_1.$x("//div[contains(text(),'Not Now')]");
      await notNow[0].click();
    } catch (error) {
      try {
        console.log("click div not now 2");
        const notNow = await page_1.$x("//div[contains(text(),'Not Now')]");
        await notNow[0].click();
      } catch (error) {
        console.log("error in click div not now");
      }
    }
  }

  console.log("wait button not now section");
  try {
    await page_1.waitForXPath("//button[contains(text(),'Not Now')]");
  } catch (error) {}
  try {
    await page_1.waitForXPath("//button[contains(text(),'Not Now')]");
  } catch (error) {
    console.log("error in wait button not now section");
  }

  console.log("click notnow section");
  try {
    const notNow = await page_1.$x("//button[contains(text(),'Not Now')]");
    await notNow[0].click();
  } catch (error) {
    try {
      const notNow = await page_1.$x("//button[contains(text(),'Not Now')]");
      await notNow[0].click();
    } catch (err) {
      console.log("error in click notnow section");
    }
  }

  try {
    console.log("try cookies section run");
    const set_cookies = await page_1.cookies();
    Cookie = JSON.stringify(set_cookies);
    console.log("second cookies :: " + Cookie);
  } catch (error) {
    console.log("cookies error section");
  }

  console.log("loop section");
  for (let i = 0; i < files.length; i++) {
    const file_name = files[i];

    console.log("files length :: " + files[i]);
    console.log("reels  :: " + i);




    



    
    
try {
  console.log("check vidoe duration");    
  const file = await fs.open(UPLOAD_FILE_DIRECTORY + file_name);
  const { buffer } = await file.read(buff, 0, 100, 0);
  
  await file.close();
  
  const start = buffer.indexOf(header) + 17;
  const timeScale = buffer.readUInt32BE(start);
  const duration = buffer.readUInt32BE(start + 4);
  
   const audioLength = Math.floor((duration / timeScale) * 1000) / 1000;
  
   console.log("audioLength : "+ audioLength);
  if (audioLength < 4) {
    console.log("run cheack if");
    continue;
  }
} catch (error) {
  console.log("error check vidoe duration");    
}    
   












    try {
      await page_1.waitForSelector('svg[aria-label="New post"]');
    } catch (error) {
      try {
        await page_1.waitForSelector('svg[aria-label="New post"]');
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed waitForSelector svg aria-label 'New post'" + err,
          500
        );
        return next(error);
      }
    }
    console.log("click newpost section");
    try {
      await page_1.click('#mount_0_0_uc > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.x1dr59a3.xixxii4.x13vifvy.xeq5yr9.x1n327nk > div > div > div > div > div.x1iyjqo2.xh8yej3 > div:nth-child(7) > div > span > div > a > div > div.x6s0dn4.x9f619.xxk0z11.x6ikm8r.xeq5yr9.x1swvt13.x1s85apg.xzzcqpx > div > div > span > span');
    } catch (error) {
      try {
        await page_1.click('#mount_0_0_uc > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.x1dr59a3.xixxii4.x13vifvy.xeq5yr9.x1n327nk > div > div > div > div > div.x1iyjqo2.xh8yej3 > div:nth-child(7) > div > span > div > a > div > div.x6s0dn4.x9f619.xxk0z11.x6ikm8r.xeq5yr9.x1swvt13.x1s85apg.xzzcqpx > div > div > span > span');
      } catch (err) {
        console.log(" error click newpost section 2");
      }
    }

    console.log("click newpost section 2");
    try {
      await page_1.click('svg[aria-label="New post"]');
    } catch (error) {
      try {
        await page_1.click('svg[aria-label="New post"]');
      } catch (err) {
       console.log(" error click newpost section 2");
      }
    }
    console.log("wait select from computer section");

    try {
      await page_1.waitForXPath(
        "//button[contains(text(),'Select from computer')]"
      );
    } catch (error) {
      try {
        await page_1.waitForXPath(
          "//button[contains(text(),'Select from computer')]"
        );
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed waitForXpath button contains.text 'Select from computer'" +
            err,
          500
        );
        return next(error);
      }
    }
    console.log("selectvideo upload vidoe section");
    try {
      const selectVideo = await page_1.$x(
        "//button[contains(text(),'Select from computer')]"
      );
      const [fileChooser] = await Promise.all([
        page_1.waitForFileChooser(),
        await selectVideo[0].click(),
      ]);
      await fileChooser.accept([UPLOAD_FILE_DIRECTORY + file_name]);
    } catch (error) {
      try {
        const selectVideo = await page_1.$x(
          "//button[contains(text(),'Select from computer')]"
        );
        const [fileChooser] = await Promise.all([
          page_1.waitForFileChooser(),
          await selectVideo[0].click(),
        ]);
        await fileChooser.accept([UPLOAD_FILE_DIRECTORY + file_name]);
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed file upload section Select from computer." + err,
          500
        );
        return next(error);
      }
    }
    console.log("wait ok section");

    if (i === 0) {
      try {
        await page_1.waitForXPath("//button[contains(text(),'OK')]");
      } catch (error) {
        try {
          await page_1.waitForXPath("//button[contains(text(),'OK')]");
        } catch (err) {
          await page_1.close();
          await browser_1.close();
          const error = new HttpError(
            "Failed waitForXpath button contains.text 'OK'" + err,
            500
          );
          return next(error);
        }
      }
      console.log("click ok section");
      try {
        const ok = await page_1.$x("//button[contains(text(),'OK')]");
        await ok[0].click();
      } catch (error) {
        try {
          const ok = await page_1.$x("//button[contains(text(),'OK')]");
          await ok[0].click();
        } catch (err) {
          await page_1.close();
          await browser_1.close();
          const error = new HttpError(
            "Failed click button contains.text 'OK'" + err,
            500
          );
          return next(error);
        }
      }
    }

    
    console.log("wait next section");
    //await page_1.waitForTimeout(55000);
    for (let nextloop = 1; nextloop <= 2; nextloop++) {
      try {
        await page_1.waitForXPath("//div[contains(text(),'Next')]");
      } catch (error) {
        try {
          await page_1.waitForXPath("//div[contains(text(),'Next')]");
        } catch (err) {
          await page_1.close();
          await browser_1.close();
          const error = new HttpError(
            "Failed waitForXpath div contains.text 'Next'" + err,
            500
          );
          return next(error);
        }
      }

      if (nextloop === 1) {
        console.log("wait set original size");
        try {
          await page_1.click('svg[aria-label="Select crop"]');
        } catch (error) {
          try {
            await page_1.click('svg[aria-label="Select crop"]');
          } catch (err) {
            console.log("error in wait set original size");
          }
        }

        try {
          await page_1.click('svg[aria-label="Photo outline icon"]');
        } catch (error) {
          try {
            await page_1.click('svg[aria-label="Photo outline icon"]');
          } catch (err) {
            console.log("error in Photo outline icon");
          }
        }
      }

      console.log("click next section");
      try {
        const next = await page_1.$x("//div[contains(text(),'Next')]");
        await next[0].click();
      } catch (error) {
        try {
          const next = await page_1.$x("//div[contains(text(),'Next')]");
          await next[0].click();
        } catch (err) {
          await page_1.close();
          await browser_1.close();
          const error = new HttpError(
            "Failed click div contains.text 'Next'" + err,
            500
          );
          return next(error);
        }
      }
    }

    try {
      const next = await page_1.$x("//div[contains(text(),'Next')]");
      await next[0].click();
    } catch (error) {}
    try {
      const next = await page_1.$x("//div[contains(text(),'Next')]");
      await next[0].click();
    } catch (error) {
      console.log("error in next");
    }

    console.log("wait write a caption section");
    try {
      await page_1.waitForSelector('div[aria-label="Write a caption..."]');
    } catch (error) {
      try {
        await page_1.waitForSelector('div[aria-label="Write a caption..."]');
      } catch (err) {
        console.log("error in wait write a caption section");
      }
    }
    console.log("type write a caption section");
    try {
      await page_1.type(
        'div[aria-label="Write a caption..."]',
        instagramCaption.length > 1
          ? instagramCaption
          : REELDATA[i].description +
              "                          " +
              `video credits @${REELDATA[i].pageName}`
      );
    } catch (error) {
      try {
        await page_1.type(
          'div[aria-label="Write a caption..."]',
          instagramCaption.length > 1
            ? instagramCaption
            : REELDATA[i].description + " " + REELDATA[i].pageName
        );
      } catch (err) {
        console.log("error in type write a caption section");
      }
    }
    console.log("wait share section");
    try {
      await page_1.waitForXPath("//div[contains(text(),'Share')]");
    } catch (error) {
      try {
        await page_1.waitForXPath("//div[contains(text(),'Share')]");
      } catch (err) {
        console.log("Failed waitForXPath div contains.text 'Share'");
      }
    }

    console.log("click share section");
    try {
      const share = await page_1.$x("//div[contains(text(),'Share')]");
      await share[0].click();
    } catch (error) {
      try {
        const share = await page_1.$x("//div[contains(text(),'Share')]");
        await share[0].click();
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed click div contains.text 'Share'" + err,
          500
        );
        return next(error);
      }
    }
    try {
      const share = await page_1.$x("//div[contains(text(),'Share')]");
      await share[0].click();
    } catch (error) {}
    try {
      const share = await page_1.$x("//div[contains(text(),'Share')]");
      await share[0].click();
    } catch (error) {
      console.log("error in share");
    }

    console.log("sleep section");
    await page_1.waitForTimeout(4000);
    console.log("wait img alt section");

// <span class="x1lliihq x1plvlek xryxfnj x1n2onr6 x193iq5w xeuugli x1fj9vlw x13faqbe x1vvkbs x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x1i0vuye x1ms8i2q xo1l8bm x5n08af x2b8uid x4zkp8e xw06pyt x10wh9bi x1wdrske x8viiok x18hxmgj" dir="auto" style="line-height: var(--base-line-clamp-line-height); --base-line-clamp-line-height: 25px;">Videos must be 3 seconds or more</span>


    try {
      console.log("run network tab");
      await page_1.waitForResponse(response => response.url() === 'https://www.instagram.com/api/v1/media/configure_to_clips/' && response.status() === 200);
      console.log("done network tab");
    } catch (error) {
      console.log("error network tab");
    }
    try {
      console.log("wait img alt section 1");
      await page_1.waitForSelector('img[alt="Animated checkmark"]');
    } catch (error) {
      try {
        console.log("wait img alt section 2");
        await page_1.waitForSelector('img[alt="Animated checkmark"]');
      } catch (err2) {
        try {
          console.log("wait img alt section 3");
          await page_1.waitForSelector('img[alt="Animated checkmark"]');
        } catch (err1) {
          try {
            console.log("wait img alt section 4");
            await page_1.waitForSelector('img[alt="Animated checkmark"]');
          } catch (err4) {
            console.log("Failed waitForSelector img alt='Animated checkmark'");
          }
        }
      }
    }
    console.log("wait close section");
    try {
      await page_1.waitForSelector('svg[aria-label="Close"]');
    } catch (error) {
      try {
        await page_1.waitForSelector('svg[aria-label="Close"]');
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed waitForSelector svg aria-label='Close'" + err,
          500
        );
        return next(error);
      }
    }
    console.log("click close section");
    try {
      await page_1.click('svg[aria-label="Close"]');
    } catch (error) {
      try {
        await page_1.click('svg[aria-label="Close"]');
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed click svg aria-label='Close'" + err,
          500
        );
        return next(error);
      }
    }

    console.log("done upload work");
  }

  try {
    await page_1.close();
    await browser_1.close();
  } catch (error) {
    try {
      await page_1.close();
      await browser_1.close();
    } catch (err) {
      console.log("error in close page and borwer");
    }
  }

  console.log("uploadininstagram done ");
  try {
    await saveInDataBase.saveInDataBase(
      savedata,
      placeId,
      Cookie,
      RESCheack,
      RES,
      next
    );
  } catch (err) {
    const error = new HttpError("Could not save in Database 2." + err, 500);
    return NEXT(error);
  }
  console.log("saveindata done");
};

exports.uploadInInstagram = uploadInInstagram;
