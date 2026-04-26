import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the hero section", async ({ page }) => {
    const heroTitle = page.locator("h1")
    await expect(heroTitle).toContainText("Cosmic Blueprint")
  })

  test("should have visible CTAs", async ({ page }) => {
    const primaryButton = page.locator('button:has-text("Start Reading")')
    const secondaryButton = page.locator('button:has-text("1-on-1 Session")')

    await expect(primaryButton).toBeVisible()
    await expect(secondaryButton).toBeVisible()
  })

  test("should render pricing section", async ({ page }) => {
    const pricingSection = page.locator("#pricing")
    await expect(pricingSection).toBeVisible()
  })

  test("should have working navigation links", async ({ page }) => {
    await page.click('a:has-text("Services")')
    expect(page.url()).toContain("#services")
  })

  test("should display testimonials carousel", async ({ page }) => {
    const carouselSection = page.locator("#testimonials")
    await expect(carouselSection).toBeVisible()

    const prevButton = page.locator('button:has-text("Previous")')
    await expect(prevButton).toBeVisible()
  })

  test("should render booking form section", async ({ page }) => {
    const bookingSection = page.locator("#booking")
    await expect(bookingSection).toBeVisible()
  })

  test("should have responsive design", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    const mobileMenu = page.locator('button[aria-label="Toggle menu"]')
    await expect(mobileMenu).toBeVisible()
  })

  test("should display footer", async ({ page }) => {
    const footer = page.locator("footer")
    await expect(footer).toBeVisible()
    expect(footer).toContainText("AstroKalki")
  })
})
