import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "./AuthContext";
const SellerAuth = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (isLogin) {
        // Handle login
        response = await axios.post("http://localhost:5000/api/login", data);
        console.log("Login response:", response);
        if (response.status === 200) {
          login(response.data.user, response.data.token);
          localStorage.setItem("token", response.data.token); // Store JWT token
          localStorage.setItem("user", JSON.stringify(response.data.user)); // Store JWT token

          alert("Login successful!");
        }
      } else {
        // Handle registration
        response = await axios.post("http://localhost:5000/api/register", data);
        console.log("Register response:", response);
        if (response.status === 201) {
          alert("Registration successful!");
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mb-4 ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <>
            <div>
              <label className="block">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full Name is required" })}
                className="w-full p-2 border rounded text-black"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block">Business Name</label>
              <input
                type="text"
                {...register("businessName", {
                  required: "Business Name is required",
                })}
                className="w-full p-2 border rounded text-black"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block">Business Description</label>
              <input
                type="text"
                {...register("businessDescription", {
                  required: "Business Description is required",
                })}
                className="w-full p-2 border rounded text-black"
              />
              {errors.businessDescription && (
                <p className="text-red-500 text-sm">
                  {errors.businessDescription.message}
                </p>
              )}
            </div>
          </>
        )}

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
          <label className="block">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border rounded text-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-pink-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default SellerAuth;
