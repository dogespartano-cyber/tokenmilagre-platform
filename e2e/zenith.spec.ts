import { test, expect } from '@playwright/test';

test.describe('Zenith Market Ticker', () => {
    test.beforeEach(async ({ page }) => {
        // Assuming the ticker is on the home page
        await page.goto('/');
        // Wait for client-side hydration
        await page.waitForLoadState('networkidle');
    });

    test('should display all 4 market cards', async ({ page }) => {
        // Check for the presence of the 4 main cards
        await expect(page.getByText('Capitalização')).toBeVisible();
        await expect(page.getByText('Volume 24h')).toBeVisible();
        await expect(page.getByText('Dominância BTC')).toBeVisible();
        await expect(page.getByText('Dominância ETH')).toBeVisible();
    });

    test('should reveal definition on hover/interaction', async ({ page }) => {
        // Hover over Market Cap card to trigger flip/reveal
        // Note: implementation details of FlipCard might require clicking or hovering specific elements
        // For this test we assume interaction reveals text.
        const capCard = page.getByText('Capitalização').first();
        await capCard.hover();

        // Check if description text appears (desktop text)
        // "Valor total de mercado de todas as criptomoedas..."
        const description = page.getByText(/Valor total de mercado/);
        if (await description.isVisible()) {
            await expect(description).toBeVisible();
        } else {
            // Fallback for click interaction if hover isn't enough/mobile view
            await capCard.click();
            await expect(description).toBeVisible();
        }
    });

    test('should verify value formatting', async ({ page }) => {
        // Check that we have values formatted with $, T, B, M or %
        // We look for elements that typically hold these values
        await expect(page.getByText(/\$[0-9.]+T|B|M/)).toBeVisible(); // Market Cap or Volume
        await expect(page.getByText(/[0-9.]+%$/)).toBeVisible(); // Dominance
    });
});
