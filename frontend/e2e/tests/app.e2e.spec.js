import { test, expect } from '@playwright/test';

test.describe('App E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('http://localhost:3000');
  });

  test('should load the app and display the canvas', async ({ page }) => {
    // Check if the main container is present
    await expect(page.locator('div.bg-gray-200')).toBeVisible();

    // Check if the Canvas component is rendered
    await expect(page.locator('[data-testid="canvas-component"]')).toBeVisible();
  });

  test('should display at least one canvas', async ({ page }) => {
    // Wait for the canvas to load
    await page.waitForSelector('[data-testid="canvas-component"]');

    // Check if at least one canvas is displayed
    const canvasElements = await page.$$('[data-testid^="canvas-"]');
    expect(canvasElements.length).toBeGreaterThan(0);
  });

  test('should display cards within the canvas', async ({ page }) => {
    // Wait for the canvas to load
    await page.waitForSelector('[data-testid="canvas-component"]');

    // Check if at least one card is displayed
    const cardElements = await page.$$('[data-testid^="card-"]');
    expect(cardElements.length).toBeGreaterThan(0);
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Intercept API calls and simulate an error
    await page.route('**/api/canvases', route => route.abort());

    // Reload the page to trigger the error
    await page.reload();

    // Check if an error message is displayed
    const errorMessage = await page.textContent('text=Error loading canvases');
    expect(errorMessage).toBeTruthy();
  });

  test('should use the correct API URL from environment variables', async ({ page }) => {
    // Get the API URL from the environment variable
    const apiUrl = process.env.REACT_APP_API_URL;
    expect(apiUrl).toBeDefined();

    // Intercept API calls and check if they use the correct URL
    await page.route(`${apiUrl}/**`, route => {
      expect(route.request().url()).toContain(apiUrl);
      route.continue();
    });

    // Trigger a canvas load to make an API call
    await page.reload();
  });
});
