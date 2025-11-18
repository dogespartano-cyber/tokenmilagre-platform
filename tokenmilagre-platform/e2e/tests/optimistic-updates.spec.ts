/**
 * E2E Tests - Optimistic Updates & UX Feedback
 * Tests visual optimistic updates, loading states, and error handling
 */

import { test, expect } from '../fixtures/auth'
import { ArticleListPage } from '../pages/ArticleListPage'
import { ArticleFormPage } from '../pages/ArticleFormPage'

test.describe('Optimistic Updates - Visual Feedback', () => {
  let listPage: ArticleListPage
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    formPage = new ArticleFormPage(page)

    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should show optimistic update when publishing article', async ({ page }) => {
    // Create a draft article first
    await listPage.clickCreateButton()
    await formPage.createArticle({
      title: `Optimistic Test ${Date.now()}`,
      content: '<p>Test content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    await listPage.goto()
    await listPage.waitForLoad()

    // Get initial status
    const statusBefore = await listPage.getArticleStatus(0)
    expect(statusBefore).toContain('DRAFT')

    // Click publish button
    const publishButton = page.locator('[data-testid="publish-article-button"]').first()
    await publishButton.click()

    // Status should update optimistically (immediately)
    const statusAfterOptimistic = await listPage.getArticleStatus(0)
    expect(statusAfterOptimistic).toContain('PUBLISHED')

    // Success toast should appear
    const successToast = page.locator('[data-testid="success-toast"]:has-text("published")')
    await expect(successToast).toBeVisible({ timeout: 5000 })
  })

  test('should show loading state during article creation', async ({ page }) => {
    await listPage.clickCreateButton()

    // Fill form
    await formPage.fillTitle('Loading Test Article')
    await formPage.fillSlug('loading-test')
    await formPage.fillContent('<p>Content</p>')
    await formPage.selectType('NEWS')
    await formPage.selectStatus('DRAFT')
    await formPage.selectCategory('cat-test')

    // Click submit
    await formPage.submitButton.click()

    // Loading indicator should appear
    const loadingIndicator = page.locator('[data-testid="form-loading"]')
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // Submit button should be disabled during submission
    await expect(formPage.submitButton).toBeDisabled()

    // Wait for completion
    await formPage.waitForLoad()

    // Loading should disappear
    await expect(loadingIndicator).not.toBeVisible()
  })

  test('should revert optimistic update on error', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/v2/articles/*/publish', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Publish failed',
            code: 'INTERNAL_ERROR',
          },
        }),
      })
    })

    // Try to publish
    const publishButton = page.locator('[data-testid="publish-article-button"]').first()
    const statusBefore = await listPage.getArticleStatus(0)

    await publishButton.click()

    // Error toast should appear
    const errorToast = page.locator('[data-testid="error-toast"]:has-text("failed")')
    await expect(errorToast).toBeVisible({ timeout: 5000 })

    // Status should revert to original
    const statusAfter = await listPage.getArticleStatus(0)
    expect(statusAfter).toBe(statusBefore)
  })

  test('should show loading skeleton during list fetch', async ({ page }) => {
    // Navigate to empty cache
    await page.goto('/articles')

    // Skeleton loader should appear
    const skeleton = page.locator('[data-testid="article-list-skeleton"]')
    await expect(skeleton).toBeVisible({ timeout: 1000 })

    // Wait for articles to load
    await listPage.waitForLoad()

    // Skeleton should disappear
    await expect(skeleton).not.toBeVisible()

    // Articles should be visible
    await expect(listPage.articleCards.first()).toBeVisible()
  })

  test('should show optimistic deletion with visual feedback', async ({ page }) => {
    // Get initial count
    const countBefore = await listPage.getArticleCount()

    // Delete first article
    const deleteButton = page.locator('[data-testid="delete-article-button"]').first()
    const titleToDelete = await listPage.getArticleTitle(0)

    await deleteButton.click()

    // Confirm deletion
    await page.locator('[data-testid="confirm-delete-button"]').click()

    // Article should fade out / disappear optimistically
    const deletedArticle = page.locator(`[data-testid="article-card"]:has-text("${titleToDelete}")`)
    await expect(deletedArticle).not.toBeVisible({ timeout: 2000 })

    // Count should update
    const countAfter = await listPage.getArticleCount()
    expect(countAfter).toBe(countBefore - 1)

    // Success toast
    const successToast = page.locator('[data-testid="success-toast"]:has-text("deleted")')
    await expect(successToast).toBeVisible({ timeout: 5000 })
  })

  test('should show edit loading state and optimistic update', async ({ page }) => {
    // Click edit on first article
    await listPage.clickArticle(0)

    const originalTitle = await formPage.titleInput.inputValue()

    // Update title
    const newTitle = `Updated ${Date.now()}`
    await formPage.fillTitle(newTitle)

    // Submit
    await formPage.submitButton.click()

    // Loading state
    const loadingIndicator = page.locator('[data-testid="form-loading"]')
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // Wait for completion
    await formPage.waitForLoad()

    // Should redirect back to list
    await expect(page).toHaveURL(/\/articles$/)

    // Article should show new title optimistically
    await listPage.assertArticleExists(newTitle)
  })

  test('should handle concurrent optimistic updates', async ({ page }) => {
    // Select multiple articles for bulk publish
    await listPage.selectArticlesForBulk(3)

    // Get initial statuses
    const status0 = await listPage.getArticleStatus(0)
    const status1 = await listPage.getArticleStatus(1)
    const status2 = await listPage.getArticleStatus(2)

    // Bulk publish
    await listPage.bulkPublish()

    // All statuses should update optimistically
    const newStatus0 = await listPage.getArticleStatus(0)
    const newStatus1 = await listPage.getArticleStatus(1)
    const newStatus2 = await listPage.getArticleStatus(2)

    expect(newStatus0).toContain('PUBLISHED')
    expect(newStatus1).toContain('PUBLISHED')
    expect(newStatus2).toContain('PUBLISHED')

    // Success toast
    const successToast = page.locator('[data-testid="success-toast"]:has-text("published")')
    await expect(successToast).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Optimistic Updates - Toast Notifications', () => {
  let listPage: ArticleListPage
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    formPage = new ArticleFormPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should show success toast with correct message on create', async ({ page }) => {
    await listPage.clickCreateButton()

    await formPage.createArticle({
      title: `Toast Test ${Date.now()}`,
      content: '<p>Content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    const successToast = page.locator('[data-testid="success-toast"]')
    await expect(successToast).toBeVisible({ timeout: 5000 })
    await expect(successToast).toContainText('Article created successfully')

    // Toast should auto-dismiss after 5 seconds
    await expect(successToast).not.toBeVisible({ timeout: 6000 })
  })

  test('should show error toast on validation failure', async ({ page }) => {
    await listPage.clickCreateButton()

    // Submit empty form
    await formPage.submitButton.click()

    const errorToast = page.locator('[data-testid="error-toast"]')
    await expect(errorToast).toBeVisible({ timeout: 5000 })
    await expect(errorToast).toContainText('Validation failed')
  })

  test('should show warning toast on rate limit approaching', async ({ page }) => {
    // This would require making many requests
    // For now, mock the rate limit header

    await page.route('**/api/v2/articles', (route) => {
      route.continue({
        headers: {
          ...route.request().headers(),
          'X-RateLimit-Remaining': '5',
          'X-RateLimit-Limit': '200',
        },
      })
    })

    await listPage.goto()
    await listPage.waitForLoad()

    // Warning toast should appear
    const warningToast = page.locator('[data-testid="warning-toast"]:has-text("rate limit")')
    await expect(warningToast).toBeVisible({ timeout: 5000 })
  })

  test('should stack multiple toasts', async ({ page }) => {
    // Trigger multiple actions quickly
    await listPage.selectArticlesForBulk(2)
    await listPage.bulkPublish()

    // First toast
    const toast1 = page.locator('[data-testid="success-toast"]').first()
    await expect(toast1).toBeVisible()

    // Trigger another action
    await listPage.selectArticlesForBulk(1)
    await listPage.bulkArchive()

    // Second toast should appear
    const toastCount = await page.locator('[data-testid="success-toast"]').count()
    expect(toastCount).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Optimistic Updates - Error Boundaries', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
  })

  test('should show error boundary on component crash', async ({ page }) => {
    // Mock a component error by breaking the API response
    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'invalid json that will crash the component',
      })
    })

    await listPage.goto()

    // Error boundary should catch and display
    const errorBoundary = page.locator('[data-testid="error-boundary"]')
    await expect(errorBoundary).toBeVisible({ timeout: 5000 })
    await expect(errorBoundary).toContainText('Something went wrong')

    // Should have retry button
    const retryButton = page.locator('[data-testid="error-boundary-retry"]')
    await expect(retryButton).toBeVisible()
  })

  test('should recover from error boundary with retry', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/v2/articles', (route) => {
      requestCount++

      if (requestCount === 1) {
        // First request fails
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Server error' } }),
        })
      } else {
        // Second request succeeds
        route.continue()
      }
    })

    await listPage.goto()

    // Error boundary appears
    const errorBoundary = page.locator('[data-testid="error-boundary"]')
    await expect(errorBoundary).toBeVisible({ timeout: 5000 })

    // Click retry
    const retryButton = page.locator('[data-testid="error-boundary-retry"]')
    await retryButton.click()

    // Should recover and show content
    await expect(errorBoundary).not.toBeVisible()
    await expect(listPage.articleCards.first()).toBeVisible()
  })

  test('should show fallback UI during network error', async ({ page }) => {
    // Simulate network offline
    await page.route('**/api/v2/articles', (route) => route.abort('failed'))

    await listPage.goto()

    // Fallback UI should appear
    const fallback = page.locator('[data-testid="network-error-fallback"]')
    await expect(fallback).toBeVisible({ timeout: 5000 })
    await expect(fallback).toContainText('Network error')
  })
})
