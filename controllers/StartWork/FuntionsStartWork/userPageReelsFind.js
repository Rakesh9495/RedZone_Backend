const puppeteer = require("puppeteer");

const HttpError = require("../../../models/http-error");

const userPageReelsFind = async (user_profile_url, NEXT) => {
  const browser_1 = await puppeteer.launch({ headless: "new" });
  const page_1 = await browser_1.newPage();

  try {
    await page_1.goto(user_profile_url);
  } catch (err) {
    try {
      await page_1.goto(user_profile_url);
    } catch (err1) {
      await page_1.close();
      await browser_1.close();
      const error = new HttpError("page_1 goto is failed.", 500);
      return NEXT(error);
    }
  }

  let text =  "div class=_aajw, div role=tablist failed in UserPageReelsFind. waitforselector is failed";
  try {
    await page_1.waitForSelector('div[class="_aajw"]');
  } catch (err) {
    try {
      text = await page_1.$eval('span[dir="auto"]', (element) => {
        return element.textContent.trim();
      });
      await page_1.waitForSelector('div[role="tablist"]');
    } catch (err1) {
      await page_1.close();
      await browser_1.close();
      const error = new HttpError(
        text,
        500
      );
      return NEXT(error);
    }
  }

  const reelLinks = await page_1.evaluate(() => {
    try {
      return Array.from(
        document.querySelectorAll("div[class='_aajw'] > a[href]"),
        (a) => "https://www.instagram.com" + a.getAttribute("href")
      );
    } catch (error) {
      try {
        return Array.from(
          document.querySelectorAll("div[class='_aajw'] > a[href]"),
          (a) => "https://www.instagram.com" + a.getAttribute("href")
        );
      } catch (err) {
        const error = new HttpError(
          "userPageReelsFind is failed. Cannot find links in reels ArrayForm. href collect",
          500
        );
        return NEXT(error);
      }
    }
  });

  try {
    await page_1.close();
  } catch (error) {
    try {
      await page_1.close();
    } catch (error) {}
  }

  try {
    await browser_1.close();
  } catch (error) {
    try {
      await browser_1.close();
    } catch (error) {}
  }

  return reelLinks;
};

exports.userPageReelsFind = userPageReelsFind;
