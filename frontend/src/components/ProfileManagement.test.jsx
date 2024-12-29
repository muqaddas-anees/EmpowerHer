import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileManagement from "./ProfileManagement";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { describe, expect, beforeEach, test } from "@jest/globals";

// Mock axios requests
const mock = new MockAdapter(axios);

describe("ProfileManagement Component", () => {
  beforeEach(() => {
    // Reset mock to ensure fresh mock before each test
    mock.reset();
  });

  test("should fetch and display profile data when the component mounts", async () => {
    // Mock successful API response for fetching profile
    const mockProfile = {
      fullName: "Izhar Ali",
      email: "surf@gmail.com",
      businessName: "surf excel",
    };

    // Set up the mock response for GET /api/profile
    mock.onGet("/api/profile").reply(200, mockProfile);

    // Render the component
    render(<ProfileManagement />);

    // Wait for the profile data to be fetched and form fields to be populated
    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockProfile.fullName)
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProfile.email)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(mockProfile.businessName)
      ).toBeInTheDocument();
    });
  });

  test("should display error if fetching profile fails", async () => {
    // Simulate API failure for fetching profile
    mock.onGet("/api/profile").reply(500);

    // Render the component
    render(<ProfileManagement />);

    // Wait for some time to simulate API call and check the error in console (optional for logging)
    await waitFor(() => {
      // In the real scenario, you would show an error message to the user
      // For now, we can just ensure the app doesn't crash
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching profile:",
        expect.anything()
      );
    });
  });

  test("should display validation errors if the form is submitted with missing required fields", async () => {
    // Mock successful API response for fetching profile
    const mockProfile = {
      fullName: "Izhar Ali",
      email: "surf@gmail.com",
      businessName: "surf excel",
    };
    mock.onGet("/api/profile").reply(200, mockProfile);

    // Render the component
    render(<ProfileManagement />);

    // Wait for the form to be populated with data
    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockProfile.fullName)
      ).toBeInTheDocument();
    });

    // Clear the Full Name field to simulate missing required field
    const fullNameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(fullNameInput, { target: { value: "" } });

    // Click the submit button
    const submitButton = screen.getByRole("button", {
      name: /Update Profile/i,
    });
    userEvent.click(submitButton);

    // Check for validation error on Full Name field
    const fullNameError = await screen.findByText(/Full Name is required/i);
    expect(fullNameError).toBeInTheDocument();
  });

  test("should update the profile successfully on form submission", async () => {
    // Mock profile data
    const mockProfile = {
      fullName: "Izhar Ali",
      email: "surf@gmail.com",
      businessName: "surf excel",
    };

    // Set up the mock response for GET /api/profile
    mock.onGet("/api/profile").reply(200, mockProfile);

    // Mock successful PUT request for profile update
    mock
      .onPut("/api/profile")
      .reply(200, { message: "Profile updated successfully" });

    // Render the component
    render(<ProfileManagement />);

    // Wait for the form to be populated with data
    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockProfile.fullName)
      ).toBeInTheDocument();
    });

    // Change the business name to simulate a form update
    const businessNameInput = screen.getByLabelText(/Business Name/i);
    userEvent.clear(businessNameInput);
    userEvent.type(businessNameInput, "New Business Name");

    // Click the submit button
    const submitButton = screen.getByRole("button", {
      name: /Update Profile/i,
    });
    userEvent.click(submitButton);

    // Check that the API request was made to update the profile
    await waitFor(() => {
      expect(mock.history.put.length).toBe(1); // Ensure the PUT request was made
    });
  });

  test("should handle error if updating profile fails", async () => {
    // Mock profile data
    const mockProfile = {
      fullName: "Izhar Ali",
      email: "surf@gmail.com",
      businessName: "surf excel",
    };

    // Set up the mock response for GET /api/profile
    mock.onGet("/api/profile").reply(200, mockProfile);

    // Mock failed PUT request for profile update
    mock.onPut("/api/profile").reply(500);

    // Render the component
    render(<ProfileManagement />);

    // Wait for the form to be populated with data
    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockProfile.fullName)
      ).toBeInTheDocument();
    });

    // Change the business name to simulate a form update
    const businessNameInput = screen.getByLabelText(/Business Name/i);
    userEvent.clear(businessNameInput);
    userEvent.type(businessNameInput, "New Business Name");

    // Click the submit button
    const submitButton = screen.getByRole("button", {
      name: /Update Profile/i,
    });
    userEvent.click(submitButton);

    // Check that an error message is logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error updating profile:",
        expect.anything()
      );
    });
  });
});
