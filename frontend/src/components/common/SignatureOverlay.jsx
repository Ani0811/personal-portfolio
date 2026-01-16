import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SignatureOverlay() {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  // Cursive signature path for "Anirudha Basu Thakur"
  const signaturePath = "M50,60 Q60,35 75,55 L80,65 M85,45 Q90,60 100,65 Q105,68 110,60 M115,45 L115,70 M120,45 Q125,60 135,62 Q140,64 145,58 L150,70 M155,45 Q165,68 175,70 Q180,72 185,65 M190,45 Q195,65 205,68 L210,70 M220,50 Q230,45 240,52 Q250,58 255,52 M260,50 Q265,60 275,62 L285,72 M290,52 Q300,68 310,70 Q320,72 325,65 M340,50 Q350,45 360,52 L365,68 M370,50 Q375,65 385,68 L390,70 M395,50 Q405,68 415,70 Q425,72 435,65 L440,72 M445,50 Q450,65 460,68 L465,72 M470,50 Q480,68 490,70 Q500,72 510,68 L515,72";

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 0.95,
      // subtle stroke-width keyframes to emulate hand-drawn variation
      strokeWidth: [3.2, 2.6, 3.0, 2.6],
      transition: {
        // slow-down easing (ease-out feeling) for the draw
        pathLength: {
          duration: 2.6,
          ease: [0.0, 0.0, 0.2, 1],
        },
        strokeWidth: {
          duration: 2.6,
          ease: 'easeInOut',
          times: [0, 0.6, 0.9, 1],
        },
        opacity: {
          duration: 0.25,
        },
      },
    },
    faded: {
      // final fade-out after the draw finishes
      opacity: 0,
      strokeWidth: 1.6,
      transition: {
        duration: 0.9,
        ease: [0.0, 0.0, 0.2, 1],
      },
    },
  };

  const containerStyle = {
    right: '4%',
    bottom: '6%',
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  if (!show) return null;

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={fading ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <svg
        width="480"
        height="90"
        viewBox="0 0 520 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="signature-svg"
      >
        <motion.path
          d={signaturePath}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={pathVariants}
          initial="hidden"
          animate={fading ? 'faded' : 'visible'}
          onAnimationComplete={() => {
            // after drawing completes, start fade and unmount
            // small delay to let the user see the finished signature
            setTimeout(() => setFading(true), 420);
            // unmount after fade completes
            setTimeout(() => setShow(false), 420 + 900 + 150);
          }}
          style={{
            color: 'var(--color-accent)',
            filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.15))',
            // keep path slightly translucent while drawing
            opacity: 0.98,
          }}
        />
      </svg>
    </motion.div>
  );
}
