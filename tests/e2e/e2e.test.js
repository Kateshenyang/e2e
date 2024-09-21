import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(120000);

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';
  let serverStartTimeout = null;

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
          clearTimeout(serverStartTimeout);
          resolve();
        } else {
          reject(new Error('Server failed to start'));
        }
      });
      serverStartTimeout = setTimeout(() => {
        reject(new Error('Server start timeout'));
      }, 90000);
    });

    console.log('Starting browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

  async function handleAlert() {
    return new Promise((resolve) => {
      page.on('dialog', async (dialog) => {
        const message = dialog.message();
        await dialog.dismiss();
        resolve(message);
      });
    });
  }

  test('should validate a valid card number', async () => {
    console.log('Navigating to the page...');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });

    console.log('Typing the card number...');
    await page.waitForSelector('#card-number');
    await page.type('#card-number', '4111111111111111'); // Visa test card number

    console.log('Clicking the validate button...');
    await page.waitForSelector('#validate-btn');
    const alertPromise = handleAlert();
    await page.click('#validate-btn');

    console.log('Waiting for alert...');
    const alertText = await alertPromise;
    console.log('Alert text:', alertText);

    expect(alertText).toBe('Card is valid and it is a Visa');
  });

  test('should invalidate an invalid card number', async () => {
    console.log('Navigating to the page...');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });

    console.log('Typing the card number...');
    await page.waitForSelector('#card-number');
    await page.type('#card-number', '1234567812345678'); // Invalid card number

    console.log('Clicking the validate button...');
    await page.waitForSelector('#validate-btn');
    const alertPromise = handleAlert();
    await page.click('#validate-btn');

    console.log('Waiting for alert...');
    const alertText = await alertPromise;
    console.log('Alert text:', alertText);

    expect(alertText).toBe('Card is invalid');
  });
});
