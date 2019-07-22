const puppeteer = require('puppeteer');
let broswer, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('The header has the correct test', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect('Blogster');
});

test('Clicking login button', async () => {

    await page.click('.right a');
    const url = page.url();
    expect(url).toMatch(/accounts\.google\.com/)
});