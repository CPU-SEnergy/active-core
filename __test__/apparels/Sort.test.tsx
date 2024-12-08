import { render, screen, fireEvent } from "@testing-library/react";
import { useSearchParams, useRouter } from "next/navigation";
import Sort from "@/app/apparels/Sort";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("Sort Component", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the component and triggers sort change", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?sort=latest")
    );

    render(<Sort />);

    const sortTriggerButton = screen.getByRole("button", { name: /sort by/i });
    expect(sortTriggerButton).toBeInTheDocument();

    fireEvent.click(sortTriggerButton);

    const latestOption = screen.getByRole("radio", { name: /latest/i });
    const popularOption = screen.getByRole("radio", { name: /popular/i });
    const priceHighToLowOption = screen.getByRole("radio", {
      name: /price high to low/i,
    });
    const priceLowToHighOption = screen.getByRole("radio", {
      name: /price low to high/i,
    });
    const discountOption = screen.getByRole("radio", { name: /discount/i });

    expect(latestOption).toBeInTheDocument();
    expect(popularOption).toBeInTheDocument();
    expect(priceHighToLowOption).toBeInTheDocument();
    expect(priceLowToHighOption).toBeInTheDocument();
    expect(discountOption).toBeInTheDocument();

    fireEvent.click(priceHighToLowOption);

    expect(mockPush).toHaveBeenCalledWith("?sort=price&dir=desc");
  });

  it("sets the correct radio button based on the current sort query", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?sort=price&dir=asc")
    );

    render(<Sort />);

    fireEvent.click(screen.getByRole("button", { name: /sort by/i }));

    const priceLowToHighOption = screen.getByRole("radio", {
      name: /price low to high/i,
    });
    expect(priceLowToHighOption).toBeChecked();
  });

  it('handles the "discount" sorting option correctly', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?sort=latest")
    );

    render(<Sort />);

    fireEvent.click(screen.getByRole("button", { name: /sort by/i }));

    const discountOption = screen.getByRole("radio", { name: /discount/i });

    fireEvent.click(discountOption);

    expect(mockPush).toHaveBeenCalledWith("?sort=discount");
  });

  it('handles the "popular" sorting option correctly', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?sort=latest")
    );

    render(<Sort />);

    fireEvent.click(screen.getByRole("button", { name: /sort by/i }));

    const popularOption = screen.getByRole("radio", { name: /popular/i });

    fireEvent.click(popularOption);

    expect(mockPush).toHaveBeenCalledWith("?sort=popular");
  });

  it('handles the "latest" sorting option correctly', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?sort=popular")
    );

    render(<Sort />);

    fireEvent.click(screen.getByRole("button", { name: /sort by/i }));

    const latestOption = screen.getByRole("radio", { name: /latest/i });

    fireEvent.click(latestOption);

    expect(mockPush).toHaveBeenCalledWith("?sort=latest");
  });

  it('sets the correct radio button for "price high to low" when the URL is "?sort=price&dir=desc"', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?sort=price&dir=desc")
    );

    render(<Sort />);

    fireEvent.click(screen.getByRole("button", { name: /sort by/i }));

    const priceHighToLowOption = screen.getByRole("radio", {
      name: /price high to low/i,
    });
    expect(priceHighToLowOption).toBeChecked();
  });

  it('sets the correct radio button for "price low to high" when the URL is "?sort=price&dir=asc"', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?sort=price&dir=asc")
    );

    render(<Sort />);

    fireEvent.click(screen.getByRole("button", { name: /sort by/i }));

    const priceLowToHighOption = screen.getByRole("radio", {
      name: /price low to high/i,
    });
    expect(priceLowToHighOption).toBeChecked();
  });
});
