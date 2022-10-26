const { test: base, chromium, expect} = require('@playwright/test');
const path = require('path');

export const test = base.extend({
   context: async ({}, use) => {
      const pathToExtension = path.join(__dirname, "../build");
      const context = await chromium.launchPersistentContext("", {
         headless: false,
         args: [
         `--disable-extensions-except=${pathToExtension}`,
         `--load-extension=${pathToExtension}`,
         ],
      });
      await use(context);
      await context.close();
   },
   extensionId: async ({ context }, use) => {
      let [background] = context.serviceWorkers();
      if (!background)
         background = await context.waitForEvent("serviceworker");

      const extensionId = background.url().split("/")[2];
      await use(extensionId);
   }
});

test("example test", async ({ page, context }) => {
   let [background] = context.serviceWorkers();
   if (!background)
      background = await context.waitForEvent("serviceworker");
   await page.goto("https://www.google.com");
   await expect(page.locator("#jframe")).toHaveCount(1);
});
