import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("homepage loads with hero section", async ({ page }) => {
    await page.goto("/");

    // Check hero headline
    await expect(page.getByRole("heading", { level: 1 })).toContainText("stralen");

    // Check upload area exists
    await expect(page.getByText("Sleep je woningfoto")).toBeVisible();

    // Check navigation
    await expect(page.getByRole("link", { name: "Pandblink" })).toBeVisible();
  });

  test("FAQ page loads", async ({ page }) => {
    await page.goto("/faq");

    await expect(page.getByRole("heading", { name: /veelgestelde vragen/i })).toBeVisible();
    await expect(page.getByText("Wat is Pandblink?")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /inloggen/i })).toBeVisible();
    await expect(page.getByText(/google/i)).toBeVisible();
  });

  test("credits page loads", async ({ page }) => {
    await page.goto("/credits");

    await expect(page.getByText(/credits kopen/i)).toBeVisible();
    await expect(page.getByText("€9")).toBeVisible();
    await expect(page.getByText("€19")).toBeVisible();
    await expect(page.getByText("€29")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("can navigate from homepage to FAQ", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer and click FAQ link
    await page.getByRole("link", { name: /veelgestelde vragen/i }).click();

    await expect(page).toHaveURL("/faq");
  });

  test("can navigate from homepage to login", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /inloggen/i }).click();

    await expect(page).toHaveURL("/login");
  });

  test("pricing section anchor works", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /prijzen/i }).first().click();

    // Should scroll to pricing section
    await expect(page.locator("#prijzen")).toBeInViewport();
  });
});

test.describe("SEO & Meta", () => {
  test("homepage has correct meta tags", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/Pandblink/);

    // Check meta description exists
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /woningfoto/i);
  });

  test("sitemap is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });

  test("manifest.json is accessible", async ({ page }) => {
    const response = await page.goto("/manifest.json");
    expect(response?.status()).toBe(200);
  });
});
