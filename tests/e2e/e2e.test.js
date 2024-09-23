import puppeteer from 'puppeteer';
import { fork } from 'child_process';
import find from 'find-process';

jest.setTimeout(180000); // Увеличьте время ожидания, если необходимо

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';
  let serverStartTimeout = null;

  beforeAll(async () => {
    // Завершение всех процессов, использующих порт 9000
    try {
      console.log('Searching for any process using port 9000...');
      const list = await find('port', 9000);
      list.forEach((proc) => {
        console.log(`Killing process ${proc.pid} using port 9000...`);
        process.kill(proc.pid);
      });
    } catch (err) {
      console.error('Error killing process:', err);
    }

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
          console.error('Server failed to start');
          reject(new Error('Server failed to start'));
        }
      });
      serverStartTimeout = setTimeout(() => {
        console.error('Server start timeout');
        reject(new Error('Server start timeout'));
      }, 150000); // Увеличьте время ожидания, если необходимо
    });

    console.log('Starting browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Эти аргументы могут помочь избежать проблем с правами доступа
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
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
    return new Promise((resolve, reject) => {
      function onDialog(dialog) {
        const message = dialog.message();
        dialog
          .dismiss()
          .then(() => resolve(message))
          .catch(reject);
        page.off('dialog', onDialog);
      }
      page.on('dialog', onDialog);
    });
  }

  test('should validate a valid card number', async () => {
    console.log('Navigating to the page...');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });

    console.log('Waiting for card number input...');
    await page.waitForSelector('#card-number');
    console.log('Typing the card number...');
    await page.type('#card-number', '4111111111111111'); // Visa test card number

    console.log('Waiting for validate button...');
    await page.waitForSelector('#validate-btn');
    console.log('Clicking the validate button...');
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

    console.log('Waiting for card number input...');
    await page.waitForSelector('#card-number');
    console.log('Typing the card number...');
    await page.type('#card-number', '1234567812345678'); // Invalid card number

    console.log('Waiting for validate button...');
    await page.waitForSelector('#validate-btn');
    console.log('Clicking the validate button...');
    const alertPromise = handleAlert();
    await page.click('#validate-btn');

    console.log('Waiting for alert...');
    const alertText = await alertPromise;
    console.log('Alert text:', alertText);

    expect(alertText).toBe('Card is invalid');
  });
});
