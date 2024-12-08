import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryLists from "@/app/apparels/CategoryLists";
import { useSearchParams } from "next/navigation";

// Mock the searchParams
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/ParamsLink", () => ({
  __esModule: true,
  default: ({ title, href }: { title: string; href: string }) => (
    <a href={href} data-testid="params-link">
      {title}
    </a>
  ),
}));

describe("CategoryLists Component", () => {
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    // Mock the searchParams with a default value
    mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it("renders categories for desktop view", () => {
    render(<CategoryLists />);

    // Check for desktop category links
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    expect(screen.getByText(/T-Shirts/i)).toBeInTheDocument();
    expect(screen.getByText(/Shorts/i)).toBeInTheDocument();
    expect(screen.getByText(/Headgears/i)).toBeInTheDocument();
    expect(screen.getByText(/Gloves/i)).toBeInTheDocument();
  });

  it("generates correct category links for desktop", () => {
    render(<CategoryLists />);

    const links = screen.getAllByTestId("params-link");
    expect(links[0]).toHaveAttribute("href", "/apparels?c=t-shirt");
    expect(links[1]).toHaveAttribute("href", "/apparels?c=shorts");
    expect(links[2]).toHaveAttribute("href", "/apparels?c=headgears");
    expect(links[3]).toHaveAttribute("href", "/apparels?c=gloves");
  });

  it("renders mobile category sheet and triggers it", () => {
    render(<CategoryLists />);

    // Ensure the sheet trigger exists
    const triggerButton = screen.getByText(/Category/i);
    expect(triggerButton).toBeInTheDocument();

    // Simulate opening the sheet
    fireEvent.click(triggerButton);

    // Check for mobile category links
    expect(screen.getByText(/T-Shirts/i)).toBeInTheDocument();
    expect(screen.getByText(/Shorts/i)).toBeInTheDocument();
    expect(screen.getByText(/Headgears/i)).toBeInTheDocument();
    expect(screen.getByText(/Gloves/i)).toBeInTheDocument();
  });

  it("generates correct category links for mobile", () => {
    render(<CategoryLists />);

    const triggerButton = screen.getByText(/Category/i);
    fireEvent.click(triggerButton);

    const links = screen.getAllByTestId("params-link");
    expect(links[0]).toHaveAttribute("href", "/apparels?c=t-shirt");
    expect(links[1]).toHaveAttribute("href", "/apparels?c=shorts");
    expect(links[2]).toHaveAttribute("href", "/apparels?c=headgears");
    expect(links[3]).toHaveAttribute("href", "/apparels?c=gloves");
  });
});
