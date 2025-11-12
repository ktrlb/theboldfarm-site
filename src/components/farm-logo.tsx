"use client";

import Image from "next/image";
import { useHeroContext } from "./hero-with-image";

interface FarmLogoProps {
  /**
   * Variant determines which logo to use based on background
   * - "light": Black text logo (for light backgrounds)
   * - "dark": White text logo (for dark backgrounds)
   * - "auto": Automatically chooses based on HeroWithImage context
   */
  variant?: "light" | "dark" | "auto";
  /**
   * Whether to use the full "the BOLD farm" logo or just "BOLD"
   */
  full?: boolean;
  /**
   * Size of the logo
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom width (overrides size)
   */
  width?: number;
  /**
   * Custom height (overrides size)
   */
  height?: number;
  /**
   * Priority loading
   */
  priority?: boolean;
}

const sizeMap = {
  sm: { width: 100, height: 33, className: "h-8 w-auto" },
  md: { width: 120, height: 40, className: "h-10 w-auto" },
  lg: { width: 250, height: 83, className: "h-20 w-auto" },
  xl: { width: 500, height: 167, className: "h-40 w-auto" },
};

export function FarmLogo({
  variant = "light",
  full = false,
  size = "md",
  className = "",
  width,
  height,
  priority = false,
}: FarmLogoProps) {
  // Get hero context for auto detection (safe to call - returns default if not in provider)
  const heroContext = useHeroContext();

  // Determine which logo file to use
  let isDark = false;
  if (variant === "dark") {
    isDark = true;
  } else if (variant === "auto") {
    // If inside HeroWithImage, use hasImage to determine (dark overlay = white text)
    isDark = heroContext.hasImage;
  }
  // variant === "light" defaults to isDark = false
  
  const logoFileName = full
    ? isDark
      ? "/theboldfarm_theBOLDfarm - white text.png"
      : "/theboldfarm_theBOLDfarm - black text.png"
    : isDark
    ? "/theboldfarm_BOLD - white text.png"
    : "/theboldfarm_BOLD - black text.png";

  const sizeConfig = sizeMap[size];
  const finalWidth = width || sizeConfig.width;
  const finalHeight = height || sizeConfig.height;
  const finalClassName = `${sizeConfig.className} ${className}`.trim();

  return (
    <Image
      src={logoFileName}
      alt="The Bold Farm Logo"
      width={finalWidth}
      height={finalHeight}
      className={finalClassName}
      priority={priority}
    />
  );
}

