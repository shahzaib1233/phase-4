// Responsive utility functions for the Todo application

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: 640,  // Small screens (mobile)
  md: 768,  // Medium screens (tablet)
  lg: 1024, // Large screens (laptop)
  xl: 1280, // Extra large screens (desktop)
  '2xl': 1536, // 2x extra large screens
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Check if the current screen width is greater than or equal to a specific breakpoint
 * @param breakpoint The breakpoint to check against
 * @returns Boolean indicating if the screen is at least the specified size
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') {
    // Default to false on the server
    return false;
  }

  const mediaQuery = `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
  return window.matchMedia(mediaQuery).matches;
}

/**
 * Get the current device type based on screen width
 * @returns Device type as 'mobile', 'tablet', 'laptop', or 'desktop'
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'laptop'; // Default to laptop size on the server
  }

  const width = window.innerWidth;

  if (width < BREAKPOINTS.md) {
    return 'mobile';
  } else if (width < BREAKPOINTS.lg) {
    return 'tablet';
  } else if (width < BREAKPOINTS.xl) {
    return 'laptop';
  } else {
    return 'desktop';
  }
}

/**
 * Check if the current device is mobile
 * @returns Boolean indicating if the device is mobile
 */
export function isMobile(): boolean {
  return getDeviceType() === 'mobile';
}

/**
 * Check if the current device is tablet
 * @returns Boolean indicating if the device is tablet
 */
export function isTablet(): boolean {
  return getDeviceType() === 'tablet';
}

/**
 * Check if the current device is desktop
 * @returns Boolean indicating if the device is desktop
 */
export function isDesktop(): boolean {
  return getDeviceType() === 'laptop' || getDeviceType() === 'desktop';
}

/**
 * Get CSS media query string for a specific breakpoint
 * @param breakpoint The breakpoint to get the query for
 * @returns CSS media query string
 */
export function getMediaQuery(breakpoint: Breakpoint): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Hook to get responsive values based on screen size
 * @param values Object with values for each breakpoint
 * @returns The appropriate value for the current screen size
 */
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>> & { base: T }
): T {
  if (typeof window === 'undefined') {
    return values.base;
  }

  const width = window.innerWidth;

  // Check breakpoints from largest to smallest
  if (width >= BREAKPOINTS['2xl'] && values['2xl'] !== undefined) {
    return values['2xl'];
  } else if (width >= BREAKPOINTS.xl && values.xl !== undefined) {
    return values.xl;
  } else if (width >= BREAKPOINTS.lg && values.lg !== undefined) {
    return values.lg;
  } else if (width >= BREAKPOINTS.md && values.md !== undefined) {
    return values.md;
  } else if (width >= BREAKPOINTS.sm && values.sm !== undefined) {
    return values.sm'];
  } else {
    return values.base;
  }
}