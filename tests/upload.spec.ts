import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Photo Upload", () => {
  test("shows login prompt when trying to enhance without auth", async ({ page }) => {
    await page.goto("/");

    // Create a test image file
    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    // Upload file via file chooser
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: buffer,
    });

    // Should show preview
    await expect(page.getByAltText("Preview")).toBeVisible();

    // Should show login button (not logged in)
    await expect(page.getByRole("link", { name: /log in om te verbeteren/i })).toBeVisible();
  });

  test("can select and preview an image", async ({ page }) => {
    await page.goto("/");

    // Create a test image
    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: "house.png",
      mimeType: "image/png",
      buffer: buffer,
    });

    // Preview should be visible
    await expect(page.getByAltText("Preview")).toBeVisible();

    // "Andere foto" button should appear
    await expect(page.getByRole("button", { name: /andere foto/i })).toBeVisible();
  });

  test("can reset file selection", async ({ page }) => {
    await page.goto("/");

    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: buffer,
    });

    // Click reset button
    await page.getByRole("button", { name: /andere foto/i }).click();

    // Should show upload area again
    await expect(page.getByText("Sleep je woningfoto")).toBeVisible();
  });
});

test.describe("Cookie Consent", () => {
  test("shows cookie banner on first visit", async ({ page, context }) => {
    // Clear storage to simulate first visit
    await context.clearCookies();

    await page.goto("/");

    // Wait for cookie banner (has 1s delay)
    await expect(page.getByText(/cookies/i)).toBeVisible({ timeout: 3000 });
  });

  test("can accept cookies", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/");

    // Wait for and click accept
    await page.getByRole("button", { name: /accepteren/i }).click();

    // Banner should disappear
    await expect(page.getByText(/we gebruiken cookies/i)).not.toBeVisible();
  });

  test("can decline cookies", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/");

    await page.getByRole("button", { name: /weigeren/i }).click();

    await expect(page.getByText(/we gebruiken cookies/i)).not.toBeVisible();
  });
});
