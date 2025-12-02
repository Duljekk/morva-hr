import { test, expect } from '@playwright/test';

/**
 * Test suite for Announcement Bottom Sheet dynamic height feature
 * Verifies that the text container adapts its height based on content length
 */
test.describe('Announcement Bottom Sheet - Dynamic Height', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Wait for login form to be visible
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
    
    // Fill in credentials
    await page.fill('input[type="text"]', 'Lorem');
    await page.fill('input[type="password"]', 'loremipsum');
    
    // Click login button
    await page.click('button:has-text("Log In")');
    
    // Wait for navigation to home page
    await page.waitForURL('**/', { timeout: 10000 });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for announcements to load
    await page.waitForTimeout(2000);
  });

  test('should adapt text container height based on content length', async ({ page }) => {
    // Wait for announcement banner to appear - look for div with "Moving Out Day" text and cursor-pointer
    const announcementBanner = page.locator('div[cursor="pointer"]:has-text("Moving Out Day"), div.cursor-pointer:has-text("Moving Out Day")').first();
    await announcementBanner.waitFor({ timeout: 15000 });
    
    // Ensure we're on the home page
    await page.waitForURL('**/', { timeout: 5000 });
    
    // Click on announcement banner to open bottom sheet
    await announcementBanner.click({ force: true });
    
    // Wait for bottom sheet to appear - look for the rounded top corners
    const bottomSheet = page.locator('div[class*="rounded-t-3xl"]:has-text("Moving Out Day")').first();
    await bottomSheet.waitFor({ timeout: 10000, state: 'visible' });
    
    // Find the body text paragraph
    const bodyText = bottomSheet.locator('p.text-base.font-normal.text-neutral-500').first();
    await expect(bodyText).toBeVisible();
    
    // Get initial height of the text container
    const initialHeight = await bodyText.boundingBox();
    expect(initialHeight).not.toBeNull();
    expect(initialHeight!.height).toBeGreaterThan(0);
    
    // Verify text is visible and contains content
    const textContent = await bodyText.textContent();
    expect(textContent).toBeTruthy();
    expect(textContent!.length).toBeGreaterThan(0);
    
    // Check that text has proper styling for dynamic height
    const styles = await bodyText.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        whiteSpace: computed.whiteSpace,
        wordBreak: computed.wordBreak,
        width: computed.width,
      };
    });
    
    // Verify text wrapping is enabled
    expect(styles.whiteSpace).toBe('normal');
    expect(styles.width).not.toBe('auto');
    
    // Verify the text container adapts to content
    // The height should be greater than a single line
    const lineHeight = await bodyText.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).lineHeight);
    });
    
    // If content is long enough, height should be more than one line
    if (textContent && textContent.length > 100) {
      expect(initialHeight!.height).toBeGreaterThan(lineHeight);
    }
  });

  test('should maintain text container visibility and height after interactions', async ({ page }) => {
    // Wait for announcement banner - look for div with "Moving Out Day" text and cursor-pointer
    const announcementBanner = page.locator('div[cursor="pointer"]:has-text("Moving Out Day"), div.cursor-pointer:has-text("Moving Out Day")').first();
    await announcementBanner.waitFor({ timeout: 15000 });
    
    // Ensure we're on the home page
    await page.waitForURL('**/', { timeout: 5000 });
    
    // Click to open bottom sheet
    await announcementBanner.click({ force: true });
    
    // Wait for bottom sheet
    const bottomSheet = page.locator('div[class*="rounded-t-3xl"]:has-text("Moving Out Day")').first();
    await bottomSheet.waitFor({ timeout: 10000, state: 'visible' });
    
    // Get the body text element
    const bodyText = bottomSheet.locator('p.text-base.font-normal.text-neutral-500').first();
    await bodyText.waitFor({ timeout: 5000 });
    
    // Get initial state height
    const initialHeight = await bodyText.boundingBox();
    expect(initialHeight).not.toBeNull();
    expect(initialHeight!.height).toBeGreaterThan(0);
    
    // Verify text content is visible and has content
    const textContent = await bodyText.textContent();
    expect(textContent).toBeTruthy();
    expect(textContent!.length).toBeGreaterThan(0);
    
    // Verify the text container has proper styling for dynamic height
    const styles = await bodyText.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        whiteSpace: computed.whiteSpace,
        wordBreak: computed.wordBreak,
        width: computed.width,
        height: computed.height,
      };
    });
    
    // Verify text wrapping is enabled
    expect(styles.whiteSpace).toBe('normal');
    expect(styles.width).not.toBe('auto');
    
    // For long content, verify height adapts (more than one line)
    if (textContent && textContent.length > 100) {
      const lineHeight = await bodyText.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).lineHeight);
      });
      // Height should be more than one line for long content
      expect(initialHeight!.height).toBeGreaterThan(lineHeight);
    }
    
    // Verify text remains visible and accessible
    await expect(bodyText).toBeVisible();
    const finalTextContent = await bodyText.textContent();
    expect(finalTextContent).toBe(textContent);
  });

  test('should wrap long text content correctly', async ({ page }) => {
    // Wait for announcement banner - look for div with "Moving Out Day" text and cursor-pointer
    const announcementBanner = page.locator('div[cursor="pointer"]:has-text("Moving Out Day"), div.cursor-pointer:has-text("Moving Out Day")').first();
    await announcementBanner.waitFor({ timeout: 15000 });
    
    // Ensure we're on the home page
    await page.waitForURL('**/', { timeout: 5000 });
    
    // Click to open bottom sheet
    await announcementBanner.click({ force: true });
    
    // Wait for bottom sheet
    const bottomSheet = page.locator('div[class*="rounded-t-3xl"]:has-text("Moving Out Day")').first();
    await bottomSheet.waitFor({ timeout: 10000, state: 'visible' });
    
    // Find body text
    const bodyText = bottomSheet.locator('p.text-base.font-normal.text-neutral-500').first();
    await expect(bodyText).toBeVisible();
    
    // Get text content
    const textContent = await bodyText.textContent();
    expect(textContent).toBeTruthy();
    
    // Verify text wrapping properties
    const computedStyles = await bodyText.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        whiteSpace: style.whiteSpace,
        wordBreak: style.wordBreak,
        overflowWrap: style.overflowWrap,
        width: style.width,
      };
    });
    
    // Verify wrapping is enabled
    expect(computedStyles.whiteSpace).toBe('normal');
    
    // Get bounding box to verify text is contained
    const boundingBox = await bodyText.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
    
    // Verify text doesn't overflow horizontally
    const textWidth = await bodyText.evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = range.getClientRects();
      let maxWidth = 0;
      for (let i = 0; i < rects.length; i++) {
        maxWidth = Math.max(maxWidth, rects[i].width);
      }
      return maxWidth;
    });
    
    // Text width should not exceed container width significantly
    if (boundingBox) {
      expect(textWidth).toBeLessThanOrEqual(boundingBox.width + 10); // Allow small margin for rounding
    }
  });
});
