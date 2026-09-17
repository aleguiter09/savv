"use client";

import { motion, useReducedMotion } from "motion/react";

const BRAND = "#155DFC";
const LINE = "#93C5FD";
const BAR = "#C5DBFF";

const EASE = [0.22, 1, 0.36, 1] as const;

const GROW_FROM_BASE = {
  transformBox: "fill-box" as const,
  transformOrigin: "50% 100%",
};

const PLANT_ORIGIN = {
  transformBox: "view-box" as const,
  transformOrigin: "152px 244px",
};

const STEM =
  "M152 244 C151.4 218 153.2 192 152 168 C151.2 154 152.6 152 152 146";
const CHART_LINE =
  "M28 198 C108 186 198 144 280 88 S 344 40 370 34";
const HILL =
  "M0 278 C72 214 138 198 198 216 C276 240 338 230 400 248 L400 300 L0 300 Z";
const SKY_CLIP =
  "M0 0 H400 V248 C338 230 276 240 198 216 C138 198 72 214 0 278 Z";

// Elongated pointed leaf. Stem at (0,0), tip up — reads as a leaf at any rotation.
const LEAF =
  "M0 0 C-6 1 -12 -8 -11 -22 C-10 -36 -5 -48 0 -52 C6 -48 13 -34 12 -20 C11 -8 6 1 0 0 Z";

const BARS = [
  { x: 214, y: 188, width: 24, height: 62, rx: 12, delay: 0.06, opacity: 0.38 },
  { x: 246, y: 164, width: 26, height: 86, rx: 13, delay: 0.22, opacity: 0.44 },
  { x: 280, y: 138, width: 28, height: 112, rx: 14, delay: 0.38, opacity: 0.4 },
  { x: 316, y: 114, width: 30, height: 136, rx: 15, delay: 0.54, opacity: 0.48 },
] as const;

const LEAVES = [
  { x: 154, y: 174, rotate: 38, scale: 0.78, delay: 0.04, unfold: -24 },
  { x: 149, y: 190, rotate: -52, scale: 0.84, delay: 0.22, unfold: 22 },
  { x: 151, y: 148, rotate: -8, scale: 0.98, delay: 0.42, unfold: -14 },
  { x: 156, y: 188, rotate: 122, scale: 0.72, delay: 0.62, unfold: -28 },
] as const;

type GrowthLeafProps = (typeof LEAVES)[number] & {
  reduceMotion: boolean;
};

function GrowthLeaf({
  x,
  y,
  rotate,
  scale,
  delay,
  unfold,
  reduceMotion,
}: GrowthLeafProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <motion.path
        d={LEAF}
        fill={BRAND}
        initial={
          reduceMotion ? false : { scale: 0.12, opacity: 0, rotate: unfold }
        }
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { delay, duration: 0.24, ease: EASE }
        }
        style={GROW_FROM_BASE}
      />
    </g>
  );
}

export function HeroBrandMark() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[4/3] w-[min(100%,18rem)] sm:w-[min(100%,22rem)] lg:mx-0 lg:w-[min(100%,28rem)]"
    >
      <svg
        viewBox="0 0 400 300"
        className="relative h-full w-full overflow-visible"
        fill="none"
      >
        <defs>
          <clipPath id="hero-growth-sky">
            <path d={SKY_CLIP} />
          </clipPath>
        </defs>

        <motion.path
          d={HILL}
          className="fill-primary-muted"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
        />

        <g clipPath="url(#hero-growth-sky)">
          {BARS.map((bar) => (
            <motion.rect
              key={bar.x}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              rx={bar.rx}
              fill={BAR}
              opacity={bar.opacity}
              initial={reduceMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { delay: bar.delay, duration: 0.52, ease: EASE }
              }
              style={GROW_FROM_BASE}
            />
          ))}
        </g>

        <motion.path
          d={CHART_LINE}
          stroke={LINE}
          strokeWidth="1.7"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.78 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  pathLength: { duration: 1.22, ease: EASE },
                  opacity: { duration: 0.28, ease: EASE },
                }
          }
        />

        <motion.circle
          cx="370"
          cy="34"
          r="3.5"
          fill={BRAND}
          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { delay: 1.08, duration: 0.22, ease: EASE }
          }
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        <motion.g
          initial={reduceMotion ? false : { scale: 0.58 }}
          animate={{ scale: 1 }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 1.05, ease: EASE }
          }
          style={PLANT_ORIGIN}
        >
          <motion.g
            animate={
              reduceMotion
                ? { rotate: 0 }
                : { rotate: [0, 0, -1.15, 0.85, -0.65, 0] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 6.2,
                    times: [0, 0.22, 0.4, 0.58, 0.78, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={PLANT_ORIGIN}
          >
            <motion.path
              d={STEM}
              stroke={BRAND}
              strokeWidth="2.25"
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.4, ease: EASE }
              }
            />

            {LEAVES.map((leaf) => (
              <GrowthLeaf
                key={`${leaf.x}-${leaf.rotate}`}
                {...leaf}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
