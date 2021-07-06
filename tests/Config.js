require("dotenv").config();

const browser = {
  headless: false,
  slowMo: 10,
  defaultViewport: null,
  args: ["--start-maximized"],
  executablePath: process.env.PUPPETEER_PATH,
};

const viewport = { width: 1440, height: 1058 };

module.exports = { default: { browser, viewport } };
