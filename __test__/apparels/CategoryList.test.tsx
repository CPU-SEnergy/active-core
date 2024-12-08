/* eslint-disable react/display-name */
import { render, screen, fireEvent } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import CategoryLists from "@/app/apparels/CategoryLists";

// Mocking external dependencies
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock(
  "@/components/ParamsLink",
  () =>
    ({ title, href }: { title: string; href: string }) => (
      <a href={href}>{title}</a>
    )
);

describe("CategoryLists Component", () => {
  const mockUseSearchParams = useSearchParams as jest.Mock;

  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
    render(<CategoryLists />);
  });

  it("renders the mobile view with the sheet trigger button", () => {
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /category/i })
    ).toBeInTheDocument();
  });

  it("renders the desktop view with category links", () => {
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
    expect(screen.getByText("Shorts")).toBeInTheDocument();
    expect(screen.getByText("Headgears")).toBeInTheDocument();
    expect(screen.getByText("Gloves")).toBeInTheDocument();
  });

  it("appends the selected category to the URL params", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("?c=t-shirt"));

    expect(screen.getByText("T-Shirts").closest("a")).toHaveAttribute(
      "href",
      "/apparels?c=t-shirt"
    );
    expect(screen.getByText("Shorts").closest("a")).toHaveAttribute(
      "href",
      "/apparels?c=shorts"
    );
  });

  it("displays mobile category links when the sheet trigger button is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: /category/i }));

    expect(screen.getByRole("dialog")).toBeVisible();

    const mobileLinks = screen.getAllByRole("link", { name: /T-Shirts/i });
    expect(mobileLinks).toHaveLength(1);
  });

  it("displays mobile view links correctly after opening the mobile sheet", () => {
    fireEvent.click(screen.getByRole("button", { name: /category/i }));

    expect(screen.getByRole("link", { name: /T-Shirts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shorts/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Headgears/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Gloves/i })).toBeInTheDocument();
  });
});
