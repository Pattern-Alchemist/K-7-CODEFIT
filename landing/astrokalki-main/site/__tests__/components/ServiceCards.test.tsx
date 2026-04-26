import { render, screen } from "@testing-library/react"
import ServiceCards from "@/components/service-cards"

describe("ServiceCards", () => {
  it("renders service cards section", () => {
    render(<ServiceCards />)
    expect(screen.getByText(/services/i)).toBeInTheDocument()
  })

  it("displays multiple service card options", () => {
    render(<ServiceCards />)
    const cards = screen.getAllByRole("link")
    expect(cards.length).toBeGreaterThan(0)
  })
})
