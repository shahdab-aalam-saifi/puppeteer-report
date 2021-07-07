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
      headless: false,
    });
    page = await browser.newPage();

    await page.setViewport(config.default.viewport);

    await page.goto("https://www.google.com/", { waitUntil: "networkidle2" });
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

  describe("browser", () => {
    it("should show browser details", async () => {
      const version = await browser.version();
      const userAgent = await browser.userAgent();
      const ws = await browser.wsEndpoint();

      print(`Web Socket: ${ws}`);
      print(`Version: ${version}`);
      print(`User Agent: ${userAgent}`);
    });
  });

  describe("page", () => {
    it("event", async () => {
      page.on("console", (message) => {
        print("[CONSOLE] " + message.text());
      });

      await page.evaluate(() => console.log("Chromium"));

      page.on("dialog", async (dialog) => {
        print("[ALERT] " + dialog.message());

        dialog.dismiss();
      });

      await page.evaluate(() => alert(new Date()));
    });

    it("should enter text in search", async () => {
      await page.waitForSelector("input[name='q']");
      await page.focus("input[name='q']");
      await page.keyboard.type("Puppeteer");
      await page.screenshot({ path: "SPEC_Screenshot.png" });
    });
  });
});
