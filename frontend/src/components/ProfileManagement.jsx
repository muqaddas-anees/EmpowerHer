import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React from "react";

const ProfileManagement = () => {
  // eslint-disable-next-line no-unused-vars
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  // eslint-disable-next-line no-unused-vars
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setProfile(response.data);
        // Populate form fields with the fetched profile data
        setValue("fullName", response.data.fullName);
        setValue("id", response.data._id);
        console.log("id is " + response.data.id);
        setValue("email", response.data.email);
        setValue("phoneNumber", response.data.phoneNumber || "");
        setValue("businessName", response.data.businessName || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async () => {
    const formData = getValues(); // Get all form values
    console.log("came here to update profile", formData);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found!");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/profile/${formData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated successfully", response);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>

      <form className="space-y-4">
        <div>
          <input type="hidden" {...register("id", { required: true })} />
          <label className="block">Full Name</label>
          <input
            type="text"
            {...register("fullName", { required: "Full Name is required" })}
            className="w-full p-2 border rounded text-black"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block">Phone Number</label>
          <input
            type="number"
            {...register("phoneNumber")}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block">Business Names</label>
          <input
            type="text"
            {...register("businessName")}
            className="text-black w-full p-2 border rounded"
          />
        </div>

        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 rounded"
          onClick={onSubmit}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileManagement;
