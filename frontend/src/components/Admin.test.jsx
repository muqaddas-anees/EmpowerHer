import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import axios from "axios";
import Admin from "./Admin";

import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");

describe("Admin Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Admin Dashboard and default tab (users)", () => {
    render(<Admin />);

    // Check the dashboard header
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();

    // Default tab should be 'users'
    expect(screen.getByText(/User Requests/i)).toBeInTheDocument();
  });

  it("switches tabs and displays the correct content", () => {
    render(<Admin />);

    // Click on the Products tab
    const productsTab = screen.getByText(/Products Management/i);
    fireEvent.click(productsTab);

    // Ensure products content is displayed
    expect(screen.getByText(/Product Listings/i)).toBeInTheDocument();

    // Click on the Queries tab
    const queriesTab = screen.getByText(/Queries Management/i);
    fireEvent.click(queriesTab);

    // Ensure queries content is displayed
    expect(screen.getByText(/Submitted Queries/i)).toBeInTheDocument();
  });

  it("fetches and displays users data", async () => {
    const mockUsers = [
      {
        id: "1",
        fullName: "John Doe",
        email: "john@example.com",
        status: "Pending",
      },
      {
        id: "2",
        fullName: "Jane Smith",
        email: "jane@example.com",
        status: "Accepted",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockUsers });

    render(<Admin />);

    // Wait for users to load
    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    );

    // Check user data
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("handles user approval actions", async () => {
    const mockUsers = [
      {
        id: "1",
        fullName: "John Doe",
        email: "john@example.com",
        status: "Pending",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(<Admin />);

    // Wait for users to load
    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );

    // Click Accept button
    const acceptButton = screen.getByText(/Accept/i);
    fireEvent.click(acceptButton);

    // Ensure axios.put was called with the correct URL
    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:5000/api/users/6770235a55cc971bad4b1f0f/status",
      { status: "Accepted" }
    );

    // Wait for the status to update
    await waitFor(() =>
      expect(screen.getByText("Product Accepted")).toBeInTheDocument()
    );
  });

  it("fetches and displays products data when Products tab is clicked", async () => {
    const mockProducts = [
      {
        id: "1",
        name: "Product A",
        seller: { fullName: "Seller 1" },
        status: "Pending",
      },
      {
        id: "2",
        name: "Product B",
        seller: { fullName: "Seller 2" },
        status: "Accepted",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockProducts });

    render(<Admin />);

    // Switch to Products tab
    const productsTab = screen.getByText(/Products Management/i);
    fireEvent.click(productsTab);

    // Wait for products to load
    await waitFor(() =>
      expect(screen.getByText("Product A")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("Product B")).toBeInTheDocument()
    );

    // Check product data
    expect(screen.getByText("Seller 1")).toBeInTheDocument();
    expect(screen.getByText("Seller 2")).toBeInTheDocument();
  });

  it("handles product rejection actions", async () => {
    const mockProducts = [
      {
        id: "1",
        name: "Product A",
        seller: { fullName: "Seller 1" },
        status: "Pending",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockProducts });
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(<Admin />);

    // Switch to Products tab
    const productsTab = screen.getByText(/Products Management/i);
    fireEvent.click(productsTab);

    // Wait for products to load
    await waitFor(() =>
      expect(screen.getByText("Product A")).toBeInTheDocument()
    );

    // Click Reject button
    const rejectButton = screen.getByText(/Reject/i);
    fireEvent.click(rejectButton);

    // Ensure axios.put was called with the correct URL
    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:5000/api/products/6770235a55cc971bad4b1f0f/status",
      { status: "Rejected" }
    );

    // Wait for the status to update
    await waitFor(() =>
      expect(screen.getByText("Product Rejected")).toBeInTheDocument()
    );
  });
});
