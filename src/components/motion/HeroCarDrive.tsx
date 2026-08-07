"use client";

import { motion } from "framer-motion";

export default function HeroCarDrive() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-2 z-0 overflow-hidden sm:-bottom-4">
      <motion.div
        initial={{ x: "-30vw", opacity: 0 }}
        animate={{ x: "130vw", opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 2.6,
          ease: [0.45, 0, 0.2, 1],
          opacity: { duration: 2.6, times: [0, 0.12, 0.82, 1] },
        }}
        className="w-[280px] sm:w-[360px]"
      >
        <svg
          viewBox="0 0 240 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full text-accent"
        >
          <path
            d="M8 48c8-1 14-2 20-6 6-5 10-14 20-18 9-4 22-5 32-5h34c9 0 16 3 21 9l6 7h48c8 0 14 3 18 9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 48c0 0 30 2 46 2s70-1 84 0 62 2 70-3"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M96 20v22M150 25l10 17"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="58" cy="52" r="13" stroke="currentColor" strokeWidth="3" />
          <circle cx="182" cy="52" r="13" stroke="currentColor" strokeWidth="3" />
          <path
            d="M2 44c4 2 8 2 12 1"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
