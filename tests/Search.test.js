const puppeteer = require("puppeteer-core");
const expect = require("chai").expect;
const config = require("./Config");
const addContext = require("mochawesome/addContext");

let browser = null;
let page = null;

describe("Search", () => {
  before(async () => {
    browser = await puppeteer.launch(config.default.browser);
    page = await browser.newPage();

    await page.setViewport(config.default.viewport);
  });

  afterEach(async function () {
    addContext(this, "<<<screenshot>>>");
  });

  after(async () => {
    await browser.close();
  });

  it("should show Search page", async () => {
    await page.goto(
      "https://github.com/search?q=shahdab-aalam-saifi&type=users",
      { waitUntil: "networkidle2" }
    );

    const title = await page.title();

    expect(title.startsWith("Search")).to.be.true;
  });

  it("should find user", async () => {
    await page.waitForSelector("a[href='/shahdab-aalam-saifi']", {
      visible: true,
    });

    const user = await page.evaluate(() => {
      return document.querySelectorAll("a[href='/shahdab-aalam-saifi']")[1]
        .text;
    });

    expect(user).to.be.equal("Shahdab Aalam Saifi");
  });
});
