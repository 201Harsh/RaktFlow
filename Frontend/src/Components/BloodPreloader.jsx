import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaTint } from "react-icons/fa";

const BloodPreloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();
  const textControls = useAnimation();

  // Realistic blood viscosity simulation
  const bloodVariants = {
    initial: { scaleY: 0, originY: 0 },
    flowing: {
      scaleY: 1,
      transition: {
        duration: 3.5,
        ease: [0.16, 0.77, 0.47, 0.97], // Custom easing for viscous flow
      },
    },
  };

  // Blood drip effects
  const dripVariants = {
    falling: (i) => ({
      y: ["0%", "100%"],
      opacity: [0.8, 0],
      transition: {
        delay: 0.5 + i * 0.3,
        duration: 1.5 + Math.random(),
        repeat: Infinity,
        repeatDelay: 3 + Math.random() * 4,
      },
    }),
    splatter: {
      scale: [1, 1.5, 1],
      opacity: [0, 0.7, 0],
      transition: { duration: 0.8 },
    },
  };

  useEffect(() => {
    // Start blood flow
    controls.start("flowing");

    // Progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Final animation before exiting
          setTimeout(() => {
            textControls.start({
              opacity: 0,
              transition: { duration: 0.5 },
            });
            setTimeout(onFinish, 500);
          }, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    // Text reveal sequence
    const sequence = async () => {
      await textControls.start({ opacity: 1, y: 0 }, { delay: 1.2 });
      await textControls.start({
        scale: 1.05,
        transition: { repeat: 3, repeatType: "reverse", duration: 0.3 },
      });
    };
    sequence();

    return () => clearInterval(interval);
  }, [controls, textControls, onFinish]);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Dark background with subtle texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMxMDAwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20" />

      {/* Main blood flow */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full origin-top"
        variants={bloodVariants}
        initial="initial"
        animate="controls"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(120, 0, 0, 0.9) 0%, 
            rgba(80, 0, 0, 0.95) 30%, 
            rgba(60, 0, 0, 1) 70%)`,
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.7)",
          filter: "blur(0.5px)",
        }}
      >
        {/* Blood viscosity streaks */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 h-full bg-red-900/40"
              style={{
                width: `${2 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: -100 }}
              animate={{
                y: "100%",
                transition: {
                  delay: 0.5 + i * 0.2,
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Blood drips */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <React.Fragment key={i}>
            <motion.div
              className="absolute top-0 text-red-800"
              style={{
                left: `${5 + Math.random() * 90}%`,
                fontSize: `${8 + Math.random() * 10}px`,
              }}
              variants={dripVariants}
              custom={i}
              animate="falling"
            />
            <motion.div
              className="absolute bottom-0 text-red-700 opacity-0"
              style={{
                left: `${5 + Math.random() * 90}%`,
                fontSize: `${15 + Math.random() * 20}px`,
              }}
              variants={dripVariants}
              animate="splatter"
            />
          </React.Fragment>
        ))}
      </div>

      {/* Pulsing veins overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, transparent 70%, #300 100%)",
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* RaktFlow text with creepy reveal */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={textControls}
      >
        <div className="relative z-10 text-center">
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <FaTint className="text-red-600 text-5xl mr-3" />
            </motion.div>
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="text-white">Rakt</span>
              <motion.span
                className="text-red-600"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255,0,0,0.5)",
                    "0 0 20px rgba(255,0,0,0.8)",
                    "0 0 5px rgba(255,0,0,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                Flow
              </motion.span>
            </h1>
          </motion.div>

          {/* Progress bar with heartbeat pulse */}
          <motion.div
            className="mt-8 h-2 bg-gray-800 rounded-full overflow-hidden max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="h-full bg-red-600 rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: "0 0 10px rgba(255,0,0,0.7)",
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Large percent counter in bottom right corner */}
      <motion.div
        className="absolute bottom-8 right-8 text-red-500 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-6xl font-bold">{progress}%</div>
      </motion.div>

      {/* Subtle screen flicker for horror effect */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.03, 0, 0.01, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          times: [0, 0.05, 0.06, 0.07, 1],
        }}
      />
    </div>
  );
};

export default BloodPreloader;
