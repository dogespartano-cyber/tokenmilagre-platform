/**
 * E2E Tests - Search & Filtering
 * Tests search functionality, filters, and combined filter scenarios
 */

import { test, expect } from '../fixtures/auth'
import { ArticleListPage } from '../pages/ArticleListPage'
import { ArticleFormPage } from '../pages/ArticleFormPage'

test.describe('Search Functionality', () => {
  let listPage: ArticleListPage
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    formPage = new ArticleFormPage(page)

    await listPage.goto()
    await listPage.waitForLoad()

    // Create test articles with distinct titles
    const testArticles = [
      { title: 'Bitcoin Price Analysis 2024', type: 'NEWS', status: 'PUBLISHED' },
      { title: 'Ethereum Smart Contracts Guide', type: 'EDUCATIONAL', status: 'PUBLISHED' },
      { title: 'DeFi Protocols Overview', type: 'RESOURCE', status: 'DRAFT' },
    ]

    for (const article of testArticles) {
      await listPage.clickCreateButton()
      await formPage.createArticle({
        title: article.title,
        content: '<p>Test content</p>',
        type: article.type,
        status: article.status,
        categoryId: 'cat-test',
      })
      await listPage.goto()
      await listPage.waitForLoad()
    }
  })

  test('should search articles by title', async ({ page }) => {
    // Search for "Bitcoin"
    await listPage.searchArticles('Bitcoin')

    // Should show only Bitcoin article
    await listPage.assertArticleExists('Bitcoin Price Analysis 2024')
    await listPage.assertArticleNotExists('Ethereum Smart Contracts Guide')
    await listPage.assertArticleNotExists('DeFi Protocols Overview')

    // Result count should be 1
    const count = await listPage.getArticleCount()
    expect(count).toBe(1)
  })

  test('should search with partial match', async ({ page }) => {
    // Search for "Guide"
    await listPage.searchArticles('Guide')

    // Should show Ethereum article
    await listPage.assertArticleExists('Ethereum Smart Contracts Guide')

    const count = await listPage.getArticleCount()
    expect(count).toBe(1)
  })

  test('should be case-insensitive', async ({ page }) => {
    // Search with lowercase
    await listPage.searchArticles('bitcoin')

    // Should still find Bitcoin article
    await listPage.assertArticleExists('Bitcoin Price Analysis 2024')
  })

  test('should show empty state for no results', async ({ page }) => {
    // Search for non-existent term
    await listPage.searchArticles('NonExistentTerm12345')

    // Empty state should appear
    const emptyState = page.locator('[data-testid="articles-empty-state"]')
    await expect(emptyState).toBeVisible()
    await expect(emptyState).toContainText('No articles found')

    // Article count should be 0
    const count = await listPage.getArticleCount()
    expect(count).toBe(0)
  })

  test('should clear search with clear button', async ({ page }) => {
    // Search for something
    await listPage.searchArticles('Bitcoin')

    const countAfterSearch = await listPage.getArticleCount()
    expect(countAfterSearch).toBe(1)

    // Clear search
    const clearButton = page.locator('[data-testid="search-clear-button"]')
    await clearButton.click()

    // Should show all articles again
    await listPage.waitForLoad()
    const countAfterClear = await listPage.getArticleCount()
    expect(countAfterClear).toBeGreaterThan(1)
  })

  test('should debounce search input', async ({ page }) => {
    const searchInput = listPage.searchInput

    // Type quickly
    await searchInput.fill('B')
    await searchInput.fill('Bi')
    await searchInput.fill('Bit')
    await searchInput.fill('Bitc')
    await searchInput.fill('Bitco')
    await searchInput.fill('Bitcoin')

    // Wait for debounce (typically 300-500ms)
    await page.waitForTimeout(600)

    // Should only have made one search request after debounce
    await listPage.assertArticleExists('Bitcoin Price Analysis 2024')
  })

  test('should show loading state during search', async ({ page }) => {
    const searchInput = listPage.searchInput

    await searchInput.fill('Ethereum')

    // Loading indicator should appear briefly
    const loadingIndicator = page.locator('[data-testid="search-loading"]')
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // Wait for results
    await listPage.waitForLoad()

    // Loading should disappear
    await expect(loadingIndicator).not.toBeVisible()
  })
})

test.describe('Filter by Type', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should filter articles by NEWS type', async ({ page }) => {
    await listPage.filterByType('NEWS')

    // All visible articles should be NEWS type
    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const typeLabel = article.locator('[data-testid="article-type"]')
      await expect(typeLabel).toContainText('NEWS')
    }
  })

  test('should filter articles by EDUCATIONAL type', async ({ page }) => {
    await listPage.filterByType('EDUCATIONAL')

    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const typeLabel = article.locator('[data-testid="article-type"]')
      await expect(typeLabel).toContainText('EDUCATIONAL')
    }
  })

  test('should filter articles by RESOURCE type', async ({ page }) => {
    await listPage.filterByType('RESOURCE')

    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const typeLabel = article.locator('[data-testid="article-type"]')
      await expect(typeLabel).toContainText('RESOURCE')
    }
  })

  test('should show all types when filter is cleared', async ({ page }) => {
    // Apply filter
    await listPage.filterByType('NEWS')
    const countFiltered = await listPage.getArticleCount()

    // Clear filter
    await listPage.filterByType('ALL')

    // Should show more articles
    const countAll = await listPage.getArticleCount()
    expect(countAll).toBeGreaterThanOrEqual(countFiltered)
  })

  test('should update URL with type filter', async ({ page }) => {
    await listPage.filterByType('NEWS')

    // URL should include type parameter
    await expect(page).toHaveURL(/[?&]type=NEWS/)
  })
})

test.describe('Filter by Status', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should filter articles by PUBLISHED status', async ({ page }) => {
    await listPage.filterByStatus('PUBLISHED')

    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const statusBadge = article.locator('[data-testid="article-status"]')
      await expect(statusBadge).toContainText('PUBLISHED')
    }
  })

  test('should filter articles by DRAFT status', async ({ page }) => {
    await listPage.filterByStatus('DRAFT')

    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const statusBadge = article.locator('[data-testid="article-status"]')
      await expect(statusBadge).toContainText('DRAFT')
    }
  })

  test('should filter articles by ARCHIVED status', async ({ page }) => {
    await listPage.filterByStatus('ARCHIVED')

    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const statusBadge = article.locator('[data-testid="article-status"]')
      await expect(statusBadge).toContainText('ARCHIVED')
    }
  })

  test('should update URL with status filter', async ({ page }) => {
    await listPage.filterByStatus('DRAFT')

    await expect(page).toHaveURL(/[?&]status=DRAFT/)
  })
})

test.describe('Combined Filters', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should combine search with type filter', async ({ page }) => {
    await listPage.searchArticles('Bitcoin')
    await listPage.filterByType('NEWS')

    // Should show only NEWS articles matching "Bitcoin"
    await listPage.assertArticleExists('Bitcoin Price Analysis 2024')

    // URL should have both parameters
    await expect(page).toHaveURL(/[?&]search=Bitcoin/)
    await expect(page).toHaveURL(/[?&]type=NEWS/)
  })

  test('should combine type and status filters', async ({ page }) => {
    await listPage.filterByType('EDUCATIONAL')
    await listPage.filterByStatus('PUBLISHED')

    // All visible articles should be EDUCATIONAL and PUBLISHED
    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const typeLabel = article.locator('[data-testid="article-type"]')
      const statusBadge = article.locator('[data-testid="article-status"]')

      await expect(typeLabel).toContainText('EDUCATIONAL')
      await expect(statusBadge).toContainText('PUBLISHED')
    }
  })

  test('should combine all three filters (search + type + status)', async ({ page }) => {
    await listPage.searchArticles('Guide')
    await listPage.filterByType('EDUCATIONAL')
    await listPage.filterByStatus('PUBLISHED')

    // Should show very specific results
    const count = await listPage.getArticleCount()
    expect(count).toBeLessThanOrEqual(1)

    // URL should have all parameters
    await expect(page).toHaveURL(/[?&]search=Guide/)
    await expect(page).toHaveURL(/[?&]type=EDUCATIONAL/)
    await expect(page).toHaveURL(/[?&]status=PUBLISHED/)
  })

  test('should clear all filters with reset button', async ({ page }) => {
    // Apply multiple filters
    await listPage.searchArticles('Bitcoin')
    await listPage.filterByType('NEWS')
    await listPage.filterByStatus('PUBLISHED')

    const countFiltered = await listPage.getArticleCount()

    // Clear all filters
    const clearFiltersButton = page.locator('[data-testid="clear-filters-button"]')
    await clearFiltersButton.click()

    // Should show all articles
    await listPage.waitForLoad()
    const countAll = await listPage.getArticleCount()
    expect(countAll).toBeGreaterThanOrEqual(countFiltered)

    // URL should be clean
    await expect(page).toHaveURL(/^\/articles(\?.*)?$/)
    await expect(page).not.toHaveURL(/search=/)
    await expect(page).not.toHaveURL(/type=/)
    await expect(page).not.toHaveURL(/status=/)
  })
})

test.describe('Filter UI/UX', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should show active filter indicators', async ({ page }) => {
    await listPage.filterByType('NEWS')

    // Filter badge should show active state
    const typeFilterBadge = page.locator('[data-testid="active-filter-type"]')
    await expect(typeFilterBadge).toBeVisible()
    await expect(typeFilterBadge).toContainText('NEWS')
  })

  test('should show result count after filtering', async ({ page }) => {
    await listPage.filterByStatus('PUBLISHED')

    const resultCount = page.locator('[data-testid="filter-result-count"]')
    await expect(resultCount).toBeVisible()
    await expect(resultCount).toContainText(/\d+ results?/)
  })

  test('should persist filters on page reload', async ({ page }) => {
    await listPage.searchArticles('Bitcoin')
    await listPage.filterByType('NEWS')

    // Reload page
    await page.reload()
    await listPage.waitForLoad()

    // Filters should still be applied
    await expect(page).toHaveURL(/search=Bitcoin/)
    await expect(page).toHaveURL(/type=NEWS/)

    // Search input should have value
    const searchValue = await listPage.searchInput.inputValue()
    expect(searchValue).toBe('Bitcoin')

    // Type filter should be active
    const typeFilter = page.locator('[data-testid="type-filter"]')
    await expect(typeFilter).toHaveValue('NEWS')
  })

  test('should show "Clear filters" button only when filters are active', async ({ page }) => {
    const clearButton = page.locator('[data-testid="clear-filters-button"]')

    // Initially hidden
    await expect(clearButton).not.toBeVisible()

    // Apply filter
    await listPage.filterByType('NEWS')

    // Should appear
    await expect(clearButton).toBeVisible()

    // Clear filters
    await clearButton.click()

    // Should hide again
    await expect(clearButton).not.toBeVisible()
  })

  test('should handle rapid filter changes', async ({ page }) => {
    // Rapidly change filters
    await listPage.filterByType('NEWS')
    await listPage.filterByType('EDUCATIONAL')
    await listPage.filterByType('RESOURCE')
    await listPage.filterByType('NEWS')

    // Wait for debounce
    await listPage.waitForLoad()

    // Should show correct results
    const articles = await page.locator('[data-testid="article-card"]').all()

    for (const article of articles) {
      const typeLabel = article.locator('[data-testid="article-type"]')
      await expect(typeLabel).toContainText('NEWS')
    }
  })
})

test.describe('Filter Accessibility', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should be keyboard navigable', async ({ page }) => {
    // Tab to search input
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Type search
    await page.keyboard.type('Bitcoin')
    await page.keyboard.press('Enter')

    // Should perform search
    await listPage.waitForLoad()
    await listPage.assertArticleExists('Bitcoin Price Analysis 2024')
  })

  test('should have ARIA labels on filter controls', async ({ page }) => {
    const searchInput = listPage.searchInput
    const typeFilter = page.locator('[data-testid="type-filter"]')
    const statusFilter = page.locator('[data-testid="status-filter"]')

    await expect(searchInput).toHaveAttribute('aria-label', /search/i)
    await expect(typeFilter).toHaveAttribute('aria-label', /filter by type/i)
    await expect(statusFilter).toHaveAttribute('aria-label', /filter by status/i)
  })

  test('should announce filter results to screen readers', async ({ page }) => {
    await listPage.filterByType('NEWS')

    // Live region should announce results
    const liveRegion = page.locator('[aria-live="polite"]')
    await expect(liveRegion).toBeVisible()
    await expect(liveRegion).toContainText(/\d+ articles? found/i)
  })
})
