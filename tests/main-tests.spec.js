const { test: base, chromium, expect} = require("@playwright/test");
const path = require("path");

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

   test("content script injects into page", async ({ page }) => {
      await expect(page.locator("#jframe")).toHaveCount(1);
   });

   test("searches 'test' and displays results", async ({ page }) => {
      await jframe.locator("#jf-searchbar").fill("test");
      await jframe.locator("#jf-submit-btn").click();
      await expect(jframe.locator(".jf-entry")).toHaveCount(20);
   });

   test("scrolls to bottom", async ({ page }) => {
      let scrollHeight = await jframe.evaluate(content => content.scrollHeight);
      let scrollTop = await jframe.evaluate((content, scrollHeight) => {
         content.scrollTo(0, scrollHeight);
         return content.scrollTop;
      }, scrollHeight);
      expect(scrollTop).toBeCloseTo(scrollHeight-500);
   });

   test("searches invalid text 'dasdasd' and displays that no results were found", async ({ page }) => {
      await jframe.locator("#jf-searchbar").fill("dasdasd");
      await jframe.locator("#jf-submit-btn").click();
      await expect(jframe.locator("#jf-no-results")).toHaveText("Sorry, couldn't find anything matching dasdasd.");
   });

   test("searches 'test', loads more results", async ({ page }) => {
      await jframe.locator("#jf-searchbar").fill("test");
      await jframe.locator("#jf-submit-btn").click();
      await jframe.locator("#jf-more-words a").click();
      await expect(jframe.locator(".jf-entry")).toHaveCount(40);
   });

   test("searches 'cake', clicks on 'Read more' and displays wikipedia defintiion", async ({ page }) => {
      const abstract = jframe.locator("#jf-results .jf-def-abs >> nth=0");
      await jframe.locator("#jf-searchbar").fill("cake");
      await jframe.locator("#jf-submit-btn").click();
      await abstract.locator("a").click();
      await expect(abstract).toContainText("with some varieties also requiring liquid and leavening agents.");
    });

   test("searches 'test', sets searchbar to 'cake', then searches 'cake' again", async ({ page }) => {
      await jframe.locator("#jf-searchbar").fill("test");
      await jframe.locator("#jf-submit-btn").click();
      await page.waitForFunction(() => {
         return document.querySelector("#jf-results").children.length === 20;
      })
      await jframe.locator("#jf-searchbar").fill("cake");
      await jframe.locator("#jf-more-words a").click();
      await expect(jframe.locator(".jf-entry")).toHaveCount(40);
      await jframe.locator("#jf-submit-btn").click();
      await expect(jframe.locator(".jf-entry")).toHaveCount(20);
   });
});

 

