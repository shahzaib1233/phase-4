// Performance optimization utilities for the Todo application

/**
 * Debounce a function to limit how often it can run
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function to ensure it runs at most once per specified interval
 * @param func The function to throttle
 * @param limit The number of milliseconds to limit to
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize a function to cache results based on arguments
 * @param func The function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(func: T) {
  const cache = new Map<string, ReturnType<T>>();
  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Measure the execution time of a function
 * @param func The function to measure
 * @returns A wrapped function that logs execution time
 */
export function measurePerformance<T extends (...args: any[]) => any>(func: T) {
  return function (...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    console.log(`${func.name} took ${end - start} milliseconds`);
    return result;
  };
}

/**
 * Lazy load an image to improve initial page load performance
 * @param src The source URL of the image
 * @returns Promise that resolves when the image is loaded
 */
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Virtualize a list to improve performance with large datasets
 * @param items The full list of items
 * @param renderItem A function that renders an individual item
 * @param containerHeight The height of the container
 * @param itemHeight The height of each item
 * @returns JSX for the virtualized list
 */
export function virtualizeList<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  containerHeight: number,
  itemHeight: number
) {
  // This would be implemented as a React component in a real app
  // For now, returning a placeholder
  return {
    items,
    renderItem,
    containerHeight,
    itemHeight,
    visibleStart: 0,
    visibleEnd: Math.ceil(containerHeight / itemHeight),
  };
}

/**
 * Optimize rendering by batching state updates
 * @param updateFn Function that performs multiple state updates
 */
export function batchUpdates(updateFn: () => void) {
  // In React 18, this would use React.startTransition or flushSync
  // For now, we'll just execute the function
  updateFn();
}

/**
 * Create an optimized callback that doesn't change on every render
 * @param callback The callback function
 * @param dependencies The dependencies to watch
 * @returns The memoized callback
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  // This would be implemented as a custom React hook
  // For now, returning the callback directly
  return callback;
}

/**
 * Calculate the estimated time to complete based on progress
 * @param progress Current progress (0 to 1)
 * @param startTime When the operation started
 * @param currentProgress Current progress value
 * @returns Estimated time remaining in milliseconds
 */
export function calculateTimeRemaining(
  startTime: number,
  currentProgress: number
): number {
  if (currentProgress <= 0) return Infinity;
  if (currentProgress >= 1) return 0;

  const elapsed = Date.now() - startTime;
  const totalEstimate = elapsed / currentProgress;
  return totalEstimate - elapsed;
}

/**
 * Check if the device has limited performance capabilities
 * @returns Boolean indicating if performance is limited
 */
export function isLowPerformanceDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  // Check for low-end devices based on hardware concurrency
  const cores = navigator.hardwareConcurrency || 2;
  const isLowEnd = cores <= 2;

  // Check for slow network
  const connection = (navigator as any).connection;
  const isSlowNetwork = connection &&
    (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

  return isLowEnd || isSlowNetwork;
}

/**
 * Optimize animations based on device capabilities
 * @returns Boolean indicating if full animations should be used
 */
export function shouldUseFullAnimations(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  // Check if user prefers reduced motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check if device has limited performance
  const lowPerformance = isLowPerformanceDevice();

  return !reducedMotion && !lowPerformance;
}