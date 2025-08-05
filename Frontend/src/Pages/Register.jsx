import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../Config/Axios";
import { toast, Bounce } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions of RaktFlow.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await AxiosInstance.post("/users/register", formData);

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        setIsSubmitting(false);
        setIsVerified(true);
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.User.username);
        Navigate("/chat");

      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setIsSubmitting(false);
      setIsVerified(false);
    }

    // Simulate verification process
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // setIsVerified(true);

    // // Simulate successful registration
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   setIsVerified(false);
    //   // Handle actual registration logic here
    // }, 1000);
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

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-4 flex items-center"
              >
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  required
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                />
                <label
                  htmlFor="terms-checkbox"
                  className="ml-2 text-sm text-gray-200"
                >
                  I agree to all terms and conditions of RaktFlow
                </label>
              </motion.div>

              <motion.button
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isVerified ? "bg-green-600" : "bg-red-600"
                } text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                  isVerified ? "shadow-green-900/30" : "shadow-red-900/30"
                }`}
              >
                {isSubmitting ? (
                  <>
                    {isVerified ? (
                      <FaCheck className="animate-bounce" />
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <FaSpinner />
                      </motion.div>
                    )}
                    <span>{isVerified ? "Verified!" : "Verifying..."}</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Register</span>
                  </>
                )}
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
