import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sort from '@/app/apparels/Sort';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the router and search params
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

fetchMock.mockResponseOnce(JSON.stringify({ /* mock response here */ }));


describe('Sort Component', () => {
  let pushMock: jest.Mock;
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    // Mock the router's push method
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Mock searchParams
    mockSearchParams = new URLSearchParams('sort=latest');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders the component and the trigger button', () => {
    render(<Sort />);

    // Check if the trigger button is rendered
    const triggerButton = screen.getByText(/Sort by/i);
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens the sheet and displays sorting options', () => {
    render(<Sort />);

    // Click the trigger button to open the sheet
    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    // Check if sorting options are displayed
    expect(screen.getByText(/Latest/i)).toBeInTheDocument();
    expect(screen.getByText(/Popular/i)).toBeInTheDocument();
    expect(screen.getByText(/Price High to Low/i)).toBeInTheDocument();
    expect(screen.getByText(/Price Low to High/i)).toBeInTheDocument();
    expect(screen.getByText(/Discount/i)).toBeInTheDocument();
  });

  it('updates the URL when a sorting option is selected', () => {
    render(<Sort />);

    // Open the sheet
    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    // Select "Price High to Low" option
    const priceHighToLowOption = screen.getByLabelText(/Price High to Low/i);
    fireEvent.click(priceHighToLowOption);

    // Check if router push is called with correct URL
    expect(pushMock).toHaveBeenCalledWith('?sort=price&dir=desc');
  });

  it('removes the "dir" query parameter when selecting non-price sorting options', () => {
    mockSearchParams = new URLSearchParams('sort=price&dir=asc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<Sort />);

    // Open the sheet
    const triggerButton = screen.getByText(/Sort by/i);
    fireEvent.click(triggerButton);

    // Select "Latest" option
    const latestOption = screen.getByLabelText(/Latest/i);
    fireEvent.click(latestOption);

    // Check if router push is called with correct URL
    expect(pushMock).toHaveBeenCalledWith('?sort=latest');
  });
});
