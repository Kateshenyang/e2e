import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should validate a valid card number', async () => {
    await page.goto(baseUrl);
    await page.type('#card-number', '4111111111111111'); // Visa test card number
    await page.click('#validate-btn');
    const alertText = await page.evaluate(() => alert.text());
    expect(alertText).toBe('Card is valid and it is a Visa');
  });

  test('should invalidate an invalid card number', async () => {
    await page.goto(baseUrl);
    await page.type('#card-number', '1234567812345678'); // Invalid card number
    await page.click('#validate-btn');
    const alertText = await page.evaluate(() => alert.text());
    expect(alertText).toBe('Card is invalid');
  });
});