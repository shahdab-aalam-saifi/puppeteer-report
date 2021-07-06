const puppeteer = require("puppeteer-core");
const config = require("./Config");
const expect = require("chai").expect;
const chalk = require("chalk");

const print = (message) => {
  console.log(chalk.cyan(chalk.blue("[SPEC]"), message));
};

let browser = null;
let page = null;

describe("S.P.E.C.", () => {
  before(async () => {
    browser = await puppeteer.launch({
      ...config.default.browser,
      headless: true,
    });
    page = await browser.newPage();

    await page.setViewport(config.default.viewport);
  });

  after(async () => {
    await browser.close();
  });

  describe("puppeteer", () => {
    it("should show devices", async () => {
      for (const key in puppeteer.devices) {
        const device = puppeteer.devices[key];

        print(
          `${device.name} (w: ${device.viewport.width}, h: ${device.viewport.height})`
        );
      }
    });

    it("should show network conditions", async () => {
      for (const key in puppeteer.networkConditions) {
        const network = puppeteer.networkConditions[key];

        print(
          `${key} (\u2193: ${network.download}, \u2191: ${network.upload}, ~: ${network.latency})`
        );
      }
    });
  });

  it("should show browser details", async () => {
    const version = await browser.version();
    const userAgent = await browser.userAgent();
    const ws = await browser.wsEndpoint();

    print(`Web Socket: ${ws}`);
    print(`Version: ${version}`);
    print(`User Agent: ${userAgent}`);
  });
});
