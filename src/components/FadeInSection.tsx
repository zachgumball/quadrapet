import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Props {
  children: React.ReactNode;
}

const FadeInSection: React.FC<Props> = ({ children }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
