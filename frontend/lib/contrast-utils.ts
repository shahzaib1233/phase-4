// Utility functions for checking color contrast ratios
// Based on WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB
 * @param hex - Hex color string (e.g., "#ffffff" or "ffffff")
 * @returns RGB object
 */
function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to relative luminance
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Relative luminance value
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;

  const rSRGB = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const gSRGB = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const bSRGB = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

  return 0.2126 * rSRGB + 0.7152 * gSRGB + 0.0722 * bSRGB;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if two colors meet WCAG AA contrast standards
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @param isLargeText - Whether the text is large (18pt+) or bold large (14pt+)
 * @returns Whether the colors meet contrast requirements
 */
export function meetsContrastRequirements(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(color1, color2);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get color readability information
 * @param color1 - Background color in hex format
 * @param color2 - Text color in hex format
 * @param isLargeText - Whether the text is large (18pt+) or bold large (14pt+)
 * @returns Object containing contrast ratio and compliance status
 */
export function getColorReadability(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  level: 'fail' | 'aa' | 'aaa';
} {
  const ratio = getContrastRatio(color1, color2);
  const meetsAA = isLargeText ? ratio >= 3 : ratio >= 4.5;
  const meetsAAA = isLargeText ? ratio >= 4.5 : ratio >= 7;

  let level: 'fail' | 'aa' | 'aaa' = 'fail';
  if (meetsAAA) level = 'aaa';
  else if (meetsAA) level = 'aa';

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    meetsAA,
    meetsAAA,
    level,
  };
}