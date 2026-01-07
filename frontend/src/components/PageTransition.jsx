import { motion } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -10,
    },
};

const pageTransition = {
    duration: 0.35,
    ease: "easeInOut",
};

export default function PageTransition({ children }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
}
