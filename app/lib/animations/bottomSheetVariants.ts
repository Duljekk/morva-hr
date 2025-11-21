/**
 * Shared animation variants for bottom sheets
 * Matching the original slide-up animation values
 */

export const bottomSheetBackdropVariants = {
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

export const bottomSheetVariants = {
  hidden: { 
    y: '100%' // Start from bottom (translateY(100%))
  },
  visible: {
    y: 0, // End at normal position (translateY(0))
    transition: {
      duration: 0.3, // 300ms - matching original animation
      ease: [0.19, 1, 0.22, 1] as const, // cubic-bezier(0.19, 1, 0.22, 1) - matching original easing
    }
  },
  exit: {
    y: '100%', // Exit to bottom
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1] as const
    }
  }
};




