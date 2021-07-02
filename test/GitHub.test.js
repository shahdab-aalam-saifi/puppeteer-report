const puppeteer = require("puppeteer");
const expect = require("chai").expect;

let browser = null;
let page = null;

describe("GitHub", () => {
  before(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 10 });
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it("should show Home page", async () => {
    await page.goto("https://github.com/", { waitUntil: "networkidle2" });

    const title = await page.title();

    expect(title.startsWith("GitHub")).to.be.true;
  });
});
