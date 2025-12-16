import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Mock authentication or use a test user session
        // For now, assuming we can bypass or are already logged in via global setup
        await page.goto('/');
    });

    test('should navigate to Shop page', async ({ page }) => {
        await page.click('text=Shop');
        await expect(page).toHaveURL('/shop');
        await expect(page.locator('h1')).toContainText('Shop');
    });

    test('should navigate to Analytics page', async ({ page }) => {
        await page.click('text=Stats');
        await expect(page).toHaveURL('/analytics');
        await expect(page.locator('h1')).toContainText('Analytics');
    });

    test('should show skeleton on load', async ({ page }) => {
        // Reload to trigger initial load state
        await page.reload();
        // Check for skeleton class presence
        const skeleton = page.locator('.animate-pulse-subtle').first();
        await expect(skeleton).toBeVisible();
    });
});
