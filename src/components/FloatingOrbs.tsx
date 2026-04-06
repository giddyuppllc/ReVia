"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 400, x: "-5%", y: "-10%", delay: 0, duration: 25, color: "#A38569" },
  { size: 500, x: "55%", y: "5%", delay: 3, duration: 30, color: "#8B6D4F" },
  { size: 350, x: "75%", y: "50%", delay: 6, duration: 22, color: "#B8A68F" },
  { size: 450, x: "10%", y: "40%", delay: 2, duration: 28, color: "#A38569" },
  { size: 380, x: "40%", y: "70%", delay: 5, duration: 26, color: "#D1C7B8" },
];

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            opacity: 0.07,
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 100, -60, 80, 0],
            y: [0, -50, 80, -30, 0],
            scale: [1, 1.3, 0.9, 1.2, 1],
            opacity: [0.07, 0.12, 0.06, 0.1, 0.07],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
