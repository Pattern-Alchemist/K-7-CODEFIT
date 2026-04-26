import { test, expect } from "@playwright/test"

test.describe("Payment Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#booking")
  })

  test("should display microreading payment options", async ({ page }) => {
    const upiButton = page.locator('button:has-text("UPI")')
    const paypalButton = page.locator('button:has-text("PayPal")')

    await expect(upiButton).toBeVisible()
    await expect(paypalButton).toBeVisible()
  })

  test("should initiate UPI payment flow", async ({ page }) => {
    const upiButton = page.locator('button:has-text("UPI")')

    page.on("popup", (popup) => {
      expect(popup.url()).toContain("upi://")
    })

    await upiButton.click()

    // Should show processing state
    await expect(page.locator("text=Aligning orbits")).toBeVisible()
  })

  test("should display pricing cards", async ({ page }) => {
    const pricingSection = page.locator("#pricing")
    const priceCards = pricingSection.locator('[class*="glass"]')

    const count = await priceCards.count()
    expect(count).toBeGreaterThan(0)
  })
})
