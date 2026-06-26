import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsAnimating(true);

      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setIsAnimating(false);
      }, 900);

      return () => clearTimeout(timeout);
    }
  }, [location.pathname, displayLocation.pathname]);

  return (
    <>
      {/* PAGE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayLocation.pathname}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* OVERLAY LOGO */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-[#E5DACE] z-[9999]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <motion.img
              src="/logo.svg"
              className="w-30"
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 1 }}
            //   exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
