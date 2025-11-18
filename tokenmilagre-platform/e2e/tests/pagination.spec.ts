/**
 * E2E Tests - Pagination
 * Tests pagination functionality, navigation, and edge cases
 */

import { test, expect } from '../fixtures/auth'
import { ArticleListPage } from '../pages/ArticleListPage'
import { ArticleFormPage } from '../pages/ArticleFormPage'

test.describe('Pagination - Navigation', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should navigate to next page', async ({ page }) => {
    // Click next page button
    const nextButton = page.locator('[data-testid="pagination-next"]')
    await nextButton.click()

    // Wait for load
    await listPage.waitForLoad()

    // URL should update
    await expect(page).toHaveURL(/[?&]page=2/)

    // Page indicator should show page 2
    const pageIndicator = page.locator('[data-testid="current-page"]')
    await expect(pageIndicator).toContainText('2')
  })

  test('should navigate to previous page', async ({ page }) => {
    // Go to page 2 first
    await listPage.goToPage(2)

    // Click previous button
    const prevButton = page.locator('[data-testid="pagination-prev"]')
    await prevButton.click()

    await listPage.waitForLoad()

    // Should be on page 1
    await expect(page).toHaveURL(/page=1|^\/articles$/)

    const pageIndicator = page.locator('[data-testid="current-page"]')
    await expect(pageIndicator).toContainText('1')
  })

  test('should navigate to specific page number', async ({ page }) => {
    // Click page 3 button
    const page3Button = page.locator('[data-testid="pagination-page-3"]')
    await page3Button.click()

    await listPage.waitForLoad()

    // Should be on page 3
    await expect(page).toHaveURL(/page=3/)

    const pageIndicator = page.locator('[data-testid="current-page"]')
    await expect(pageIndicator).toContainText('3')
  })

  test('should navigate to first page', async ({ page }) => {
    // Go to page 5
    await listPage.goToPage(5)

    // Click first page button
    const firstButton = page.locator('[data-testid="pagination-first"]')
    await firstButton.click()

    await listPage.waitForLoad()

    // Should be on page 1
    await expect(page).toHaveURL(/page=1|^\/articles$/)
  })

  test('should navigate to last page', async ({ page }) => {
    // Click last page button
    const lastButton = page.locator('[data-testid="pagination-last"]')
    await lastButton.click()

    await listPage.waitForLoad()

    // Should be on last page
    const pageIndicator = page.locator('[data-testid="current-page"]')
    const totalPages = page.locator('[data-testid="total-pages"]')

    const currentPage = await pageIndicator.textContent()
    const total = await totalPages.textContent()

    expect(currentPage).toBe(total)
  })

  test('should disable prev button on first page', async ({ page }) => {
    // Go to page 1 (or already there)
    await listPage.goToPage(1)

    const prevButton = page.locator('[data-testid="pagination-prev"]')
    await expect(prevButton).toBeDisabled()

    const firstButton = page.locator('[data-testid="pagination-first"]')
    await expect(firstButton).toBeDisabled()
  })

  test('should disable next button on last page', async ({ page }) => {
    // Go to last page
    const lastButton = page.locator('[data-testid="pagination-last"]')
    await lastButton.click()
    await listPage.waitForLoad()

    const nextButton = page.locator('[data-testid="pagination-next"]')
    await expect(nextButton).toBeDisabled()

    await expect(lastButton).toBeDisabled()
  })
})

test.describe('Pagination - Items Per Page', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should change items per page to 10', async ({ page }) => {
    // Select 10 items per page
    const limitSelect = page.locator('[data-testid="pagination-limit"]')
    await limitSelect.selectOption('10')

    await listPage.waitForLoad()

    // URL should update
    await expect(page).toHaveURL(/limit=10/)

    // Should show max 10 articles
    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(10)
  })

  test('should change items per page to 25', async ({ page }) => {
    const limitSelect = page.locator('[data-testid="pagination-limit"]')
    await limitSelect.selectOption('25')

    await listPage.waitForLoad()

    await expect(page).toHaveURL(/limit=25/)

    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(25)
  })

  test('should change items per page to 50', async ({ page }) => {
    const limitSelect = page.locator('[data-testid="pagination-limit"]')
    await limitSelect.selectOption('50')

    await listPage.waitForLoad()

    await expect(page).toHaveURL(/limit=50/)

    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(50)
  })

  test('should reset to page 1 when changing items per page', async ({ page }) => {
    // Go to page 3
    await listPage.goToPage(3)

    // Change items per page
    const limitSelect = page.locator('[data-testid="pagination-limit"]')
    await limitSelect.selectOption('25')

    await listPage.waitForLoad()

    // Should be back on page 1
    await expect(page).toHaveURL(/page=1|^\/articles\?limit=25$/)
  })

  test('should persist items per page across navigation', async ({ page }) => {
    // Set to 10 items per page
    const limitSelect = page.locator('[data-testid="pagination-limit"]')
    await limitSelect.selectOption('10')
    await listPage.waitForLoad()

    // Navigate to page 2
    await listPage.goToPage(2)

    // Should still have limit=10
    await expect(page).toHaveURL(/limit=10/)
    await expect(page).toHaveURL(/page=2/)

    // Should still show max 10 items
    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(10)
  })
})

test.describe('Pagination - URL Parameters', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
  })

  test('should load correct page from URL parameter', async ({ page }) => {
    // Navigate directly to page 3
    await page.goto('/articles?page=3')
    await listPage.waitForLoad()

    const pageIndicator = page.locator('[data-testid="current-page"]')
    await expect(pageIndicator).toContainText('3')
  })

  test('should load correct limit from URL parameter', async ({ page }) => {
    await page.goto('/articles?limit=25')
    await listPage.waitForLoad()

    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(25)

    const limitSelect = page.locator('[data-testid="pagination-limit"]')
    await expect(limitSelect).toHaveValue('25')
  })

  test('should handle both page and limit parameters', async ({ page }) => {
    await page.goto('/articles?page=2&limit=10')
    await listPage.waitForLoad()

    const pageIndicator = page.locator('[data-testid="current-page"]')
    await expect(pageIndicator).toContainText('2')

    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(10)
  })

  test('should handle invalid page parameter gracefully', async ({ page }) => {
    // Navigate to invalid page
    await page.goto('/articles?page=999')
    await listPage.waitForLoad()

    // Should redirect to page 1 or show empty state
    const pageIndicator = page.locator('[data-testid="current-page"]')
    const currentPage = await pageIndicator.textContent()

    // Should be on valid page
    expect(parseInt(currentPage || '1')).toBeGreaterThan(0)
  })

  test('should handle invalid limit parameter gracefully', async ({ page }) => {
    await page.goto('/articles?limit=1000')
    await listPage.waitForLoad()

    // Should use default or max limit
    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(100) // Max limit
  })
})

test.describe('Pagination - Info Display', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should display total count', async ({ page }) => {
    const totalCount = page.locator('[data-testid="total-articles-count"]')
    await expect(totalCount).toBeVisible()
    await expect(totalCount).toContainText(/\d+ total/)
  })

  test('should display range of current items', async ({ page }) => {
    const rangeInfo = page.locator('[data-testid="pagination-range"]')
    await expect(rangeInfo).toBeVisible()

    // Should show something like "1-20 of 100"
    await expect(rangeInfo).toContainText(/\d+-\d+ of \d+/)
  })

  test('should update range info when navigating', async ({ page }) => {
    const rangeInfo = page.locator('[data-testid="pagination-range"]')

    const rangePage1 = await rangeInfo.textContent()

    // Go to page 2
    await listPage.goToPage(2)

    const rangePage2 = await rangeInfo.textContent()

    // Ranges should be different
    expect(rangePage1).not.toBe(rangePage2)
  })

  test('should show correct page numbers in pagination controls', async ({ page }) => {
    // Should show page numbers like: 1 2 3 ... 10
    const pageNumbers = page.locator('[data-testid^="pagination-page-"]')

    const count = await pageNumbers.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should highlight current page', async ({ page }) => {
    await listPage.goToPage(2)

    const page2Button = page.locator('[data-testid="pagination-page-2"]')
    await expect(page2Button).toHaveClass(/active|current/)
  })
})

test.describe('Pagination - Loading States', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should show loading state when changing pages', async ({ page }) => {
    const nextButton = page.locator('[data-testid="pagination-next"]')
    await nextButton.click()

    // Loading indicator should appear
    const loading = page.locator('[data-testid="article-list-loading"]')
    await expect(loading).toBeVisible({ timeout: 1000 })

    // Wait for load
    await listPage.waitForLoad()

    // Loading should disappear
    await expect(loading).not.toBeVisible()
  })

  test('should disable pagination controls during loading', async ({ page }) => {
    const nextButton = page.locator('[data-testid="pagination-next"]')

    await nextButton.click()

    // Buttons should be disabled during load
    await expect(nextButton).toBeDisabled()

    const prevButton = page.locator('[data-testid="pagination-prev"]')
    await expect(prevButton).toBeDisabled()

    // Wait for load
    await listPage.waitForLoad()

    // Should be enabled again
    await expect(prevButton).toBeEnabled()
  })

  test('should maintain scroll position or scroll to top', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))

    const scrollBefore = await page.evaluate(() => window.scrollY)
    expect(scrollBefore).toBeGreaterThan(0)

    // Change page
    await listPage.goToPage(2)

    // Should scroll to top on new page
    const scrollAfter = await page.evaluate(() => window.scrollY)
    expect(scrollAfter).toBe(0)
  })
})

test.describe('Pagination - Edge Cases', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
  })

  test('should handle single page of results', async ({ page }) => {
    // Mock API to return few results
    await page.route('**/api/v2/articles*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          articles: [{ id: '1', title: 'Article 1' }],
          pagination: {
            total: 1,
            page: 1,
            limit: 20,
            totalPages: 1,
          },
        }),
      })
    })

    await listPage.goto()
    await listPage.waitForLoad()

    // Pagination controls should be hidden or disabled
    const nextButton = page.locator('[data-testid="pagination-next"]')
    const prevButton = page.locator('[data-testid="pagination-prev"]')

    await expect(nextButton).toBeDisabled()
    await expect(prevButton).toBeDisabled()
  })

  test('should handle empty results', async ({ page }) => {
    await page.route('**/api/v2/articles*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          articles: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
          },
        }),
      })
    })

    await listPage.goto()
    await listPage.waitForLoad()

    // Should show empty state
    const emptyState = page.locator('[data-testid="articles-empty-state"]')
    await expect(emptyState).toBeVisible()

    // Pagination should be hidden
    const pagination = page.locator('[data-testid="pagination"]')
    await expect(pagination).not.toBeVisible()
  })

  test('should handle pagination with filters', async ({ page }) => {
    await listPage.goto()
    await listPage.waitForLoad()

    // Apply filter
    await listPage.filterByType('NEWS')

    // Navigate to page 2
    await listPage.goToPage(2)

    // URL should have both filter and page
    await expect(page).toHaveURL(/type=NEWS/)
    await expect(page).toHaveURL(/page=2/)

    // Filtered results should be paginated correctly
    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const typeLabel = article.locator('[data-testid="article-type"]')
      await expect(typeLabel).toContainText('NEWS')
    }
  })

  test('should reset to page 1 when filter changes', async ({ page }) => {
    await listPage.goto()
    await listPage.waitForLoad()

    // Go to page 3
    await listPage.goToPage(3)

    // Apply filter
    await listPage.filterByType('NEWS')

    // Should be back on page 1
    await expect(page).toHaveURL(/page=1|^\/articles\?type=NEWS$/)
  })
})

test.describe('Pagination - Performance', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should paginate quickly (<2 seconds per page)', async ({ page }) => {
    const startTime = Date.now()

    await listPage.goToPage(2)

    const endTime = Date.now()
    const duration = endTime - startTime

    expect(duration).toBeLessThan(2000)
  })

  test('should cache previous pages for fast navigation', async ({ page }) => {
    // Go to page 2
    await listPage.goToPage(2)
    await listPage.waitForLoad()

    // Go back to page 1
    const startTime = Date.now()
    await listPage.goToPage(1)
    const endTime = Date.now()

    // Should be fast (cached)
    const duration = endTime - startTime
    expect(duration).toBeLessThan(1000)
  })
})

test.describe('Pagination - Accessibility', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should be keyboard navigable', async ({ page }) => {
    // Tab to pagination controls
    const nextButton = page.locator('[data-testid="pagination-next"]')
    await nextButton.focus()

    // Press Enter to navigate
    await page.keyboard.press('Enter')

    await listPage.waitForLoad()

    // Should be on page 2
    await expect(page).toHaveURL(/page=2/)
  })

  test('should have ARIA labels on pagination controls', async ({ page }) => {
    const nextButton = page.locator('[data-testid="pagination-next"]')
    const prevButton = page.locator('[data-testid="pagination-prev"]')
    const firstButton = page.locator('[data-testid="pagination-first"]')
    const lastButton = page.locator('[data-testid="pagination-last"]')

    await expect(nextButton).toHaveAttribute('aria-label', /next page/i)
    await expect(prevButton).toHaveAttribute('aria-label', /previous page/i)
    await expect(firstButton).toHaveAttribute('aria-label', /first page/i)
    await expect(lastButton).toHaveAttribute('aria-label', /last page/i)
  })

  test('should announce page changes to screen readers', async ({ page }) => {
    await listPage.goToPage(2)

    // Live region should announce page change
    const liveRegion = page.locator('[aria-live="polite"]')
    await expect(liveRegion).toContainText(/page 2/i)
  })

  test('should have current page marked for screen readers', async ({ page }) => {
    const currentPage = page.locator('[data-testid="pagination-page-1"]')
    await expect(currentPage).toHaveAttribute('aria-current', 'page')
  })
})
