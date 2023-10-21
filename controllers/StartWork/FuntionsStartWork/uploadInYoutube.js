const puppeteer = require("puppeteer-extra");
const fs = require("fs").promises;
const buff = Buffer.alloc(100);
const header = Buffer.from("mvhd");
const HttpError = require("../../../models/http-error");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const saveInDataBase = require("../FuntionsStartWork/saveInDataBase");

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

const FULL_TITLE =
  "#FreeFire #GARENAFREEFIRE #tondegamer #freefirelevelup #jokerbundle #magic #grandmaster #op";

const FULL_DESCRIPTION = `
Secret One Tap Headshot Trick & Setting🔥 || Free Fire #freefire #garenafreefire #shorts
FREEFIRE            
Garena free fire      
free fire video
free fire shorts
free fire mein
new free fire
free fire event
free fire download
classy free fire
nxt
nxt classy
classy ff
badge 99 shayari
total gaming
FREE FIRE :
GARENA FREE FIRE
techno banda free fire, Free Fire india, Free Fire Hindi, free fire india, shorts, best handcom, viral, garena free fire, free fire funny shorts, ddg gamers shorts, nitin free fire, nitin shorts, fact fire shorts, free fire hindi, free fire shorts, free fire tips and tricks, ff santanio character short, new character freefire, freefire landmine, m1014 scorpio shatter, free fire ghost, 4g gamers, freefire hindi voice chat, freefire funny short
#freefire ,
#pkgamers ,
#garenafreefire ,
#shorts ,
#freefirevideo ,
#freefiremax ,
#freefirelive ,
#pkgamersfreefire ,
#pkgamers ,
#shortvideo ,
#totalgaming ,
#trending ,
#tiktok ,
#shortsvideo ,
#badge99 ,
#fistfighthacker ,
#solovssquad ,
#funny ,
#aimbotfreefire ,
#desigamers ,
#garenafreefirelive ,
#highlightfreefire  ,
#kingoffactoryfistfight ,
#nonstopgaming ,
#raista ,
#status ,
#viral ,
#xxxtentacion ,
#youtubeshorts ,
#youtubeshorts ,
#GARENAFREEFIRE ,
`;

const FUll_TAG = `
techno banda free fire, Free Fire india, Free Fire Hindi, free fire india, shorts, best handcom, viral, garena free fire, free fire funny shorts, ddg gamers shorts, nitin free fire, nitin shorts, fact fire shorts, free fire hindi, free fire shorts, free fire tips and tricks, ff santanio character short, new character freefire, freefire landmine, m1014 scorpio shatter, free fire ghost, 4g gamers, freefire hindi voice chat, freefire funny short
`;
puppeteer.use(stealthPlugin());

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const uploadInYoutube = async (
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
) => {
  let Cookie = "";
  const browser_1 = await puppeteer.launch({
    headless: "new",
    // executablePath: "./Browers/BraveBrower/brave",
    executablePath: "./Browers/Chrome/chrome",
    args: ["--no-sandbox", "--disable-gpu", "--enable-webgl"],
  });
  const page_1 = await browser_1.newPage();

  const randomIndex = Math.floor(Math.random() * listUserAgent.length);
  const randomUserAgent = listUserAgent[randomIndex];
  console.log(randomUserAgent);
  await page_1.setUserAgent(randomUserAgent);
  await page_1.setViewport({ width: 1366, height: 768 });

  const cookieJSON = cookies ? JSON.parse(cookies) : "";
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
    await page_1.goto("https://studio.youtube.com/");
  } catch (error) {
    try {
      await page_1.goto("https://studio.youtube.com/");
    } catch (err) {
      await page_1.close();
      await browser_1.close();
      const error = new HttpError("Failed goto youtube url" + err, 500);
      return NEXT(error);
    }
  }

  try {
    let ccookies = await page_1.cookies();
    let currentDate = new Date();
    let sessionidcheck = true;
    for (const ccookie of ccookies) {
      const expirationDate = new Date(ccookie.expires * 1000);

      if (ccookie.name == "SSID") {
        sessionidcheck = false;
      }
      if (expirationDate < currentDate) {
        console.log(`Cookie '${ccookie.name}' has expired.`);
        if (ccookie.name == "SSID") {
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
    console.log("goto Sign in section");
    console.log("wait login section");
    try {
      await page_1.waitForSelector('input[type="email"]');
    } catch (error) {
      try {
        await page_1.waitForSelector('input[type="email"]');
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed waitForSelector input name=password and name=username." + err,
          500
        );
        return NEXT(error);
      }
    }
    console.log("login email input section");

    try {
      await page_1.type('input[type="email"]', instagramUsername);
      await page_1.waitForXPath("//span[contains(text(),'Next')]");
      const NEXT = await page_1.$x("//span[contains(text(),'Next')]");
      await NEXT[0].click();
    } catch (error) {
      try {
        await page_1.type('input[type="email"]', instagramUsername);
        await page_1.waitForXPath("//span[contains(text(),'Next')]");
        const NEXT = await page_1.$x("//span[contains(text(),'Next')]");
        await NEXT[0].click();
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Could not input username and password in instagram." + err,
          500
        );
        return NEXT(error);
      }
    }
    await page_1.waitForTimeout(4000);
    console.log("login password input section");
    try {
      await page_1.waitForSelector('input[type="password"]');
    } catch (error) {
      try {
        await page_1.waitForSelector('input[type="password"]');
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed waitForSelector input name=password and name=username." + err,
          500
        );
        return NEXT(error);
      }
    }

    try {
      await page_1.type('input[type="password"]', instagramPassword);
      await page_1.waitForXPath("//span[contains(text(),'Next')]");
      const NEXT = await page_1.$x("//span[contains(text(),'Next')]");
      await NEXT[0].click();
    } catch (error) {
      try {
        await page_1.type('input[type="password"]', instagramPassword);
        await page_1.waitForXPath("//span[contains(text(),'Next')]");
        const NEXT = await page_1.$x("//span[contains(text(),'NexT')]");
        await NEXT[0].click();
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Could not input username and password in instagram." + err,
          500
        );
        return NEXT(error);
      }
    }
  }
  console.log("wait Create section");
  try {
    console.log("Click on + icon ");
    await page_1.waitForSelector('ytcp-button[id="create-icon"]');
  } catch (error) {
    try {
      await page_1.waitForSelector("#create-icon");
    } catch (err) {
      console.log("error in Click on + icon ");
    }
  }

  console.log("loop section :: " + files.length);
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
      if (audioLength < 3) {
        console.log("run cheack if");
        continue;
      }
    } catch (error) {
      console.log("error check vidoe duration");    
    }    
       
    











    if (i == 0) {
      try {
        console.log("try cookies section run");
        const set_cookies = await page_1.cookies();
        Cookie = JSON.stringify(set_cookies);
        console.log("second cookies :: " + Cookie);
      } catch (error) {
        console.log("error in try cookies section run");
      }
    }
    console.log("wait for create icon");
    try {
      console.log("Click on + icon ");
      await page_1.click('ytcp-button[id="create-icon"]');
    } catch (error) {
      try {
        await page_1.click("#create-icon");
      } catch (err) {
        console.log("error in Click on + icon ");
      }
    }

    try {
      console.log("Click on + icon 2");
      await page_1.click("#create-icon");
    } catch (error) {
      try {
        await page_1.click('ytcp-button[id="create-icon"]');
      } catch (err) {
        console.log("error in Click on + icon 2");
      }
    }

    try {
      console.log("click on Upload Button");
      await page_1.waitForSelector("#text-item-0 > ytcp-ve");
    } catch (error) {
      try {
        await page_1.waitForSelector('tp-yt-paper-item[id="text-item-0"]');
      } catch (err) {
        console.log("error in Click on upload button");
      }
    }

    try {
      console.log("click on Upload Button");
      await page_1.click('tp-yt-paper-item[id="text-item-0"]');
      await sleep(500);
    } catch (error) {
      try {
        await page_1.click("#text-item-0 > ytcp-ve");
        await sleep(500);
      } catch (err) {
        console.log("error in click on Upload Button");
      }
    }

    try {
      console.log("click on Upload Button 2");
      await page_1.click("#text-item-0 > ytcp-ve");
      await sleep(500);
    } catch (error) {
      try {
        await page_1.click('tp-yt-paper-item[id="text-item-0"]');
        await sleep(500);
      } catch (err) {
        console.log("error in click on Upload Button 2");
      }
    }

    try {
      await page_1.waitForSelector("#select-files-button > div");
    } catch (error) {
      try {
        await page_1.waitForSelector("#select-files-button > div");
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed click wait selectfilebutton" + err,
          500
        );
        return NEXT(error);
      }
    }

    try {
      console.log("Upload Video");
      const [fileChooser] = await Promise.all([
        page_1.waitForFileChooser(),
        page_1.click("#select-files-button > div"), // some button that triggers file selection
      ]);
      await fileChooser.accept([UPLOAD_FILE_DIRECTORY + file_name]);
    } catch (error) {
      try {
        console.log("Upload Video 2");
        const [fileChooser] = await Promise.all([
          page_1.waitForFileChooser(),
          page_1.click("#select-files-button > div"), // some button that triggers file selection
        ]);
        await fileChooser.accept([UPLOAD_FILE_DIRECTORY + file_name]);
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError("Failed Upload Video" + err, 500);
        return NEXT(error);
      }
    }

    try {
      await page_1.waitForSelector('ytcp-social-suggestion-input[id="input"]');
    } catch (error) {
      try {
        await page_1.waitForSelector(
          'ytcp-social-suggestion-input[id="input"]'
        );
      } catch (err) {
        await page_1.close();
        await browser_1.close();
        const error = new HttpError(
          "Failed click wait ytcp-social-suggestion-input" + err,
          500
        );
        return NEXT(error);
      }
    }

    const text_box = await page_1.$x('//*[@id="textbox"]');
    try {
      console.log("Fill Title");
      await text_box[0].click({ clickCount: 3 });
      await text_box[0].type(FULL_TITLE);
      // await text_box[0].type(
      //   instagramCaption.length > 1
      //     ? instagramCaption
      //     : `video credits @${REELDATA[i].pageName}`
      // );
    } catch (error) {
      try {
        console.log("Fill Title 2");
        await text_box[0].type(
          instagramCaption.length > 1
            ? instagramCaption
            : `video credits @${REELDATA[i].pageName}`
        );
      } catch (err) {
        console.log("error in Fill Title");
      }
    }

    try {
      // Description content
      console.log("Fill Description");
      await page_1.waitForTimeout(1000);
      await text_box[1].type(FULL_DESCRIPTION);
      // await text_box[1].type(
      //   instagramCaption.length > 1 ? instagramCaption : REELDATA[i].description
      // );
    } catch (error) {
      try {
        // Description content
        console.log("Fill Description 2");
        await text_box[1].type(
          instagramCaption.length > 1
            ? instagramCaption +
                "#videogames #games #gamer #envywear #PleaseForgiveMe #gaming #instagaming #instagamer #playinggames #online #photooftheday #onlinegaming #videogameaddict #instagame #instagood #gamestagram #gamerguy #gamergirl #gamin #video #game #igaddict #winning #play #playing"
            : REELDATA[i].description
        );
      } catch (err) {
        console.log("error in Fill Description");
      }
    }

    console.log("run check limit videos upload");
    let text = " error in check limit videos upload";
    try {
      text = await page_1.$eval(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.left-button-area.style-scope.ytcp-uploads-dialog > ytcp-ve > yt-formatted-string",
        (element) => {
          return element.textContent.trim();
        }
      );
      if (text) {
        text =
          "Upload more videos daily after a one-time verification or wait 24 hours";
        await page.close();
      }
    } catch (errr) {
      await page_1.close();
      await browser_1.close();
      const error = new HttpError(text, 500);
      return NEXT(error);
    }

    try {
      // this is click on NOT FOR KIDS
      console.log("Click on NOT FOR KIDS");
      await page_1.waitForTimeout(1000);
      await page_1.click(
        'tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]'
      );
    } catch (error) {
      try {
        // this is click on NOT FOR KIDS
        console.log("Click on NOT FOR KIDS 2");
        await page_1.click(
          'tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]'
        );
      } catch (err) {
        console.log("error in Click on NOT FOR KIDS");
      }
    }

    try {
      // this is click on NOT FOR KIDS
      await page_1.click(
        'tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]'
      );
    } catch (error) {}

    try {
      console.log("Fill tag");
      await page_1.click('ytcp-button[id="toggle-button"]');
      await page_1.waitForTimeout(1000);
      await page_1.type('input[placeholder="Add tag"]', FUll_TAG);
    } catch (error) {
      try {
        console.log("Fill tag");
        await page_1.click('ytcp-button[id="toggle-button"]');
        await page_1.waitForTimeout(1000);
        await page_1.type(
          'input[placeholder="Add tag"]',
          "#videogames,#games,#gamer,#envywear,#PleaseForgiveMe,#gaming,#instagaming,#instagamer,#playinggames,#online,#photooftheday,#onlinegaming,#videogameaddict,#instagame,#instagood,#gamestagram,#gamerguy,#gamergirl,#gamin,#video,#game,#igaddict,#winning,#play,#playing"
        );
      } catch (err) {
        console.log("error in fill tag");
      }
    }

    try {
      console.log("select category");
      await page_1.click('ytcp-form-select[id="category"]');
      await page_1.waitForXPath(
        "//yt-formatted-string[contains(text(),'Gaming')]"
      );
      const gaming = await page_1.$x(
        "//yt-formatted-string[contains(text(),'Gaming')]"
      );
      await gaming[0].click();
      await page_1.waitForSelector('input[aria-label="Game title (optional)"]');
      await page_1.type(
        'input[aria-label="Game title (optional)"]',
        "Garena Free Fire"
      );
    } catch (err) {
      console.log("error in select category");
    }

    try {
      // This is Click on NEXT 1 times
      console.log("Click  NEXT 1");
      await page_1.waitForTimeout(1000);
      await page_1.click(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
      );
    } catch (error) {
      try {
        // This is Click on NEXT 1 times
        console.log("Click  NEXT 1 2");
        await page_1.click(
          "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
        );
      } catch (err) {
        console.log("error in Click NEXT 1");
      }
    }

    try {
      // This is Click on NEXT 2 times
      console.log("Click  NEXT 2");
      await page_1.waitForTimeout(1000);
      await page_1.click(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
      );
    } catch (error) {
      try {
        // This is Click on NEXT 2 times
        console.log("Click  NEXT 2 2");
        await page_1.click(
          "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
        );
      } catch (err) {
        console.log("error in Click NEXT 2");
      }
    }

    try {
      // This is Click on NEXT 3 times
      console.log("Click  NEXT 3");
      await page_1.waitForTimeout(1000);
      await page_1.click(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
      );
    } catch (error) {
      try {
        // This is Click on NEXT 3 times
        console.log("Click  NEXT 3 2");
        await page_1.click(
          "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
        );
      } catch (err) {
        console.log("error in Click NEXT 3");
      }
    }

    try {
      // This is Click on NEXT 3 times
      console.log("Click  NEXT bouns click ");
      await page_1.waitForTimeout(1000);
      await page_1.click(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
      );
    } catch (error) {
      try {
        // This is Click on NEXT 3 times
        console.log("Click  NEXT bouns click");
        await page_1.click(
          "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
        );
      } catch (err) {
        console.log("error in Click NEXT bouns click");
      }
    }

    try {
      // This is Click on NEXT 3 times
      console.log("Click  NEXT bouns click 2 ");
      await page_1.waitForTimeout(1000);
      await page_1.click(
        "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
      );
    } catch (error) {
      try {
        // This is Click on NEXT 3 times
        console.log("Click  NEXT bouns click 2");
        await page_1.click(
          "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.right-button-area.style-scope.ytcp-uploads-dialog"
        );
      } catch (err) {
        console.log("error in Click NEXT bouns click 2");
      }
    }

    try {
      console.log("Click Public");
      await page_1.waitForSelector('tp-yt-paper-radio-button[name="PUBLIC"]');
    } catch (err) {
      try {
        console.log("Click Public 2");
        await page_1.waitForSelector('tp-yt-paper-radio-button[name="PUBLIC"]');
      } catch (error) {
        console.log("error in Click Public");
      }
    }
    // svg class="style-scope tp-yt-iron-icon"
    try {
      console.log("Click Public");
      await page_1.click(
        "#privacy-radios > tp-yt-paper-radio-button.style-scope.ytcp-video-visibility-select.iron-selected"
      );
    } catch (err) {
      try {
        console.log("Click Public 2");
        await page_1.click('tp-yt-paper-radio-button[name="PUBLIC"]');
      } catch (error) {
        console.log("error in Click Public");
      }
    }
    try {
      console.log("Click Public");
      await page_1.waitForTimeout(1500);
      await page_1.click(
        "#privacy-radios > tp-yt-paper-radio-button.style-scope.ytcp-video-visibility-select.iron-selected"
      );
    } catch (err) {
      try {
        console.log("Click Public 2");
        await page_1.click('tp-yt-paper-radio-button[name="PUBLIC"]');
      } catch (error) {
        console.log("error in Click Public");
      }
    }
    try {
      // this is publish video
      console.log("wait on publish");

      await page_1.waitForSelector('ytcp-button[id="done-button"]');
    } catch (error) {
      try {
        // this is publish video
        console.log("Click on publish 2");
        await page_1.waitForSelector('ytcp-button[id="done-button"]');
      } catch (err) {
        console.log("error in wait on publish");
      }
    }

    try {
      // this is publish video
      console.log("Click on publish");
      await page_1.waitForTimeout(1000);
      await page_1.click('ytcp-button[id="done-button"]');
    } catch (error) {
      try {
        // this is publish video
        console.log("Click on publish 2");
        await page_1.click('ytcp-button[id="done-button"]');
      } catch (err) {
        console.log("error in Click on publish");
      }
    }

    try {
      // this is publish video
      console.log("Click on publish 2");
      await page_1.waitForTimeout(1000);
      await page_1.click("//div[contains(text(),'Publish')]");
    } catch (error) {
      try {
        // this is publish video
        console.log("Click on publish 2 2");
        await page_1.waitForTimeout(2000);
        await page_1.click("//div[contains(text(),'Publish')]");
      } catch (err) {
        console.log("error in Click on publish 2");
      }
    }

    try {
      //this is click on close button
      console.log("Start wait Close Button");
      await page_1.waitForTimeout(1000);
      await page_1.waitForSelector('ytcp-button[id="close-button"]');
      console.log("END VIDEO");
    } catch (error) {
      try {
        //this is click on close button
        console.log("Start wait Close Button 2");
        await page_1.waitForSelector('ytcp-button[id="close-button"]');
        console.log("END VIDEO");
      } catch (err) {
        console.log("error in Start wait Close Button");
      }
    }

    try {
      //this is click on close button
      console.log("Start Close Button");
      await page_1.click('ytcp-button[id="close-button"]');
      console.log("END VIDEO");
    } catch (error) {
      try {
        //this is click on close button
        console.log("Start Close Button 2");
        await page_1.click('ytcp-button[id="close-button"]');
        console.log("END VIDEO");
      } catch (err) {
        console.log("error in Start Close Button");
      }
    }

    try {
      //this is click on close button
      console.log("Start Close Button 2");
      await page_1.click('ytcp-button[id="close-button"]');
      console.log("END VIDEO");
    } catch (error) {
      try {
        //this is click on close button
        console.log("Start Close Button 2 2");
        await page_1.click('ytcp-button[id="close-button"]');
        console.log("END VIDEO");
      } catch (err) {
        console.log("error in Start Close Button 2");
      }
    }
    console.log("upload done " + i);
  }

  console.log("done upload work");
  try {
    await page_1.close();
    await browser_1.close();
  } catch (error) {
    try {
      await page_1.close();
      await browser_1.close();
    } catch (err) {
      const error = new HttpError("Failed page close and browser close", 500);
      return NEXT(error);
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
      NEXT
    );
  } catch (err) {
    const error = new HttpError("Could not save in Database 2." + err, 500);
    return NEXT(error);
  }
  console.log("saveindata done");
};

exports.uploadInYoutube = uploadInYoutube;
