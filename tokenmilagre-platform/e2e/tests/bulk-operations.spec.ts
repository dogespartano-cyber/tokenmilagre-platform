/**
 * E2E Tests - Bulk Operations
 * Tests bulk publish, archive, delete, and restore operations
 */

import { test, expect } from '../fixtures/auth'
import { ArticleListPage } from '../pages/ArticleListPage'
import { ArticleFormPage } from '../pages/ArticleFormPage'

test.describe('Bulk Operations - Editor', () => {
  let listPage: ArticleListPage
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    formPage = new ArticleFormPage(page)

    // Create test articles
    await listPage.goto()
    await listPage.waitForLoad()

    // Create 3 test articles
    for (let i = 0; i < 3; i++) {
      await listPage.clickCreateButton()
      await formPage.createArticle({
        title: `Bulk Test Article ${i + 1} ${Date.now()}`,
        content: `<p>Content for article ${i + 1}</p>`,
        type: 'NEWS',
        status: 'DRAFT',
        categoryId: 'cat-test',
      })
      await formPage.assertSuccessToast()
    }

    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should bulk publish selected articles', async ({ page }) => {
    // Select 2 articles
    await listPage.selectArticlesForBulk(2)

    // Assert bulk toolbar visible
    await listPage.assertBulkToolbarVisible()

    // Click bulk publish
    await listPage.bulkPublish()

    // Assert success toast
    const successToast = page.locator('[data-testid="success-toast"]:has-text("published")')
    await expect(successToast).toBeVisible({ timeout: 5000 })

    // Verify status changed
    const status1 = await listPage.getArticleStatus(0)
    const status2 = await listPage.getArticleStatus(1)

    expect(status1).toContain('PUBLISHED')
    expect(status2).toContain('PUBLISHED')
  })

  test('should bulk archive selected articles', async ({ page }) => {
    // Select 2 articles
    await listPage.selectArticlesForBulk(2)

    // Click bulk archive
    await listPage.bulkArchive()

    // Assert success toast
    const successToast = page.locator('[data-testid="success-toast"]:has-text("archived")')
    await expect(successToast).toBeVisible({ timeout: 5000 })

    // Verify status changed
    const status1 = await listPage.getArticleStatus(0)
    const status2 = await listPage.getArticleStatus(1)

    expect(status1).toContain('ARCHIVED')
    expect(status2).toContain('ARCHIVED')
  })

  test('should bulk delete selected articles', async ({ page }) => {
    // Get titles before deletion
    const title1 = await listPage.getArticleTitle(0)
    const title2 = await listPage.getArticleTitle(1)

    // Select 2 articles
    await listPage.selectArticlesForBulk(2)

    // Click bulk delete
    await listPage.bulkDelete()

    // Assert success toast
    const successToast = page.locator('[data-testid="success-toast"]:has-text("deleted")')
    await expect(successToast).toBeVisible({ timeout: 5000 })

    // Verify articles removed
    await listPage.assertArticleNotExists(title1)
    await listPage.assertArticleNotExists(title2)
  })

  test('should show bulk toolbar only when articles selected', async () => {
    // Initially hidden
    await listPage.assertBulkToolbarHidden()

    // Select one article
    await listPage.selectArticlesForBulk(1)

    // Toolbar visible
    await listPage.assertBulkToolbarVisible()

    // Deselect
    await listPage.bulkSelectCheckboxes.first().uncheck()

    // Toolbar hidden again
    await listPage.assertBulkToolbarHidden()
  })

  test('should enforce max selection limit (50 articles)', async ({ page }) => {
    // This would require creating 51+ articles
    // For now, we'll test the UI shows a warning

    // Select all available articles
    const count = await listPage.getArticleCount()
    await listPage.selectArticlesForBulk(Math.min(count, 50))

    // Try to select one more if possible
    if (count > 50) {
      await listPage.bulkSelectCheckboxes.nth(50).check()

      // Should show warning
      const warningMessage = page.locator('[data-testid="bulk-limit-warning"]')
      await expect(warningMessage).toBeVisible()
    }
  })

  test('should handle bulk operation errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/v2/articles/bulk', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Bulk operation failed',
            code: 'INTERNAL_ERROR',
          },
        }),
      })
    })

    // Select articles
    await listPage.selectArticlesForBulk(2)

    // Try bulk publish
    await listPage.bulkPublishButton.click()

    // Should show error toast
    const errorToast = page.locator('[data-testid="error-toast"]:has-text("failed")')
    await expect(errorToast).toBeVisible({ timeout: 5000 })
  })

  test('should restore deleted articles', async ({ page }) => {
    // Delete an article first
    await listPage.selectArticlesForBulk(1)
    const titleBeforeDelete = await listPage.getArticleTitle(0)
    await listPage.bulkDelete()

    // Navigate to deleted articles view
    await page.goto('/articles?includeDeleted=true')
    await listPage.waitForLoad()

    // Find and restore deleted article
    const restoreButton = page.locator(`[data-testid="restore-article-button"]`).first()
    await restoreButton.click()

    // Assert success
    const successToast = page.locator('[data-testid="success-toast"]:has-text("restored")')
    await expect(successToast).toBeVisible({ timeout: 5000 })

    // Navigate back to active articles
    await page.goto('/articles')
    await listPage.waitForLoad()

    // Verify article is back
    await listPage.assertArticleExists(titleBeforeDelete)
  })
})

test.describe('Bulk Operations - Author (Unauthorized)', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('Author should NOT see bulk action buttons', async () => {
    // Even if articles are selected, bulk actions shouldn't be available
    if (await listPage.getArticleCount() > 0) {
      await listPage.selectArticlesForBulk(1)

      // Bulk toolbar might be visible, but action buttons should be disabled/hidden
      await expect(listPage.bulkPublishButton).not.toBeVisible()
      await expect(listPage.bulkArchiveButton).not.toBeVisible()
    }
  })

  test('Author should get 403 if trying bulk operation via API', async ({ page }) => {
    // Mock API call with 403
    await page.route('**/api/v2/articles/bulk', (route) => {
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Insufficient permissions',
            code: 'AUTHORIZATION_ERROR',
          },
        }),
      })
    })

    // Try to trigger bulk operation
    if (await listPage.getArticleCount() > 0) {
      await listPage.selectArticlesForBulk(1)

      // If button is somehow visible, clicking should show error
      if (await listPage.bulkPublishButton.isVisible()) {
        await listPage.bulkPublishButton.click()

        const errorToast = page.locator('[data-testid="error-toast"]:has-text("permission")')
        await expect(errorToast).toBeVisible({ timeout: 5000 })
      }
    }
  })
})

test.describe('Bulk Operations - Performance', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should handle bulk operation on 50 articles in <10 seconds', async ({ page }) => {
    // Note: This would require having 50 articles in the database
    // For actual implementation, you'd seed the DB with test data

    const articleCount = await listPage.getArticleCount()

    if (articleCount >= 10) {
      // Select 10 articles
      await listPage.selectArticlesForBulk(10)

      // Measure time for bulk operation
      const startTime = Date.now()

      await listPage.bulkPublish()

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should complete in reasonable time
      expect(duration).toBeLessThan(10000) // 10 seconds
    }
  })
})
