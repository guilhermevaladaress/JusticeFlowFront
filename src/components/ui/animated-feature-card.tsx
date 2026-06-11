import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface AnimatedFeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  index: string;
  tag: string;
  title: React.ReactNode;
  imageSrc: string;
  color: "orange" | "purple" | "blue";
}

const colorVariants = {
  orange: {
    "--feature-color": "hsl(35, 91%, 55%)",
    "--feature-color-light": "hsl(41, 100%, 85%)",
    "--feature-color-dark": "hsl(24, 98%, 98%)",
  },
  purple: {
    "--feature-color": "hsl(262, 85%, 60%)",
    "--feature-color-light": "hsl(261, 100%, 87%)",
    "--feature-color-dark": "hsl(264, 100%, 98%)",
  },
  blue: {
    "--feature-color": "hsl(211, 100%, 60%)",
    "--feature-color-light": "hsl(210, 100%, 83%)",
    "--feature-color-dark": "hsl(216, 100%, 98%)",
  },
};

const AnimatedFeatureCard = React.forwardRef<HTMLDivElement, AnimatedFeatureCardProps>(
  ({ className, index, tag, title, imageSrc, color, ...props }, ref) => {
    const cardStyle = colorVariants[color] as React.CSSProperties;

    return (
      <motion.div
        ref={ref}
        style={cardStyle}
        className={cn(
          "relative flex h-[420px] w-full max-w-sm flex-col justify-end overflow-hidden rounded-2xl border bg-white shadow-sm",
          className
        )}
        whileHover="hover"
        initial="initial"
        variants={{
          initial: { y: 0 },
          hover: { y: -10 },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        {...props}
      >
        {/* Background Gradient */}
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 30%, var(--feature-color-light) 0%, transparent 70%)`,
          }}
        />

        {/* Index Number */}
        <div className="absolute top-5 left-5 z-10 font-mono text-sm font-bold text-white/60 drop-shadow">
          {index}
        </div>

        {/* Logo / Image */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          variants={{
            initial: { scale: 1, y: 0 },
            hover: { scale: 1.15, y: -12 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <img
            src={imageSrc}
            alt={tag}
            className="w-40 h-40 object-contain"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 rounded-lg border bg-white/80 p-4 backdrop-blur-sm">
          <span
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: "var(--feature-color-dark)",
              color: "var(--feature-color)",
            }}
          >
            {tag}
          </span>
          <p className="text-base text-gray-800 leading-snug">{title}</p>
        </div>
      </motion.div>
    );
  }
);
AnimatedFeatureCard.displayName = "AnimatedFeatureCard";

export { AnimatedFeatureCard };
