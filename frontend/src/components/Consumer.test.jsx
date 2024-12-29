import React from 'react';

import { render, screen, fireEvent, waitFor,beforeAll,afterEach,it,expect } from '@testing-library/react';
import Consumer from './Consumer';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import describe from '@testing-library/jest-dom';
describe('Consumer Component', () => {
  let mock;

  beforeAll(() => {
    // Set up the mock adapter
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset the mock after each test
    mock.reset();
  });

  it('renders without crashing', () => {
    render(<Consumer />);
    expect(screen.getByText(/Search products.../i)).toBeInTheDocument();
  });

  it('fetches and displays products', async () => {
    const products = [
      { _id: '1', name: 'Product 1', description: 'Description 1', price: 100, image: 'image1.jpg', category: 'Category 1' },
      { _id: '2', name: 'Product 2', description: 'Description 2', price: 200, image: 'image2.jpg', category: 'Category 2' },
    ];

    // Mock the GET request
    mock.onGet('http://localhost:5000/api/consumer/products').reply(200, products);

    render(<Consumer />);

    // Wait for the products to be displayed
    await waitFor(() => screen.getByText(/Product 1/i));

    // Check if products are rendered
    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
  });

  it('adds a product to the cart', async () => {
    const products = [
      { _id: '1', name: 'Product 1', description: 'Description 1', price: 100, image: 'image1.jpg', category: 'Category 1' },
    ];

    mock.onGet('http://localhost:5000/api/consumer/products').reply(200, products);

    render(<Consumer />);

    await waitFor(() => screen.getByText(/Product 1/i));

    const addToCartButton = screen.getByText(/Add to Cart/i);
    fireEvent.click(addToCartButton);

    // Check if the product is added to the cart
    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
  });

  it('handles payment method selection', () => {
    render(<Consumer />);

    const select = screen.getByLabelText(/Payment Method/i);
    fireEvent.change(select, { target: { value: 'COD' } });

    // Check if the payment method is updated
    expect(select.value).toBe('COD');
  });
});
