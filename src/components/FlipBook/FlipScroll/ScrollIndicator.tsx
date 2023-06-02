import styles from "./index.module.less";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import animationData from "../../../assets/json/scroll-down.json";

const variants = {
  show: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: 0 },
};

const ScrollIndicator = () => {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef();
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    const timeout = setTimeout(() => {
      setVisible(false);
      anim.destroy();
    }, 6000);

    return () => {
      anim.destroy();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          className={styles.scrollIndicator}
          variants={variants}
          initial="closed"
          animate={"show"}
          exit={"closed"}
          transition={{ duration: 0.5, yoyo: Infinity }}
        />
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
