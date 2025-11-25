/**
 * Animation variants for Announcement Bottom Sheet
 * Based on the provided specification
 */

export const announcementBackdropVariants = {
  collapsed: {
    opacity: 0,
    transition: {
      duration: 0.14, // backdrop_fade_out: 140ms
      ease: [0.4, 0, 1, 1] as const, // fast_in
    },
  },
  expanded: {
    opacity: 0.48, // backdrop_opacity.expanded
    transition: {
      duration: 0.18, // backdrop_fade_in: 180ms
      ease: "easeOut" as const, // standard_ease_out
    },
  },
};

export const announcementSheetVariants = {
  collapsed: {
    height: 327,
    transition: {
      duration: 0.22, // collapse_y: 220ms
      ease: [0.4, 0, 1, 1] as const, // fast_in
    },
  },
  expanded: {
    height: 381,
    transition: {
      duration: 0.26, // expand_y: 260ms
      ease: [0.16, 1, 0.3, 1] as const, // soft_out
      delay: 0.06, // modal_content_appear: 60ms
    },
  },
};

export const announcementContentVariants = {
  collapsed: {
    opacity: 1,
    transition: {
      duration: 0.2, // content_fade: 200ms
      ease: [0.4, 0, 1, 1] as const, // fast_in
    },
  },
  expanded: {
    opacity: 1,
    transition: {
      duration: 0.2, // content_fade: 200ms
      ease: [0.16, 1, 0.3, 1] as const, // soft_out
      delay: 0.06, // modal_content_appear: 60ms
    },
  },
};

// Animation constants from spec
export const ANNOUNCEMENT_ANIMATION_SPEC = {
  durations: {
    expandY: 260,
    expandScale: 240,
    collapseY: 220,
    backdropFadeIn: 180,
    backdropFadeOut: 140,
    contentFade: 200,
    shadowTransition: 140,
  },
  delays: {
    modalContentAppear: 60,
    scrollUnlockAfterExpand: 150,
  },
  easings: {
    softOut: [0.16, 1, 0.3, 1] as const,
    fastIn: [0.4, 0, 1, 1] as const,
    shadowEase: [0.2, 0.6, 0.4, 1] as const,
    standardEaseOut: "easeOut" as const,
    standardEaseIn: "easeIn" as const,
  },
  backdropOpacity: {
    collapsed: 0,
    expanded: 0.48,
  },
  gesture: {
    thresholds: {
      expandDistancePct: 0.30, // 30% of drag distance
      collapseDistancePct: 0.40, // 40% of drag distance
    },
    velocity: {
      snapVelocity: 800, // px/s
    },
    dragElasticity: {
      overdragResistanceFactor: 0.40,
      maxOverdragPx: 160,
    },
    rubberBand: {
      applyRubberBandWhenOver: true,
      rubberBandReductionFactor: 0.60,
    },
    scrollLock: {
      lockScrollDuringDrag: true,
      unlockAfterMs: 150,
    },
  },
} as const;

