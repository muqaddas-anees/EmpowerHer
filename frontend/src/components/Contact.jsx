import { motion } from "framer-motion";

import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, type: "spring", stiffness: 50 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0px 0px 8px rgba(255, 215, 0, 0.8)",
    },
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send form data to the backend
      const result = await axios.post("http://localhost:5000/api/contact", formData);
      
      console.log("Email Sent:", result);
      setMessageSent(true);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-r from-pink-400 to-purple-500 flex flex-col items-center justify-center p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Connect with Us
        </motion.h1>
        <motion.p className="text-lg text-gray-200 text-center max-w-2xl mb-8 leading-relaxed">
          Empowering women entrepreneurs to shine. Whether you have questions,
          feedback, or need assistance with selling your products, we’re here to
          help. Let’s build a supportive community together!
        </motion.p>

        {/* Contact Form */}
        <motion.form
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
          onSubmit={handleSubmit}
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
              placeholder="How can we help you?"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none"
            variants={buttonVariants}
            whileHover="hover"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </motion.button>
        </motion.form>

        {/* Success or Error Messages */}
        {messageSent && (
          <motion.div className="mt-8 text-center text-green-500">
            <p className="text-lg">Thank you! Your message has been sent.</p>
          </motion.div>
        )}

        <motion.div className="mt-8 text-center">
          <p className="text-lg text-gray-200">
            Or reach out directly at{" "}
            <a href="mailto:support@yourplatform.com" className="text-yellow-300 underline">
              support@yourplatform.com
            </a>
          </p>
          <p className="text-gray-300 mt-2">We respond within 24-48 hours!</p>
        </motion.div>
      </motion.div>
      
    </>
  );
};

export default Contact;
