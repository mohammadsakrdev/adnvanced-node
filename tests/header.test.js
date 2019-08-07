const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
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

test('Show sign out when log in', async () => {
    await page.login();

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
});