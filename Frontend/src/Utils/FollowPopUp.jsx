import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaInstagram, FaGithub } from "react-icons/fa";

const FollowPopup = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-gray-950/70"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            aria-label="Close follow popup"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 p-1 mb-4">
              <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                <img
                  src="https://avatars.githubusercontent.com/u/160850571?v=4"
                  alt="Developer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-white">
              Follow the Developer
            </h3>
            <p className="text-gray-400 mb-6">
              Stay updated with the latest from{" "}
              <span className="font-semibold text-red-400">
                RaktFlow
              </span>
            </p>

            <div className="flex space-x-4 w-full">
              <a
                href="https://www.instagram.com/201harshs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-3 px-4 bg-gradient-to-br from-red-600 to-red-700 rounded-lg hover:opacity-90 transition text-white"
              >
                <FaInstagram className="mr-2" />
                Instagram
              </a>
              <a
                href="https://github.com/201Harsh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition bg-gray-800 hover:bg-gray-700 text-white"
              >
                <FaGithub className="mr-2" />
                GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowPopup;