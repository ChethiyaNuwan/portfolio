"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setShow(false);
    });
  }, []);

  return (
    <AnimatePresence>
      {show && (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.6, y: -800 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-inherit"
      >
        <div className="text-center">
          <div className="mb-4 text-4xl font-bold tracking-tight text-white animate-pulse">
            W E L C O M E
          </div>
          <div className="w-40 h-1 mx-auto bg-gray-700 rounded-full">
            <div className="h-full bg-current rounded-full animate-ping" />
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
