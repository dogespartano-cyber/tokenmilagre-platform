/**
 * Page Object - Article List Page
 * Encapsulates interactions with the article listing page
 */

import { Page, Locator, expect } from '@playwright/test'

export class ArticleListPage {
  readonly page: Page
  readonly articleCards: Locator
  readonly createButton: Locator
  readonly searchInput: Locator
  readonly filterTypeSelect: Locator
  readonly filterStatusSelect: Locator
  readonly paginationNext: Locator
  readonly paginationPrev: Locator
  readonly bulkSelectCheckboxes: Locator
  readonly bulkActionsToolbar: Locator
  readonly bulkPublishButton: Locator
  readonly bulkArchiveButton: Locator
  readonly bulkDeleteButton: Locator
  readonly loadingSpinner: Locator
  readonly emptyState: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.articleCards = page.locator('[data-testid="article-card"]')
    this.createButton = page.locator('[data-testid="create-article-button"]')
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.filterTypeSelect = page.locator('[data-testid="filter-type-select"]')
    this.filterStatusSelect = page.locator('[data-testid="filter-status-select"]')
    this.paginationNext = page.locator('[data-testid="pagination-next"]')
    this.paginationPrev = page.locator('[data-testid="pagination-prev"]')
    this.bulkSelectCheckboxes = page.locator('[data-testid="bulk-select-checkbox"]')
    this.bulkActionsToolbar = page.locator('[data-testid="bulk-actions-toolbar"]')
    this.bulkPublishButton = page.locator('[data-testid="bulk-publish-button"]')
    this.bulkArchiveButton = page.locator('[data-testid="bulk-archive-button"]')
    this.bulkDeleteButton = page.locator('[data-testid="bulk-delete-button"]')
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]')
    this.emptyState = page.locator('[data-testid="empty-state"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
  }

  async goto() {
    await this.page.goto('/articles')
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
  }

  async getArticleCount(): Promise<number> {
    return this.articleCards.count()
  }

  async clickArticle(index: number) {
    await this.articleCards.nth(index).click()
  }

  async searchArticles(query: string) {
    await this.searchInput.fill(query)
    await this.page.keyboard.press('Enter')
    await this.waitForLoad()
  }

  async filterByType(type: string) {
    await this.filterTypeSelect.selectOption(type)
    await this.waitForLoad()
  }

  async filterByStatus(status: string) {
    await this.filterStatusSelect.selectOption(status)
    await this.waitForLoad()
  }

  async goToNextPage() {
    await this.paginationNext.click()
    await this.waitForLoad()
  }

  async goToPrevPage() {
    await this.paginationPrev.click()
    await this.waitForLoad()
  }

  async selectArticlesForBulk(count: number) {
    for (let i = 0; i < count; i++) {
      await this.bulkSelectCheckboxes.nth(i).check()
    }
  }

  async bulkPublish() {
    await this.bulkPublishButton.click()
    await this.waitForLoad()
  }

  async bulkArchive() {
    await this.bulkArchiveButton.click()
    await this.waitForLoad()
  }

  async bulkDelete() {
    await this.bulkDeleteButton.click()
    // Confirm deletion if modal appears
    const confirmButton = this.page.locator('[data-testid="confirm-delete-button"]')
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click()
    }
    await this.waitForLoad()
  }

  async hasEmptyState(): Promise<boolean> {
    return this.emptyState.isVisible()
  }

  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible()
  }

  async getArticleTitle(index: number): Promise<string> {
    const titleLocator = this.articleCards.nth(index).locator('[data-testid="article-title"]')
    return titleLocator.textContent() || ''
  }

  async getArticleStatus(index: number): Promise<string> {
    const statusLocator = this.articleCards.nth(index).locator('[data-testid="article-status"]')
    return statusLocator.textContent() || ''
  }

  async clickCreateButton() {
    await this.createButton.click()
  }

  async assertLoadingState() {
    await expect(this.loadingSpinner).toBeVisible()
  }

  async assertNoLoadingState() {
    await expect(this.loadingSpinner).not.toBeVisible()
  }

  async assertArticleExists(title: string) {
    const article = this.page.locator(`[data-testid="article-card"]:has-text("${title}")`)
    await expect(article).toBeVisible()
  }

  async assertArticleNotExists(title: string) {
    const article = this.page.locator(`[data-testid="article-card"]:has-text("${title}")`)
    await expect(article).not.toBeVisible()
  }

  async assertBulkToolbarVisible() {
    await expect(this.bulkActionsToolbar).toBeVisible()
  }

  async assertBulkToolbarHidden() {
    await expect(this.bulkActionsToolbar).not.toBeVisible()
  }
}
