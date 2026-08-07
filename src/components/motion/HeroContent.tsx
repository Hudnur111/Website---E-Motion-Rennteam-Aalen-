"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroContent({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={container}>
      <motion.p
        variants={item}
        className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={item}
        className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
      >
        <span className="text-gradient-accent">{title}</span>
      </motion.h1>
      <motion.p variants={item} className="mt-6 max-w-xl text-lg text-muted">
        {subtitle}
      </motion.p>
      <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/fahrzeuge"
          className="group relative overflow-hidden rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          <span className="relative z-10">Unser Fahrzeug entdecken</span>
        </Link>
        <Link
          href="/sponsoren"
          className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:bg-surface"
        >
          Sponsor werden
        </Link>
      </motion.div>
    </motion.div>
  );
}
