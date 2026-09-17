"use client";

import { motion, useReducedMotion } from "motion/react";

const BRAND = "#155DFC";
const LINE = "#93C5FD";
const BAR = "#A8C7FF";
const HILL_SOFT = "#D6E6FF";
const HILL_MID = "#EAF1FF";
const SPROUT = "#8BB4FF";

const EASE = [0.22, 1, 0.36, 1] as const;

const GROW_FROM_BASE = {
  transformBox: "fill-box" as const,
  transformOrigin: "50% 100%",
};

const PLANT_ORIGIN = {
  transformBox: "view-box" as const,
  transformOrigin: "168px 248px",
};

const HILL_BACK =
  "M0 236 C48 198 96 186 148 198 C210 214 268 188 320 204 C360 216 384 228 400 238 L400 300 L0 300 Z";
const HILL_MID_PATH =
  "M0 258 C58 228 118 214 176 228 C248 248 300 232 352 246 C376 254 392 262 400 268 L400 300 L0 300 Z";
const HILL_FRONT =
  "M0 276 C70 252 130 246 190 258 C250 270 310 256 360 268 C382 274 394 280 400 284 L400 300 L0 300 Z";
const CHART_LINE =
  "M42 208 C110 196 168 168 220 138 S 300 72 358 48";

const STEM =
  "M168 248 C167.5 226 168.6 204 168 184 C167.5 170 168.3 160 168 150";

/**
 * Almond leaf: stem joint at (0,0), tip at (0,-56).
 * Reads as a soft ovate leaf at any rotation.
 */
const LEAF =
  "M0 0 C-4 1 -11 -4 -12 -18 C-13 -34 -8 -48 0 -56 C8 -48 13 -34 12 -18 C11 -4 4 1 0 0 Z";
const LEAF_VEIN = "M0 -4 C0 -18 0 -36 0 -50";

const BARS = [
  { x: 188, y: 176, width: 28, height: 72, rx: 14, delay: 0.18, opacity: 0.28 },
  { x: 226, y: 148, width: 30, height: 100, rx: 15, delay: 0.32, opacity: 0.34 },
  { x: 266, y: 118, width: 32, height: 130, rx: 16, delay: 0.46, opacity: 0.3 },
  { x: 308, y: 88, width: 34, height: 160, rx: 17, delay: 0.6, opacity: 0.38 },
] as const;

const LINE_MARKERS = [
  { cx: 128, cy: 186, delay: 0.55 },
  { cx: 236, cy: 126, delay: 0.82 },
] as const;

/** Bottom → top: fuller sprout with layered foliage. */
const LEAVES = [
  { x: 165, y: 220, rotate: -62, scale: 0.55, delay: 0.68, unfold: 34 },
  { x: 171, y: 214, rotate: 58, scale: 0.58, delay: 0.74, unfold: -32 },
  { x: 164, y: 198, rotate: -44, scale: 0.74, delay: 0.82, unfold: 26 },
  { x: 172, y: 192, rotate: 40, scale: 0.8, delay: 0.9, unfold: -24 },
  { x: 165, y: 176, rotate: -28, scale: 0.86, delay: 0.98, unfold: 18 },
  { x: 171, y: 170, rotate: 24, scale: 0.9, delay: 1.06, unfold: -16 },
  { x: 168, y: 152, rotate: -4, scale: 1.05, delay: 1.14, unfold: -10 },
] as const;

const SPROUTS = [
  {
    x: 86,
    y: 252,
    scale: 0.42,
    delay: 1.22,
    leaves: [
      { rotate: -42, scale: 0.72 },
      { rotate: 36, scale: 0.78 },
      { rotate: -8, scale: 0.55 },
    ],
  },
  {
    x: 236,
    y: 268,
    scale: 0.3,
    delay: 1.34,
    leaves: [
      { rotate: -38, scale: 0.7 },
      { rotate: 42, scale: 0.74 },
    ],
  },
  {
    x: 292,
    y: 262,
    scale: 0.36,
    delay: 1.4,
    leaves: [
      { rotate: -36, scale: 0.68 },
      { rotate: 44, scale: 0.72 },
      { rotate: 6, scale: 0.5 },
    ],
  },
] as const;

type MotionFlag = Readonly<{ reduceMotion: boolean }>;

function GrowthLeaf({
  x,
  y,
  rotate,
  scale,
  delay,
  unfold,
  reduceMotion,
}: (typeof LEAVES)[number] & MotionFlag) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <motion.g
        initial={
          reduceMotion ? false : { scale: 0.12, opacity: 0, rotate: unfold }
        }
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { delay, duration: 0.4, ease: EASE }
        }
        style={GROW_FROM_BASE}
      >
        <path d={LEAF} fill={BRAND} />
        <path
          d={LEAF_VEIN}
          stroke="#EEF4FF"
          strokeWidth="1.35"
          strokeLinecap="round"
          opacity={0.55}
          fill="none"
        />
      </motion.g>
    </g>
  );
}

function SoftSprout({
  x,
  y,
  scale,
  delay,
  leaves,
  reduceMotion,
}: (typeof SPROUTS)[number] & MotionFlag) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <motion.g
        initial={reduceMotion ? false : { opacity: 0, scale: 0.35 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { delay, duration: 0.4, ease: EASE }
        }
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      >
        <path
          d="M0 18 C-0.4 8 0.4 -2 0 -10"
          stroke={SPROUT}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {leaves.map((leaf) => (
          <g
            key={`${leaf.rotate}-${leaf.scale}`}
            transform={`translate(0 -6) rotate(${leaf.rotate}) scale(${leaf.scale})`}
          >
            <path d={LEAF} fill={SPROUT} opacity={0.8} />
            <path
              d={LEAF_VEIN}
              stroke="#F5F9FF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={0.4}
              fill="none"
            />
          </g>
        ))}
      </motion.g>
    </g>
  );
}

function SoftHills({ reduceMotion }: MotionFlag) {
  return (
    <>
      <motion.path
        d={HILL_BACK}
        fill="url(#hero-hill-back)"
        filter="url(#hero-soft-shadow)"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
      />
      <motion.path
        d={HILL_MID_PATH}
        fill="url(#hero-hill-mid)"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.5,
          delay: reduceMotion ? 0 : 0.08,
          ease: EASE,
        }}
      />
      <motion.path
        d={HILL_FRONT}
        className="fill-primary-muted"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 0.92, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.55,
          delay: reduceMotion ? 0 : 0.14,
          ease: EASE,
        }}
      />
    </>
  );
}

function ChartBars({ reduceMotion }: MotionFlag) {
  return (
    <>
      {BARS.map((bar) => (
        <motion.rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          rx={bar.rx}
          fill="url(#hero-bar-fill)"
          opacity={bar.opacity}
          initial={reduceMotion ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { delay: bar.delay, duration: 0.58, ease: EASE }
          }
          style={GROW_FROM_BASE}
        />
      ))}
    </>
  );
}

function ChartTrend({ reduceMotion }: MotionFlag) {
  return (
    <>
      <motion.path
        d={CHART_LINE}
        stroke={LINE}
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                pathLength: { duration: 1.15, delay: 0.35, ease: EASE },
                opacity: { duration: 0.3, delay: 0.35, ease: EASE },
              }
        }
      />
      {LINE_MARKERS.map((marker) => (
        <motion.circle
          key={`${marker.cx}-${marker.cy}`}
          cx={marker.cx}
          cy={marker.cy}
          r="4"
          fill="#FFFFFF"
          stroke={LINE}
          strokeWidth="1.6"
          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { delay: marker.delay, duration: 0.24, ease: EASE }
          }
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />
      ))}
      <motion.circle
        cx="358"
        cy="48"
        r="5"
        fill={BRAND}
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { delay: 1.28, duration: 0.26, ease: EASE }
        }
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
      />
    </>
  );
}

function MainPlant({ reduceMotion }: MotionFlag) {
  return (
    <motion.g
      initial={reduceMotion ? false : { scale: 0.55 }}
      animate={{ scale: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: 0.55, duration: 0.95, ease: EASE }
      }
      style={PLANT_ORIGIN}
    >
      <motion.g
        animate={
          reduceMotion
            ? { rotate: 0 }
            : { rotate: [0, 0, -1.2, 0.9, -0.7, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 6.4,
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
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { delay: 0.6, duration: 0.42, ease: EASE }
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
  );
}

function HeroMarkDefs() {
  return (
    <defs>
      <linearGradient id="hero-bar-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={BAR} stopOpacity="0.95" />
        <stop offset="100%" stopColor={BAR} stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id="hero-hill-back" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={HILL_SOFT} stopOpacity="0.95" />
        <stop offset="100%" stopColor={HILL_MID} stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id="hero-hill-mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={HILL_MID} stopOpacity="1" />
        <stop offset="100%" stopColor="#F5F9FF" stopOpacity="0.9" />
      </linearGradient>
      <filter id="hero-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="6"
          floodColor="#155DFC"
          floodOpacity="0.08"
        />
      </filter>
    </defs>
  );
}

export function HeroBrandMark() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-4/3 w-[min(100%,18rem)] sm:w-[min(100%,22rem)] lg:mx-0 lg:w-[min(100%,28rem)]"
    >
      <svg
        viewBox="0 0 400 300"
        className="relative h-full w-full overflow-visible"
        fill="none"
      >
        <HeroMarkDefs />
        <ChartBars reduceMotion={reduceMotion} />
        <SoftHills reduceMotion={reduceMotion} />
        <ChartTrend reduceMotion={reduceMotion} />
        {SPROUTS.map((sprout) => (
          <SoftSprout
            key={`${sprout.x}-${sprout.y}`}
            {...sprout}
            reduceMotion={reduceMotion}
          />
        ))}
        <MainPlant reduceMotion={reduceMotion} />
      </svg>
    </div>
  );
}
