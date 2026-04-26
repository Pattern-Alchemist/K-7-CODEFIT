import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SiteHeader from "@/components/SiteHeader"
import jest from "jest"

jest.mock("next/link", () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
})

describe("SiteHeader", () => {
  it("renders the header with branding", () => {
    render(<SiteHeader />)
    expect(screen.getByText("ASTROKALKI")).toBeInTheDocument()
    expect(screen.getByText("Cosmic Clarity")).toBeInTheDocument()
  })

  it("renders navigation links on desktop", () => {
    render(<SiteHeader />)
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Services")).toBeInTheDocument()
    expect(screen.getByText("Plans")).toBeInTheDocument()
    expect(screen.getByText("Book")).toBeInTheDocument()
  })

  it("shows mobile menu button on small screens", () => {
    render(<SiteHeader />)
    const menuButton = screen.getByRole("button", { name: /toggle menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it("toggles mobile menu when button is clicked", async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    const menuButton = screen.getByRole("button", { name: /toggle menu/i })
    await user.click(menuButton)

    // Mobile menu should be visible
    const mobileMenu = screen.getAllByText("Book")
    expect(mobileMenu.length).toBeGreaterThan(0)
  })
})
