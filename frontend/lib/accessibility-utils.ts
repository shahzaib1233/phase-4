// Accessibility utility functions for the Todo application

/**
 * Focus trap utility to keep focus within a specific element
 * @param container The element to trap focus within
 */
export function createFocusTrap(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus the first element when focus trap is created
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Generate a unique ID for accessibility purposes
 * @param prefix Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if the user prefers reduced motion
 * @returns Boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers dark color scheme
 * @returns Boolean indicating if dark mode is preferred
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Announce a message to screen readers
 * @param message The message to announce
 */
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the announcement after a delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Scroll to an element with smooth behavior if not disabled by user preference
 * @param element The element to scroll to
 * @param behavior Optional scroll behavior override
 */
export function smoothScrollTo(
  element: Element,
  behavior: 'auto' | 'smooth' = 'auto'
) {
  const scrollBehavior = prefersReducedMotion() ? 'auto' : behavior;
  element.scrollIntoView({ behavior: scrollBehavior });
}

/**
 * Utility to manage focus visibility for keyboard vs mouse navigation
 */
export function setupFocusVisible() {
  let keyboardActive = true;

  const handleMouseDown = () => {
    keyboardActive = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      keyboardActive = true;
    }
  };

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('keydown', handleKeyDown);

  // Add class to body based on navigation method
  const updateFocusStyle = () => {
    if (keyboardActive) {
      document.body.classList.add('keyboard-nav');
      document.body.classList.remove('mouse-nav');
    } else {
      document.body.classList.add('mouse-nav');
      document.body.classList.remove('keyboard-nav');
    }
  };

  document.addEventListener('keydown', updateFocusStyle);
  document.addEventListener('mousedown', updateFocusStyle);

  return () => {
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keydown', updateFocusStyle);
    document.removeEventListener('mousedown', updateFocusStyle);
  };
}

/**
 * Utility to add proper ARIA attributes to custom components
 */
export const ARIA = {
  /**
   * Set up ARIA attributes for a dialog/modal
   * @param element The dialog element
   * @param titleId ID of the title element
   */
  setupDialog: (element: HTMLElement, titleId: string) => {
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('aria-labelledby', titleId);
  },

  /**
   * Set up ARIA attributes for a disclosure widget (like accordion)
   * @param trigger The trigger element
   * @param content The content element
   * @param contentId ID of the content element
   */
  setupDisclosure: (trigger: HTMLElement, content: HTMLElement, contentId: string) => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', contentId);
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', trigger.id);
    content.setAttribute('aria-hidden', 'true');
  },

  /**
   * Toggle ARIA attributes for a disclosure widget
   * @param trigger The trigger element
   * @param content The content element
   */
  toggleDisclosure: (trigger: HTMLElement, content: HTMLElement) => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!isExpanded));
    content.setAttribute('aria-hidden', String(isExpanded));
  },

  /**
   * Set up ARIA attributes for a tab list
   * @param tabs Array of tab elements
   * @param panels Array of tab panel elements
   */
  setupTabs: (tabs: HTMLElement[], panels: HTMLElement[]) => {
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('id', `tab-${index}`);
      tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tab.setAttribute('aria-controls', `panel-${index}`);
      tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });

    panels.forEach((panel, index) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('id', `panel-${index}`);
      panel.setAttribute('aria-labelledby', `tab-${index}`);
      panel.setAttribute('hidden', index === 0 ? 'false' : 'true');
    });
  },

  /**
   * Set up ARIA attributes for a combobox
   * @param input The input element
   * @param listbox The listbox element
   * @param listboxId ID of the listbox element
   */
  setupCombobox: (input: HTMLInputElement, listbox: HTMLElement, listboxId: string) => {
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', listboxId);
    input.setAttribute('aria-owns', listboxId);

    listbox.setAttribute('role', 'listbox');
  }
};

/**
 * Validate that an element meets basic accessibility requirements
 * @param element The element to validate
 * @returns Object with validation results
 */
export function validateAccessibility(element: HTMLElement) {
  const results = {
    hasAriaLabel: !!element.getAttribute('aria-label') || !!element.getAttribute('aria-labelledby'),
    hasRole: !!element.getAttribute('role'),
    hasTabIndex: element.hasAttribute('tabindex'),
    isFocusable: element.matches('button, input, select, textarea, a[href], area[href], [tabindex]'),
    hasProperContrast: true, // This would need more complex implementation
  };

  return results;
}