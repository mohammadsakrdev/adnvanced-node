const puppeteer = require('puppeteer');

class CustomPage {
    static async build() {
        const browser = puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        })
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();

        const {
            session,
            sig
        } = sessionFactory(user);

        await page.setCookie({
            name: 'session',
            value: session
        });

        await page.setCookie({
            name: 'session.sig',
            value: sig
        });

        await page.goto('localhost:3000/blogs');
        await page.waitFor('a[href="/auth/logout"]');
    }
}

module.exports = CustomPage;