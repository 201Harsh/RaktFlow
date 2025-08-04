import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-[url(./assets/img/bg26.jpg)] bg-center flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-red-500"
        >
          <div className="p-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-red-500 mb-2">RaktFlow</h1>
              <p className="text-gray-200">
                Create your account to start chatting
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <label
                  className="block text-gray-200 text-sm font-medium mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-red-500/80" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoFocus
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <label
                  className="block text-gray-200 text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-red-500/80" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-1s00 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <label
                  className="block text-gray-200 text-sm font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-red-500/80" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-red-500" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-red-900/30"
              >
                <FaSignInAlt />
                <span>Register</span>
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-red-500 font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
