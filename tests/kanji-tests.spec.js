const { test: base, chromium, expect} = require("@playwright/test");
const path = require("path");

/*
   Unimplmeneted
*/

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

test.describe("main", () => {
   let jframe;
   test.beforeEach(async ({ page, context }) => {
      let [background] = context.serviceWorkers();
      if (!background)
         background = await context.waitForEvent("serviceworker");
      jframe = page.locator("#jf-content");
      await page.goto("https://www.google.com");
   });

   test("Displays four kanji on the side panel when performing search", async ({ page }) => {
      await jframe.locator("#jf-searchbar").fill("test");
      await jframe.locator("#jf-submit-btn").click();
      await page.waitForFunction(() => {
         return document.querySelector("#jf-results").children.length === 20;
      })
     
      await expect(jframe.locator(".entry.kanji_light.clearfix")).toHaveCount(4);
   });
});