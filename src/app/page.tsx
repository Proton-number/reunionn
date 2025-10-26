"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, Video, Headphones, AudioLines } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40 overflow-hidden">
      <section className="relative w-full max-w-4xl">
        {/* scattered decorative icons */}

        <motion.div
          className="pointer-events-none absolute -bottom-8 -right-8 z-0 text-neutral-300"
          initial={{ opacity: 0, scale: 0.8, x: -10, y: -10 }}
          animate={{ opacity: 1, scale: 1, x: [0, -8, 0], y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <AudioLines className="w-12 h-12 md:w-16 md:h-16" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute -top-8 -left-8 z-0 text-neutral-300"
          initial={{ opacity: 0, scale: 0.8, x: -10, y: -10 }}
          animate={{ opacity: 1, scale: 1, x: [0, -8, 0], y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Camera className="w-12 h-12 md:w-16 md:h-16" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute -top-6 right-4 z-0 text-neutral-300"
          initial={{ opacity: 0, scale: 0.9, x: 10, y: -6 }}
          animate={{ opacity: 1, scale: 1, x: [0, 6, 0], y: [0, -6, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Video className="w-10 h-10 md:w-14 md:h-14" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-4 left-6 z-0 text-neutral-300"
          initial={{ opacity: 0, scale: 0.85, x: -6, y: 10 }}
          animate={{ opacity: 1, scale: 1, x: [0, -6, 0], y: [0, 8, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Headphones className="w-11 h-11 md:w-16 md:h-16" />
        </motion.div>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl  md:text-8xl font-bold tracking-tight leading-none"
          >
            Annual Reunion <span className="text-neutral-400">Memories</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto"
          >
            Relive each reunion through timeless photos and films. Crafted with
            nostalgia. Designed to be remembered.
          </motion.p>

          <Link href={"/Gallery"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button className="cursor-pointer p-6 px-10 lg:text-lg font-semibold mt-8">
                View Gallery
              </Button>
            </motion.div>
          </Link>
        </div>
      </section>
    </main>
  );
}
