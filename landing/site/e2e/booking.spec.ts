import { test, expect } from "@playwright/test"

test.describe("Booking Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#booking")
  })

  test("should display booking form fields", async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="phone"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="dob"]')).toBeVisible()
    await expect(page.locator('input[name="location"]')).toBeVisible()
  })

  test("should submit booking form with valid data", async ({ page }) => {
    await page.fill('input[name="name"]', "John Doe")
    await page.fill('input[name="phone"]', "+919876543210")
    await page.fill('input[name="email"]', "john@example.com")
    await page.fill('input[name="dob"]', "1990-01-01")
    await page.fill('input[name="location"]', "New York")

    const submitButton = page.locator('button:has-text("Submit")')
    await submitButton.click()

    // Check for success message
    await expect(page.locator("text=Thank you")).toBeVisible()
  })

  test("should validate required fields", async ({ page }) => {
    const submitButton = page.locator('button:has-text("Submit")')
    await submitButton.click()

    // Form should not submit without required fields
    await expect(page.locator('input[name="name"]')).toBeFocused()
  })
})
