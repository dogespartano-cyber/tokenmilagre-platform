/**
 * Page Object - Article Form Page
 * Encapsulates interactions with article creation/editing form
 */

import { Page, Locator, expect } from '@playwright/test'

export class ArticleFormPage {
  readonly page: Page
  readonly titleInput: Locator
  readonly slugInput: Locator
  readonly contentEditor: Locator
  readonly typeSelect: Locator
  readonly statusSelect: Locator
  readonly categorySelect: Locator
  readonly tagMultiSelect: Locator
  readonly excerptTextarea: Locator
  readonly coverImageInput: Locator
  readonly submitButton: Locator
  readonly cancelButton: Locator
  readonly loadingSpinner: Locator
  readonly errorMessages: Locator
  readonly successToast: Locator
  readonly validationErrors: Locator

  constructor(page: Page) {
    this.page = page
    this.titleInput = page.locator('[data-testid="article-title-input"]')
    this.slugInput = page.locator('[data-testid="article-slug-input"]')
    this.contentEditor = page.locator('[data-testid="article-content-editor"]')
    this.typeSelect = page.locator('[data-testid="article-type-select"]')
    this.statusSelect = page.locator('[data-testid="article-status-select"]')
    this.categorySelect = page.locator('[data-testid="article-category-select"]')
    this.tagMultiSelect = page.locator('[data-testid="article-tags-multiselect"]')
    this.excerptTextarea = page.locator('[data-testid="article-excerpt-textarea"]')
    this.coverImageInput = page.locator('[data-testid="article-coverimage-input"]')
    this.submitButton = page.locator('[data-testid="submit-article-button"]')
    this.cancelButton = page.locator('[data-testid="cancel-article-button"]')
    this.loadingSpinner = page.locator('[data-testid="form-loading-spinner"]')
    this.errorMessages = page.locator('[data-testid="error-message"]')
    this.successToast = page.locator('[data-testid="success-toast"]')
    this.validationErrors = page.locator('[data-testid="validation-error"]')
  }

  async gotoCreate() {
    await this.page.goto('/articles/new')
  }

  async gotoEdit(articleId: string) {
    await this.page.goto(`/articles/${articleId}/edit`)
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title)
  }

  async fillSlug(slug: string) {
    await this.slugInput.fill(slug)
  }

  async fillContent(content: string) {
    await this.contentEditor.fill(content)
  }

  async selectType(type: string) {
    await this.typeSelect.selectOption(type)
  }

  async selectStatus(status: string) {
    await this.statusSelect.selectOption(status)
  }

  async selectCategory(categoryId: string) {
    await this.categorySelect.selectOption(categoryId)
  }

  async selectTags(tags: string[]) {
    for (const tag of tags) {
      await this.tagMultiSelect.selectOption(tag)
    }
  }

  async fillExcerpt(excerpt: string) {
    await this.excerptTextarea.fill(excerpt)
  }

  async uploadCoverImage(filePath: string) {
    await this.coverImageInput.setInputFiles(filePath)
  }

  async submit() {
    await this.submitButton.click()
  }

  async cancel() {
    await this.cancelButton.click()
  }

  async createArticle(data: {
    title: string
    slug?: string
    content: string
    type: string
    status: string
    categoryId: string
    tags?: string[]
  }) {
    await this.fillTitle(data.title)

    if (data.slug) {
      await this.fillSlug(data.slug)
    }

    await this.fillContent(data.content)
    await this.selectType(data.type)
    await this.selectStatus(data.status)
    await this.selectCategory(data.categoryId)

    if (data.tags && data.tags.length > 0) {
      await this.selectTags(data.tags)
    }

    await this.submit()
    await this.waitForLoad()
  }

  async updateArticle(data: Partial<{
    title: string
    content: string
    status: string
  }>) {
    if (data.title) {
      await this.fillTitle(data.title)
    }

    if (data.content) {
      await this.fillContent(data.content)
    }

    if (data.status) {
      await this.selectStatus(data.status)
    }

    await this.submit()
    await this.waitForLoad()
  }

  async hasValidationError(field: string): Promise<boolean> {
    const error = this.page.locator(`[data-testid="validation-error-${field}"]`)
    return error.isVisible()
  }

  async getValidationError(field: string): Promise<string> {
    const error = this.page.locator(`[data-testid="validation-error-${field}"]`)
    return (await error.textContent()) || ''
  }

  async assertSubmitButtonDisabled() {
    await expect(this.submitButton).toBeDisabled()
  }

  async assertSubmitButtonEnabled() {
    await expect(this.submitButton).toBeEnabled()
  }

  async assertLoadingState() {
    await expect(this.loadingSpinner).toBeVisible()
  }

  async assertNoLoadingState() {
    await expect(this.loadingSpinner).not.toBeVisible()
  }

  async assertSuccessToast() {
    await expect(this.successToast).toBeVisible({ timeout: 5000 })
  }

  async assertErrorMessage(message: string) {
    const error = this.page.locator(`[data-testid="error-message"]:has-text("${message}")`)
    await expect(error).toBeVisible()
  }

  async assertValidationError(field: string) {
    const error = this.page.locator(`[data-testid="validation-error-${field}"]`)
    await expect(error).toBeVisible()
  }

  async assertFormValues(values: {
    title?: string
    slug?: string
    content?: string
  }) {
    if (values.title) {
      await expect(this.titleInput).toHaveValue(values.title)
    }

    if (values.slug) {
      await expect(this.slugInput).toHaveValue(values.slug)
    }

    if (values.content) {
      await expect(this.contentEditor).toHaveValue(values.content)
    }
  }
}
