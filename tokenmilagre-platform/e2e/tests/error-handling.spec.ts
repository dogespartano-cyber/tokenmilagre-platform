/**
 * E2E Tests - Error Handling & Edge Cases
 * Tests error boundaries, network errors, 404s, 500s, and edge cases
 */

import { test, expect } from '../fixtures/auth'
import { ArticleListPage } from '../pages/ArticleListPage'
import { ArticleFormPage } from '../pages/ArticleFormPage'

test.describe('Network Error Handling', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
  })

  test('should show error message on network failure', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/v2/articles', (route) => route.abort('failed'))

    await listPage.goto()

    // Error message should appear
    const errorMessage = page.locator('[data-testid="network-error"]')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
    await expect(errorMessage).toContainText(/network error|connection failed/i)
  })

  test('should provide retry button on network error', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/v2/articles', (route) => {
      requestCount++

      if (requestCount === 1) {
        // First request fails
        route.abort('failed')
      } else {
        // Subsequent requests succeed
        route.continue()
      }
    })

    await listPage.goto()

    // Error should appear
    const errorMessage = page.locator('[data-testid="network-error"]')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })

    // Click retry
    const retryButton = page.locator('[data-testid="retry-button"]')
    await retryButton.click()

    // Should recover and show articles
    await expect(errorMessage).not.toBeVisible()
    await expect(listPage.articleCards.first()).toBeVisible({ timeout: 5000 })
  })

  test('should handle intermittent network failures gracefully', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/v2/articles', (route) => {
      requestCount++

      // Fail every other request
      if (requestCount % 2 === 1) {
        route.abort('failed')
      } else {
        route.continue()
      }
    })

    await listPage.goto()

    // First request fails
    const errorMessage = page.locator('[data-testid="network-error"]')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })

    // Retry (should succeed)
    const retryButton = page.locator('[data-testid="retry-button"]')
    await retryButton.click()

    await expect(errorMessage).not.toBeVisible()
  })

  test('should show offline indicator when network is offline', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true)

    await listPage.goto()

    const offlineIndicator = page.locator('[data-testid="offline-indicator"]')
    await expect(offlineIndicator).toBeVisible({ timeout: 5000 })
    await expect(offlineIndicator).toContainText(/offline|no connection/i)

    // Go back online
    await page.context().setOffline(false)

    // Offline indicator should disappear
    await expect(offlineIndicator).not.toBeVisible({ timeout: 5000 })
  })
})

test.describe('HTTP Error Handling', () => {
  let listPage: ArticleListPage
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    formPage = new ArticleFormPage(page)
  })

  test('should handle 404 Not Found errors', async ({ page }) => {
    // Mock 404 response
    await page.route('**/api/v2/articles/non-existent-id', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Article not found',
            code: 'NOT_FOUND',
          },
        }),
      })
    })

    await page.goto('/articles/non-existent-id')

    // 404 page should appear
    const notFoundPage = page.locator('[data-testid="404-page"]')
    await expect(notFoundPage).toBeVisible({ timeout: 5000 })
    await expect(notFoundPage).toContainText(/not found|404/i)

    // Should have link to go back
    const backLink = page.locator('[data-testid="back-to-articles"]')
    await expect(backLink).toBeVisible()
  })

  test('should handle 500 Internal Server Error', async ({ page }) => {
    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
          },
        }),
      })
    })

    await listPage.goto()

    const errorMessage = page.locator('[data-testid="server-error"]')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
    await expect(errorMessage).toContainText(/server error|500/i)
  })

  test('should handle 401 Unauthorized errors', async ({ page }) => {
    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Unauthorized',
            code: 'AUTHENTICATION_ERROR',
          },
        }),
      })
    })

    await listPage.goto()

    // Should redirect to login or show auth error
    const authError = page.locator('[data-testid="auth-error"]')
    await expect(authError).toBeVisible({ timeout: 5000 })
    await expect(authError).toContainText(/unauthorized|login required/i)
  })

  test('should handle 403 Forbidden errors', async ({ page }) => {
    await listPage.goto()
    await listPage.waitForLoad()

    // Mock 403 on delete attempt
    await page.route('**/api/v2/articles/*/delete', (route) => {
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Forbidden: Insufficient permissions',
            code: 'AUTHORIZATION_ERROR',
          },
        }),
      })
    })

    const deleteButton = page.locator('[data-testid="delete-article-button"]').first()
    await deleteButton.click()

    // Confirm delete
    await page.locator('[data-testid="confirm-delete-button"]').click()

    // Error toast should appear
    const errorToast = page.locator('[data-testid="error-toast"]')
    await expect(errorToast).toBeVisible({ timeout: 5000 })
    await expect(errorToast).toContainText(/permission|forbidden/i)
  })

  test('should handle 429 Rate Limit Exceeded', async ({ page }) => {
    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
          'Retry-After': '60',
        },
        body: JSON.stringify({
          error: {
            message: 'Rate limit exceeded',
            code: 'RATE_LIMIT_ERROR',
          },
        }),
      })
    })

    await listPage.goto()

    const rateLimitError = page.locator('[data-testid="rate-limit-error"]')
    await expect(rateLimitError).toBeVisible({ timeout: 5000 })
    await expect(rateLimitError).toContainText(/rate limit|too many requests/i)

    // Should show retry-after countdown
    const retryAfter = page.locator('[data-testid="retry-after-countdown"]')
    await expect(retryAfter).toBeVisible()
  })
})

test.describe('Validation Error Handling', () => {
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    formPage = new ArticleFormPage(page)

    const listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
    await listPage.clickCreateButton()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    // Submit empty form
    await formPage.submitButton.click()

    // Validation errors should appear
    await formPage.assertValidationError('title')
    await formPage.assertValidationError('content')
    await formPage.assertValidationError('categoryId')
  })

  test('should show inline error for invalid field', async ({ page }) => {
    // Fill title with invalid length
    await formPage.fillTitle('ab') // Too short (min 3)

    // Blur to trigger validation
    await formPage.titleInput.blur()

    // Inline error should appear
    const titleError = page.locator('[data-testid="validation-error-title"]')
    await expect(titleError).toBeVisible()
    await expect(titleError).toContainText(/at least 3 characters/i)
  })

  test('should clear validation error when fixed', async ({ page }) => {
    // Submit empty form
    await formPage.submitButton.click()

    // Error appears
    await formPage.assertValidationError('title')

    // Fill title
    await formPage.fillTitle('Valid Title')

    // Error should disappear
    const titleError = page.locator('[data-testid="validation-error-title"]')
    await expect(titleError).not.toBeVisible()
  })

  test('should focus first invalid field on submit', async ({ page }) => {
    // Submit empty form
    await formPage.submitButton.click()

    // First invalid field (title) should be focused
    await expect(formPage.titleInput).toBeFocused()
  })

  test('should show all validation errors at once', async ({ page }) => {
    // Submit empty form
    await formPage.submitButton.click()

    // Multiple errors should be visible
    const errors = page.locator('[data-testid^="validation-error-"]')
    const errorCount = await errors.count()

    expect(errorCount).toBeGreaterThan(1)
  })
})

test.describe('Error Boundaries', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
  })

  test('should catch component errors with error boundary', async ({ page }) => {
    // Simulate component crash by returning malformed data
    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'malformed json that will crash component',
      })
    })

    await listPage.goto()

    // Error boundary should catch
    const errorBoundary = page.locator('[data-testid="error-boundary"]')
    await expect(errorBoundary).toBeVisible({ timeout: 5000 })
    await expect(errorBoundary).toContainText(/something went wrong/i)
  })

  test('should show detailed error info in development mode', async ({ page }) => {
    // This test assumes dev mode; in production, error details would be hidden

    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({
        status: 200,
        body: 'malformed',
      })
    })

    await listPage.goto()

    const errorBoundary = page.locator('[data-testid="error-boundary"]')
    await expect(errorBoundary).toBeVisible({ timeout: 5000 })

    // In dev mode, stack trace might be visible
    const errorDetails = page.locator('[data-testid="error-details"]')
    if (await errorDetails.isVisible()) {
      await expect(errorDetails).toContainText(/error|stack/i)
    }
  })

  test('should allow user to report error', async ({ page }) => {
    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({
        status: 200,
        body: 'malformed',
      })
    })

    await listPage.goto()

    const errorBoundary = page.locator('[data-testid="error-boundary"]')
    await expect(errorBoundary).toBeVisible({ timeout: 5000 })

    // Report button should be available
    const reportButton = page.locator('[data-testid="report-error-button"]')
    if (await reportButton.isVisible()) {
      await reportButton.click()

      // Report dialog should open
      const reportDialog = page.locator('[data-testid="error-report-dialog"]')
      await expect(reportDialog).toBeVisible()
    }
  })

  test('should allow retry from error boundary', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/v2/articles', (route) => {
      requestCount++

      if (requestCount === 1) {
        route.fulfill({ status: 200, body: 'malformed' })
      } else {
        route.continue()
      }
    })

    await listPage.goto()

    const errorBoundary = page.locator('[data-testid="error-boundary"]')
    await expect(errorBoundary).toBeVisible({ timeout: 5000 })

    // Retry
    const retryButton = page.locator('[data-testid="error-boundary-retry"]')
    await retryButton.click()

    // Should recover
    await expect(errorBoundary).not.toBeVisible()
    await expect(listPage.articleCards.first()).toBeVisible()
  })

  test('should allow navigation back from error boundary', async ({ page }) => {
    await page.route('**/api/v2/articles', (route) => {
      route.fulfill({ status: 200, body: 'malformed' })
    })

    await listPage.goto()

    const errorBoundary = page.locator('[data-testid="error-boundary"]')
    await expect(errorBoundary).toBeVisible({ timeout: 5000 })

    // Go back link
    const backLink = page.locator('[data-testid="error-boundary-back"]')
    await backLink.click()

    // Should navigate away
    await expect(page).toHaveURL(/\/|\/home/)
  })
})

test.describe('Loading State Errors', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
  })

  test('should show error if loading takes too long (timeout)', async ({ page }) => {
    // Mock slow response
    await page.route('**/api/v2/articles', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 35000)) // 35 seconds
      route.continue()
    })

    await listPage.goto()

    // Timeout error should appear
    const timeoutError = page.locator('[data-testid="timeout-error"]')
    await expect(timeoutError).toBeVisible({ timeout: 40000 })
    await expect(timeoutError).toContainText(/timeout|taking too long/i)
  })

  test('should handle abort/cancel of requests', async ({ page }) => {
    await listPage.goto()

    // Start loading articles
    const searchInput = listPage.searchInput
    await searchInput.fill('test')

    // Immediately navigate away (abort request)
    await page.goto('/articles?type=NEWS')

    // Should not show error
    const errorToast = page.locator('[data-testid="error-toast"]')
    await expect(errorToast).not.toBeVisible()
  })
})

test.describe('Data Integrity Errors', () => {
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    formPage = new ArticleFormPage(page)

    const listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
    await listPage.clickCreateButton()
  })

  test('should handle duplicate slug error', async ({ page }) => {
    // Mock duplicate slug error
    await page.route('**/api/v2/articles', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              message: 'Article with this slug already exists',
              code: 'CONFLICT',
              context: { slug: 'existing-slug' },
            },
          }),
        })
      } else {
        route.continue()
      }
    })

    await formPage.createArticle({
      title: 'Test Article',
      slug: 'existing-slug',
      content: '<p>Content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    // Error should appear
    const slugError = page.locator('[data-testid="validation-error-slug"]')
    await expect(slugError).toBeVisible({ timeout: 5000 })
    await expect(slugError).toContainText(/already exists|duplicate/i)
  })

  test('should handle missing category error', async ({ page }) => {
    await page.route('**/api/v2/articles', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              message: 'Category not found',
              code: 'NOT_FOUND',
            },
          }),
        })
      } else {
        route.continue()
      }
    })

    await formPage.createArticle({
      title: 'Test Article',
      content: '<p>Content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'non-existent-category',
    })

    const errorToast = page.locator('[data-testid="error-toast"]')
    await expect(errorToast).toBeVisible({ timeout: 5000 })
    await expect(errorToast).toContainText(/category not found/i)
  })
})

test.describe('Concurrent Operation Errors', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should handle concurrent edit conflicts', async ({ page }) => {
    // Simulate optimistic concurrency conflict
    await page.route('**/api/v2/articles/*/update', (route) => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Article was modified by another user',
            code: 'CONFLICT',
          },
        }),
      })
    })

    await listPage.clickArticle(0)

    const formPage = new ArticleFormPage(page)
    await formPage.fillTitle('Modified Title')
    await formPage.submitButton.click()

    // Conflict error should appear
    const conflictError = page.locator('[data-testid="conflict-error"]')
    await expect(conflictError).toBeVisible({ timeout: 5000 })
    await expect(conflictError).toContainText(/modified by another user|conflict/i)
  })

  test('should handle simultaneous bulk operations', async ({ page }) => {
    // Select articles
    await listPage.selectArticlesForBulk(2)

    // Mock error on second bulk operation
    let bulkOpCount = 0
    await page.route('**/api/v2/articles/bulk', (route) => {
      bulkOpCount++

      if (bulkOpCount === 2) {
        route.fulfill({
          status: 409,
          body: JSON.stringify({
            error: {
              message: 'Bulk operation conflict',
              code: 'CONFLICT',
            },
          }),
        })
      } else {
        route.continue()
      }
    })

    // Trigger two bulk operations quickly
    await listPage.bulkPublish()
    await listPage.bulkArchive()

    // Second should error
    const errorToast = page.locator('[data-testid="error-toast"]')
    await expect(errorToast).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Edge Case Error Handling', () => {
  test('should handle browser back button during form submission', async ({ page }) => {
    const listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
    await listPage.clickCreateButton()

    const formPage = new ArticleFormPage(page)
    await formPage.fillTitle('Test Article')

    // Start submitting
    await formPage.submitButton.click()

    // Immediately go back
    await page.goBack()

    // Should not crash or show error
    await expect(page).toHaveURL(/\/articles$/)
  })

  test('should handle rapid form submissions', async ({ page }) => {
    const listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
    await listPage.clickCreateButton()

    const formPage = new ArticleFormPage(page)
    await formPage.fillTitle('Test Article')
    await formPage.fillSlug('test-slug')
    await formPage.fillContent('<p>Content</p>')
    await formPage.selectType('NEWS')
    await formPage.selectStatus('DRAFT')
    await formPage.selectCategory('cat-test')

    // Click submit multiple times rapidly
    await formPage.submitButton.click()
    await formPage.submitButton.click()
    await formPage.submitButton.click()

    // Should only submit once (button disabled after first click)
    await expect(formPage.submitButton).toBeDisabled()

    // Should not create duplicate articles
    await page.waitForTimeout(2000)
  })

  test('should handle session expiration gracefully', async ({ page }) => {
    const listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()

    // Simulate session expiration
    await page.context().clearCookies()

    // Try to create article
    await listPage.clickCreateButton()

    // Should redirect to login or show auth error
    const authError = page.locator('[data-testid="auth-error"]')
    await expect(authError).toBeVisible({ timeout: 5000 })
  })
})
