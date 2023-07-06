const express = require('express');
const app = express();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {EMAIL, PASSWORD} = require('./configs');
puppeteer.use(StealthPlugin());

(async () => {
    let browser;
    console.log('Running test gmail..');
    try {
        browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        await page.goto('https://mail.google.com/',{waitUntil: 'networkidle0'});
        await page.$eval('input[type=email]', (el, EMAIL) => el.value = EMAIL, EMAIL);
        await page.$eval('#identifierNext', el => el.click());
        await page.waitForSelector('input[type=password]', { visible: true }).then(async () => await page.$eval('input[type=password]', (el, PASSWORD) => el.value = PASSWORD, PASSWORD));
        await page.$eval('#passwordNext', el => el.click());

        let number = await page.waitForSelector('.aim.ain', { visible: true }).then(async () => await page.$eval('.aim.ain', el => el.textContent));
        number = number.replace(/\D/g, '');
        console.log(`End test gmail. Result: ${number}`);
        await browser.close();
    } catch (e) {
        console.log(e);
        await browser.close();
        throw e;
    }
})();

app.use('*', (req, res) => {
    res.status(404).json('Page not found')
});
app.listen(3000, () =>{
    console.log('OK');
});
