import {
  render,
  screen,
  fireEvent,
  waitFor,
  jest,
  global,
  describe,
  beforeEach,
  it,
  expect,
} from "@testing-library/react";
import ProductManagement from "./ProductManagement";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mocking localStorage
global.localStorage = {
  getItem: jest.fn(() => "mockedToken"),
  setItem: jest.fn(),
};

// Test suite for ProductManagement component
describe("ProductManagement Component", () => {
  beforeEach(() => {
    // Reset the axios mock before each test
    axios.get.mockReset();
    axios.post.mockReset();
    axios.put.mockReset();
    axios.delete.mockReset();
  });

  it("fetches and displays products on mount", async () => {
    // Mock the axios GET request to return a list of products
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Product 1",
          price: "100",
          description: "Test Product",
          category: "handmade-jewelry",
        },
      ],
    });

    render(<ProductManagement />);

    // Wait for products to appear on screen
    await waitFor(() => screen.getByText("Product 1"));

    // Assert that the product name is rendered
    expect(screen.getByText("Product 1")).toBeInTheDocument();
  });

  it("handles form submission for adding a new product", async () => {
    // Mock the axios POST request
    axios.post.mockResolvedValue({
      data: {
        _id: "2",
        name: "New Product",
        price: "150",
        description: "A new product",
        category: "home-decor",
      },
    });

    render(<ProductManagement />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "home-decor" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "150" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "A new product" },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Add Product/i));

    // Wait for the new product to appear in the list
    await waitFor(() => screen.getByText("New Product"));

    // Assert that the new product is added to the product list
    expect(screen.getByText("New Product")).toBeInTheDocument();
  });

  it("handles form submission for editing an existing product", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Product 1",
          price: "100",
          description: "Test Product",
          category: "handmade-jewelry",
        },
      ],
    });

    // Mock the PUT request for editing the product
    axios.put.mockResolvedValue({
      data: {
        _id: "1",
        name: "Updated Product",
        price: "200",
        description: "Updated description",
        category: "beauty-personal-care",
      },
    });

    render(<ProductManagement />);

    // Wait for the first product to appear
    await waitFor(() => screen.getByText("Product 1"));

    // Click the Edit button
    fireEvent.click(screen.getByText(/Edit/i));

    // Modify the product details
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "Updated Product" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "200" },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Update Product/i));

    // Wait for the updated product to appear
    await waitFor(() => screen.getByText("Updated Product"));

    // Assert that the updated product is displayed
    expect(screen.getByText("Updated Product")).toBeInTheDocument();
  });

  it("handles form validation errors when required fields are empty", async () => {
    render(<ProductManagement />);

    // Try submitting the form with empty fields
    fireEvent.click(screen.getByText(/Add Product/i));

    // Assert that validation errors are shown for the required fields
    expect(
      await screen.findByText(/Product Name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Category is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Price is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Description is required/i)
    ).toBeInTheDocument();
  });

  it("handles product deletion", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Product 1",
          price: "100",
          description: "Test Product",
          category: "handmade-jewelry",
        },
      ],
    });

    // Mock the axios DELETE request
    axios.delete.mockResolvedValue({});

    render(<ProductManagement />);

    // Wait for the first product to appear
    await waitFor(() => screen.getByText("Product 1"));

    // Click the delete button
    fireEvent.click(screen.getByText(/Delete/i));

    // Wait for the product to be deleted and not appear anymore
    await waitFor(() =>
      expect(screen.queryByText("Product 1")).not.toBeInTheDocument()
    );
  });
});
