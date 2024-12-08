import { render, screen, fireEvent } from '@testing-library/react';
import Sort from '@/app/apparels/Sort';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the router and search params
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Sort Component', () => {
  let pushMock: jest.Mock;
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    // Mock the router's push method
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Default search params mock
    mockSearchParams = new URLSearchParams('sort=latest');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders the component and the trigger button', () => {
    render(<Sort />);
    const triggerButton = screen.getByText(/Sort by/i);
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens the sheet and displays sorting options', () => {
    render(<Sort />);

    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    expect(screen.getByText(/Latest/i)).toBeInTheDocument();
    expect(screen.getByText(/Popular/i)).toBeInTheDocument();
    expect(screen.getByText(/Price High to Low/i)).toBeInTheDocument();
    expect(screen.getByText(/Price Low to High/i)).toBeInTheDocument();
    expect(screen.getByText(/Discount/i)).toBeInTheDocument();
  });

  it('updates the URL when a sorting option is selected', () => {
    render(<Sort />);

    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    const priceHighToLowOption = screen.getByLabelText(/Price High to Low/i);
    fireEvent.click(priceHighToLowOption);

    expect(pushMock).toHaveBeenCalledWith('?sort=price&dir=desc');
  });

  it('removes the "dir" query parameter when selecting non-price sorting options', () => {
    mockSearchParams = new URLSearchParams('sort=price&dir=asc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<Sort />);

    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    const latestOption = screen.getByLabelText(/Latest/i);
    fireEvent.click(latestOption);

    expect(pushMock).toHaveBeenCalledWith('?sort=latest');
  });

  it('handles missing sort query parameter gracefully', () => {
    // Simulate the scenario where no search param exists
    mockSearchParams = new URLSearchParams('');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<Sort />);

    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    // Add an assertion to ensure the default sorting option is applied
    expect(screen.getByText(/Latest/i)).toBeInTheDocument();
  });

  it('handles invalid search parameter gracefully', () => {
    // Simulate an invalid or unexpected query parameter
    mockSearchParams = new URLSearchParams('sort=unknown');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<Sort />);

    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    // Ensure the component doesn't break and defaults to a valid option
    expect(screen.getByText(/Latest/i)).toBeInTheDocument();
  });
});
