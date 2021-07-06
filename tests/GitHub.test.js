const puppeteer = require("puppeteer-core");
const expect = require("chai").expect;
const config = require("./Config");

let browser = null;
let page = null;

describe("Home", () => {
  before(async () => {
    browser = await puppeteer.launch(config.default.browser);
    page = await browser.newPage();

    await page.setViewport(config.default.viewport);
  });

  after(async () => {
    await browser.close();
  });

  it("should show Home page", async () => {
    await page.goto("https://github.com/", { waitUntil: "networkidle2" });

    const title = await page.title();

    expect(title.startsWith("GitHub")).to.be.true;
  });

  it("should navigate to search results page", async () => {
    await page.waitForSelector("input[name='q']", { visible: true });
    await page.click("input[name='q']");

    await page.keyboard.type("shahdab-aalam-saifi");
    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    await page.waitForSelector("#js-pjax-container .codesearch-results h3");

    const result = await page.evaluate(() => {
      return document.querySelector("#js-pjax-container .codesearch-results h3")
        .innerText;
    });

    expect(result).to.be.equal(
      "We couldn’t find any repositories matching 'shahdab-aalam-saifi'"
    );
  });
});
