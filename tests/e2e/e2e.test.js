import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(90000);

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeEach(async () => {
    console.log('Starting server...');
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', (err) => {
        console.error('Server error:', err);
        reject(err);
      });
      server.on('message', (message) => {
        console.log('Server message:', message);
        if (message === 'ok') {
          console.log('Server started successfully');
          resolve();
        } else {
          reject(new Error('Server failed to start'));
        }
      });
      setTimeout(() => {
        reject(new Error('Server start timeout'));
      }, 30000);
    });

    console.log('Starting browser...');
    browser = await puppeteer.launch({
      // headless: false, // показать GUI
      // slowMo: 250,
      // devtools: true, // показать devTools
    });
    page = await browser.newPage();
  });

  afterEach(async () => {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
    if (server) {
      console.log('Killing server...');
      server.kill();
    }
  });

  test('should validate a valid card number', async () => {
    console.log('Navigating to the page...');
    await page.goto(baseUrl);
    await page.type('#card-number', '4111111111111111'); // Visa test card number
    await page.click('#validate-btn');
    const alertText = await page.evaluate(() => alert.text());
    console.log('Alert text:', alertText);
    expect(alertText).toBe('Card is valid and it is a Visa');
  });

  test('should invalidate an invalid card number', async () => {
    console.log('Navigating to the page...');
    await page.goto(baseUrl);
    await page.type('#card-number', '1234567812345678'); // Invalid card number
    await page.click('#validate-btn');
    const alertText = await page.evaluate(() => alert.text());
    console.log('Alert text:', alertText);
    expect(alertText).toBe('Card is invalid');
  });
});
