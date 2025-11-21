/**
 * Shared animation variants for modals and dialogs
 * Following iOS-style spring animations with precise timing
 */

export const backdropVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.18, 
      ease: "easeOut" as const
    }
  },
  exit: {
    opacity: 0,
    transition: { 
      duration: 0.14, 
      ease: [0.4, 0, 1, 1] as const
    }
  }
};

export const modalVariants = {
  hidden: { 
    opacity: 0, 
    y: -8, 
    scale: 0.96
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3, // 300ms
      ease: [0.16, 1, 0.3, 1] as const, // cubic-bezier(0.16, 1, 0.3, 1) - iOS springy ease-out
      delay: 0.04 // 40ms delay after backdrop begins
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as const
    }
  }
};

