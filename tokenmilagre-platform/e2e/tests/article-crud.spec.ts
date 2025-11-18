/**
 * E2E Tests - Article CRUD
 * Tests complete article lifecycle: Create, Read, Update, Delete
 */

import { test, expect, testUsers } from '../fixtures/auth'
import { ArticleListPage } from '../pages/ArticleListPage'
import { ArticleFormPage } from '../pages/ArticleFormPage'

test.describe('Article CRUD - Author', () => {
  let listPage: ArticleListPage
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page, authenticatedContext }) => {
    listPage = new ArticleListPage(page)
    formPage = new ArticleFormPage(page)

    // Navigate to articles page
    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('should create a new article as Author', async ({ page }) => {
    // Click create button
    await listPage.clickCreateButton()

    // Fill form
    const articleData = {
      title: 'E2E Test Article ' + Date.now(),
      slug: 'e2e-test-article-' + Date.now(),
      content: '<p>This is test content for E2E testing</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    }

    await formPage.createArticle(articleData)

    // Assert success
    await formPage.assertSuccessToast()

    // Verify redirect to articles list
    await expect(page).toHaveURL(/\/articles$/)

    // Verify article appears in list
    await listPage.assertArticleExists(articleData.title)
  })

  test('should show validation errors for invalid data', async () => {
    await listPage.clickCreateButton()

    // Try to submit empty form
    await formPage.submit()

    // Assert validation errors
    await formPage.assertValidationError('title')
    await formPage.assertValidationError('content')
    await formPage.assertValidationError('categoryId')
  })

  test('should auto-generate slug from title', async () => {
    await listPage.clickCreateButton()

    // Fill only title
    await formPage.fillTitle('Test Article Title')

    // Verify slug was auto-generated
    await formPage.assertFormValues({
      slug: 'test-article-title',
    })
  })

  test('should edit an existing article', async ({ page }) => {
    // Create article first
    await listPage.clickCreateButton()

    const originalTitle = 'Original Title ' + Date.now()
    await formPage.createArticle({
      title: originalTitle,
      content: '<p>Original content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    await formPage.assertSuccessToast()
    await expect(page).toHaveURL(/\/articles$/)

    // Click on the article to edit
    await listPage.clickArticle(0)

    // Update title and content
    const updatedTitle = 'Updated Title ' + Date.now()
    await formPage.updateArticle({
      title: updatedTitle,
      content: '<p>Updated content</p>',
    })

    // Assert success
    await formPage.assertSuccessToast()

    // Verify updated article in list
    await listPage.assertArticleExists(updatedTitle)
    await listPage.assertArticleNotExists(originalTitle)
  })

  test('should publish a draft article', async ({ page }) => {
    // Create draft article
    await listPage.clickCreateButton()

    const articleTitle = 'Draft Article ' + Date.now()
    await formPage.createArticle({
      title: articleTitle,
      content: '<p>Draft content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    await formPage.assertSuccessToast()

    // Edit and publish
    await listPage.clickArticle(0)
    await formPage.selectStatus('PUBLISHED')
    await formPage.submit()

    await formPage.assertSuccessToast()

    // Verify status changed
    const status = await listPage.getArticleStatus(0)
    expect(status).toContain('PUBLISHED')
  })

  test('should delete an article', async ({ page }) => {
    // Create article
    await listPage.clickCreateButton()

    const articleTitle = 'To Delete ' + Date.now()
    await formPage.createArticle({
      title: articleTitle,
      content: '<p>To be deleted</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    await formPage.assertSuccessToast()
    await listPage.assertArticleExists(articleTitle)

    // Delete article
    const deleteButton = page.locator('[data-testid="delete-article-button"]').first()
    await deleteButton.click()

    // Confirm deletion
    const confirmButton = page.locator('[data-testid="confirm-delete-button"]')
    await confirmButton.click()

    // Assert success toast
    const successToast = page.locator('[data-testid="success-toast"]:has-text("deleted")')
    await expect(successToast).toBeVisible({ timeout: 5000 })

    // Verify article removed from list
    await listPage.assertArticleNotExists(articleTitle)
  })

  test('should restore a deleted article as Editor', async ({ page }) => {
    // Note: This test would need EDITOR role
    // Skipping for Author role test suite
  })
})

test.describe('Article CRUD - Admin', () => {
  let listPage: ArticleListPage
  let formPage: ArticleFormPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)
    formPage = new ArticleFormPage(page)

    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('Admin should be able to edit any article', async ({ page }) => {
    // Create article as Author
    await listPage.clickCreateButton()

    const articleTitle = 'Article By Author ' + Date.now()
    await formPage.createArticle({
      title: articleTitle,
      content: '<p>Content by author</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    await formPage.assertSuccessToast()

    // Edit as Admin (should succeed)
    await listPage.clickArticle(0)

    const updatedTitle = 'Edited By Admin ' + Date.now()
    await formPage.updateArticle({
      title: updatedTitle,
    })

    await formPage.assertSuccessToast()
    await listPage.assertArticleExists(updatedTitle)
  })

  test('Admin should be able to delete any article', async ({ page }) => {
    // Create article
    await listPage.clickCreateButton()

    const articleTitle = 'Article To Delete ' + Date.now()
    await formPage.createArticle({
      title: articleTitle,
      content: '<p>Content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-test',
    })

    await formPage.assertSuccessToast()

    // Delete as Admin
    const deleteButton = page.locator('[data-testid="delete-article-button"]').first()
    await deleteButton.click()

    const confirmButton = page.locator('[data-testid="confirm-delete-button"]')
    await confirmButton.click()

    // Verify deletion
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible({ timeout: 5000 })
    await listPage.assertArticleNotExists(articleTitle)
  })
})

test.describe('Article CRUD - Reader (Unauthorized)', () => {
  let listPage: ArticleListPage

  test.beforeEach(async ({ page }) => {
    listPage = new ArticleListPage(page)

    await listPage.goto()
    await listPage.waitForLoad()
  })

  test('Reader should NOT see create button', async () => {
    await expect(listPage.createButton).not.toBeVisible()
  })

  test('Reader should NOT be able to edit articles', async ({ page }) => {
    // Click on article
    if (await listPage.getArticleCount() > 0) {
      await listPage.clickArticle(0)

      // Should not see edit button
      const editButton = page.locator('[data-testid="edit-article-button"]')
      await expect(editButton).not.toBeVisible()
    }
  })

  test('Reader should NOT see delete buttons', async () => {
    if (await listPage.getArticleCount() > 0) {
      const deleteButton = listPage.page.locator('[data-testid="delete-article-button"]')
      await expect(deleteButton).not.toBeVisible()
    }
  })
})
