// Device detection utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Mobile-specific constants
export const MOBILE_BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Touch target sizes (iOS/Android guidelines)
export const TOUCH_TARGET_SIZES = {
  minimum: 44, // 44px minimum for touch targets
  recommended: 48, // 48px recommended for better usability
  large: 56, // 56px for important actions
} as const;

// Mobile viewport utilities
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 375, height: 667 }; // Default mobile dimensions
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
  };
};

// Safe area insets for mobile devices
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--safe-top') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-left') || '0'),
    right: parseInt(style.getPropertyValue('--safe-right') || '0'),
  };
};
