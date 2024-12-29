import React from "react";
import { motion } from "framer-motion";

import Footer from "./Footer";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0, x: "-100vw" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, duration: 1 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 1 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      textShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
      boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
    },
  };

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Split Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div>
            <motion.h1
              className="text-5xl font-bold text-white mb-6"
              variants={textVariants}
            >
              Welcome to Our Story
            </motion.h1>
            <motion.p
              className="text-lg text-gray-200 text-left leading-relaxed"
              variants={textVariants}
            >
              At <span className="font-semibold text-yellow-300">Empower Her</span>, 
              we believe in empowering women to create, inspire, and achieve. Our journey 
              started with a vision to build a supportive platform where girls can shine 
              and succeed together.
            </motion.p>
            <motion.p
              className="text-lg text-gray-200 text-left leading-relaxed mt-4"
              variants={textVariants}
            >
              From small steps to remarkable milestones, every chapter of our story is 
              written with passion, purpose, and unwavering commitment. Together, let's 
              craft a world where every woman feels valued and unstoppable.
            </motion.p>
            <motion.button
              className="mt-8 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
            >
              Join Our Mission
            </motion.button>
          </div>

          {/* Image Section */}
          <motion.div
            className="flex justify-center"
            variants={textVariants}
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1676586308943-a2aca1cbdc06?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2lybCUyMHNld2luZyUyMGNsb3RoZXN8ZW58MHx8MHx8fDA%3D" // Replace with your image URL
              alt="Empowered Women"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </motion.div>
        </div>
      </motion.div>
<Footer />
    </>
  );
};

export default About;
