'use client';

import { motion } from 'framer-motion';
import { FaCloud } from 'react-icons/fa';

export default function CloudBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Large clouds */}
      <motion.div
        className="absolute top-20 left-0 text-white/30"
        animate={{
          x: ['0%', '100%', '0%'],
          y: ['0%', '-10%', '0%'],
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <FaCloud size={200} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-0 text-white/30"
        animate={{
          x: ['0%', '-100%', '0%'],
          y: ['0%', '-15%', '0%'],
        }}
        transition={{
          x: {
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <FaCloud size={150} />
      </motion.div>

      {/* Medium clouds */}
      <motion.div
        className="absolute top-60 left-1/4 text-white/30"
        animate={{
          x: ['0%', '100%', '0%'],
          y: ['0%', '-8%', '0%'],
        }}
        transition={{
          x: {
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <FaCloud size={120} />
      </motion.div>

      <motion.div
        className="absolute top-80 right-1/4 text-white/30"
        animate={{
          x: ['0%', '-100%', '0%'],
          y: ['0%', '-12%', '0%'],
        }}
        transition={{
          x: {
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <FaCloud size={100} />
      </motion.div>

      {/* Small clouds */}
      <motion.div
        className="absolute top-40 left-1/2 text-white/30"
        animate={{
          x: ['0%', '100%', '0%'],
          y: ['0%', '-5%', '0%'],
        }}
        transition={{
          x: {
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <FaCloud size={80} />
      </motion.div>

      <motion.div
        className="absolute top-70 right-1/2 text-white/30"
        animate={{
          x: ['0%', '-100%', '0%'],
          y: ['0%', '-10%', '0%'],
        }}
        transition={{
          x: {
            duration: 14,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <FaCloud size={60} />
      </motion.div>
    </div>
  );
} 