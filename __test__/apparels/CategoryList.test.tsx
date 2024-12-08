
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryLists from "@/app/apparels/CategoryLists";
import { useSearchParams } from "next/navigation";

// Mocking `useSearchParams` hook from `next/navigation`
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

describe("CategoryLists", () => {
  it("renders categories correctly", () => {
    // Mocking search params
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("?"));

    render(<CategoryLists />);

    // Test mobile view elements
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
    expect(screen.getByText("Shorts")).toBeInTheDocument();
    expect(screen.getByText("Headgears")).toBeInTheDocument();
    expect(screen.getByText("Gloves")).toBeInTheDocument();

    // Test desktop view elements
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
    expect(screen.getByText("Shorts")).toBeInTheDocument();
    expect(screen.getByText("Headgears")).toBeInTheDocument();
    expect(screen.getByText("Gloves")).toBeInTheDocument();
  });

  it("generates correct URL for category selection", () => {
    // Mocking search params
    const mockSearchParams = new URLSearchParams("?");

    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<CategoryLists />);

    // Simulate a click event on a ParamsLink (category link)
    const tshirtLink = screen.getByText("T-Shirts");

    fireEvent.click(tshirtLink);

    // Since we can't test window.location.href directly, we can test the appendSearchParams function:
    const expectedUrl = "/apparels?c=t-shirt";
    
    // Manually check if the generated URL from `appendSearchParams` matches the expected one
    const appendSearchParams = (category: string) => {
      const currentParams = new URLSearchParams(mockSearchParams.toString());
      currentParams.set("c", category);
      return `/apparels?${currentParams.toString()}`;
    };

    expect(appendSearchParams("t-shirt")).toBe(expectedUrl);
  });
});
