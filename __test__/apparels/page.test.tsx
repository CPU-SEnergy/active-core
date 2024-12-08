/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ApparelPage from '@/app/apparels/page';
import fetchMock from 'jest-fetch-mock';

// Mock components
jest.mock('@/app/apparels/CategoryLists', () => () => <div>Mocked Category Lists</div>);
jest.mock('@/app/apparels/Sort', () => () => <div>Mocked Sort Component</div>);
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <img alt={props.alt || 'mocked image'} {...props} />,
}));



// Enable fetch mocks
fetchMock.enableMocks();

describe('ApparelPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders the page and displays products', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt.',
        price: 499.99,
        picture_link: 'https://example.com/image1.jpg',
      },
      {
        id: 2,
        name: 'Jeans',
        description: 'Classic denim jeans.',
        price: 999.99,
        picture_link: 'https://example.com/image2.jpg',
      },
    ];

    // Mock the fetch API response
    fetchMock.mockResponseOnce(JSON.stringify(mockProducts));

    // Render the ApparelPage
    render(
      <ApparelPage
        searchParams={Promise.resolve({
          c: 'shirts',
          sort: 'asc',
          dir: 'asc',
        })}
      />
    );

    // Check if the mocked components are displayed
    expect(screen.getByText('Mocked Category Lists')).toBeInTheDocument();
    expect(screen.getByText('Mocked Sort Component')).toBeInTheDocument();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('Jeans')).toBeInTheDocument();
    });

    // Check product details
    expect(screen.getByText('Comfortable cotton t-shirt.')).toBeInTheDocument();
    expect(screen.getByText('₱499.99')).toBeInTheDocument();
    expect(screen.getByText('Classic denim jeans.')).toBeInTheDocument();
    expect(screen.getByText('₱999.99')).toBeInTheDocument();

    // Ensure images are rendered correctly
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('handles fetch error gracefully', async () => {
    // Mock the fetch API to return an error
    fetchMock.mockReject(new Error('Failed to fetch products'));

    render(
      <ApparelPage
        searchParams={Promise.resolve({
          c: 'shirts',
          sort: 'asc',
          dir: 'asc',
        })}
      />
    );

    // Ensure products are not displayed
    await waitFor(() => {
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
      expect(screen.queryByText('Jeans')).not.toBeInTheDocument();
    });

    // Optionally check for an error message (if implemented in the component)
    expect(screen.queryByText('Failed to fetch products')).not.toBeInTheDocument();
  });
});
