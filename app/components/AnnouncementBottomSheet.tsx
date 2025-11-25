'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { announcementBackdropVariants, announcementSheetVariants, announcementContentVariants, ANNOUNCEMENT_ANIMATION_SPEC } from '../lib/animations/announcementBottomSheetVariants';
import Badge from './Badge';
import EmojiChip from './EmojiChip';
import ButtonLarge from './ButtonLarge';
import AnnouncementIcon from '@/app/assets/icons/announcement.svg';
import TimerIcon from '@/app/assets/icons/timer.svg';
import CalendarIcon from '@/app/assets/icons/calendar-1.svg';
import EmojiIcon from '@/app/assets/icons/emoji.svg';
import { useAnnouncementReactions } from '@/lib/hooks/useAnnouncementReactions';

export interface Announcement {
  id: string;
  title: string;
  date: string; // Format: "Nov 21, 2025"
  time: string; // Format: "11.00 AM"
  body: string;
  /**
   * @deprecated Reactions are now fetched via useAnnouncementReactions hook
   * This property is kept for backward compatibility but will be ignored
   */
  reactions?: Array<{ emoji: string; count: number }>;
}

export interface AnnouncementBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
  announcement: Announcement;
}

export default function AnnouncementBottomSheet({
  isOpen,
  onClose,
  onContinue,
  announcement,
}: AnnouncementBottomSheetProps) {
  // State management
  const [state, setState] = useState<'collapsed' | 'expanded'>('collapsed');
  const [isDragging, setIsDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Real-time reactions hook
  const { reactions, loading: reactionsLoading, toggleReaction, addReaction } = useAnnouncementReactions(
    announcement.id,
    {
      enableRealtime: true,
      autoFetch: isOpen, // Only fetch when sheet is open
    }
  );
  
  // Motion values for drag
  const y = useMotionValue(0);
  const backdropOpacity = useMotionValue(0);
  
  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const maxDragDistance = 200; // Maximum drag distance (327px to 357px = 30px, but we use larger range for smooth interaction)

  // Transform drag position to height based on Figma states
  // Collapsed: 327px, Expanded: 381px
  // Map drag from 0 to -maxDragDistance to height from 327px to 381px
  const height = useTransform(y, [0, -maxDragDistance], [327, 381], {
    clamp: true,
  });

  // Transform backdrop opacity to rgba string for style
  const backdropColor = useTransform(
    backdropOpacity,
    (opacity) => `rgba(0, 0, 0, ${opacity})`
  );

  // Calculate expand/collapse thresholds based on spec
  const expandThreshold = maxDragDistance * ANNOUNCEMENT_ANIMATION_SPEC.gesture.thresholds.expandDistancePct; // 30% = 60px
  const collapseThreshold = maxDragDistance * ANNOUNCEMENT_ANIMATION_SPEC.gesture.thresholds.collapseDistancePct; // 40% = 80px
  const snapVelocity = ANNOUNCEMENT_ANIMATION_SPEC.gesture.velocity.snapVelocity; // 800 px/s

  // Update backdrop opacity based on state and isOpen
  useEffect(() => {
    if (!isOpen) {
      backdropOpacity.set(0);
      return;
    }
    
    // When open, backdrop should be visible
    // The spec's "collapsed" backdrop opacity (0) refers to when sheet is closed
    // When open, we show backdrop and it can vary based on expanded/collapsed state
    const targetOpacity = state === 'expanded' 
      ? ANNOUNCEMENT_ANIMATION_SPEC.backdropOpacity.expanded 
      : 0.3; // Show backdrop when open but in collapsed state
    
    animate(backdropOpacity, targetOpacity, {
      duration: state === 'expanded' 
        ? ANNOUNCEMENT_ANIMATION_SPEC.durations.backdropFadeIn / 1000
        : ANNOUNCEMENT_ANIMATION_SPEC.durations.backdropFadeIn / 1000, // Use fade in for both when opening
      ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.standardEaseOut,
    });
  }, [state, isOpen, backdropOpacity]);

  // Lock scroll during drag
  useEffect(() => {
    if (isDragging && ANNOUNCEMENT_ANIMATION_SPEC.gesture.scrollLock.lockScrollDuringDrag) {
      document.body.style.overflow = 'hidden';
      
      // Unlock after specified delay when expanded
      if (state === 'expanded') {
        const timer = setTimeout(() => {
          document.body.style.overflow = '';
        }, ANNOUNCEMENT_ANIMATION_SPEC.gesture.scrollLock.unlockAfterMs);
        return () => clearTimeout(timer);
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isDragging, state]);

  // Initialize backdrop and reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // When opening, animate backdrop in
      animate(backdropOpacity, 0.3, {
        duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.backdropFadeIn / 1000,
        ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.standardEaseOut,
      });
    } else {
      // When closing, reset everything
      y.set(0);
      setState('collapsed');
      setIsDragging(false);
      backdropOpacity.set(0);
    }
  }, [isOpen, y, backdropOpacity]);

  // Monitor drag position to update state
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = y.on('change', (latestY) => {
      // Update state based on drag position
      if (latestY <= -expandThreshold) {
        setState('expanded');
      } else {
        setState('collapsed');
      }
    });

    return () => unsubscribe();
  }, [isOpen, y, expandThreshold]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
    onClose();
  };

  // Common emojis for quick selection
  const commonEmojis = ['❤️', '👍', '🎉', '👏', '🔥', '💯', '😊', '🙌'];
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = async (emoji: string) => {
    try {
      await toggleReaction(emoji);
    } catch (error) {
      console.error('[AnnouncementBottomSheet] Error toggling reaction:', error);
    }
  };

  const handleAddEmoji = async (emoji: string) => {
    try {
      await addReaction(emoji);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('[AnnouncementBottomSheet] Error adding reaction:', error);
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showEmojiPicker]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 backdrop-blur-sm"
          onClick={onClose}
          style={{
            backgroundColor: backdropColor,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.backdropFadeIn / 1000,
            ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.standardEaseOut,
          }}
        >
          {/* Bottom Sheet Container */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            {/* Bottom Sheet */}
            <motion.div
              ref={scrollContainerRef}
              className="w-full max-w-[402px] rounded-t-3xl bg-white shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ 
                y: '100%', 
                height: 327,
                opacity: 0 
              }}
              animate={{ 
                y: 0, 
                height: announcementSheetVariants[state].height,
                opacity: 1,
                transition: {
                  y: {
                    duration: 0.3,
                    ease: [0.19, 1, 0.22, 1] as const, // smooth slide up
                  },
                  height: announcementSheetVariants[state].transition,
                  opacity: {
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }
                }
              }}
              exit={{ 
                y: '100%',
                height: 327,
                opacity: 0,
                transition: { 
                  y: {
                    duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.collapseY / 1000, // 220ms
                    ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.fastIn, // [0.4, 0, 1, 1]
                  },
                  height: {
                    duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.collapseY / 1000,
                    ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.fastIn,
                  },
                  opacity: {
                    duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.backdropFadeOut / 1000, // 140ms
                    ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.fastIn,
                  }
                } 
              }}
              layout
              drag="y"
              dragConstraints={{ 
                top: -maxDragDistance - ANNOUNCEMENT_ANIMATION_SPEC.gesture.dragElasticity.maxOverdragPx, 
                bottom: 0 
              }}
              dragElastic={{
                top: ANNOUNCEMENT_ANIMATION_SPEC.gesture.dragElasticity.overdragResistanceFactor,
                bottom: 0.5,
              }}
              dragMomentum={false}
              onDragStart={() => {
                setIsDragging(true);
                dragStartY.current = y.get();
              }}
              onDrag={(_, info) => {
                // Only allow dragging up (negative y) to expand height
                // Dragging down (positive y) is for dismissal
                if (info.offset.y <= 0) {
                  // Apply rubber band effect if overdragging
                  let dragY = info.offset.y;
                  if (dragY < -maxDragDistance && ANNOUNCEMENT_ANIMATION_SPEC.gesture.rubberBand.applyRubberBandWhenOver) {
                    const overdrag = Math.abs(dragY) - maxDragDistance;
                    const reducedOverdrag = overdrag * ANNOUNCEMENT_ANIMATION_SPEC.gesture.rubberBand.rubberBandReductionFactor;
                    dragY = -(maxDragDistance + reducedOverdrag);
                  }
                  y.set(dragY);
                }
              }}
              onDragEnd={(_, info) => {
                setIsDragging(false);
                
                const dragDistance = Math.abs(info.offset.y);
                const velocity = Math.abs(info.velocity.y);
                
                // Dismiss if dragged down significantly or with sufficient velocity
                if (info.offset.y > 100 || velocity > snapVelocity) {
                  onClose();
                  return;
                }
                
                // Determine target state based on thresholds and velocity
                if (info.offset.y < 0) {
                  // Dragging up - check expand threshold
                  if (dragDistance >= expandThreshold || velocity > snapVelocity) {
                    // Expand
                    animate(y, -maxDragDistance, {
                      duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.expandY / 1000,
                      ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.softOut,
                    });
                    setState('expanded');
                  } else {
                    // Collapse
                    animate(y, 0, {
                      duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.collapseY / 1000,
                      ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.fastIn,
                    });
                    setState('collapsed');
                  }
                } else {
                  // Dragging down - check collapse threshold
                  if (dragDistance >= collapseThreshold || velocity > snapVelocity) {
                    // Collapse
                    animate(y, 0, {
                      duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.collapseY / 1000,
                      ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.fastIn,
                    });
                    setState('collapsed');
                  } else {
                    // Keep current state (snap back)
                    const currentY = y.get();
                    if (currentY < -expandThreshold) {
                      animate(y, -maxDragDistance, {
                        duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.expandY / 1000,
                        ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.softOut,
                      });
                    } else {
                      animate(y, 0, {
                        duration: ANNOUNCEMENT_ANIMATION_SPEC.durations.collapseY / 1000,
                        ease: ANNOUNCEMENT_ANIMATION_SPEC.easings.fastIn,
                      });
                    }
                  }
                }
              }}
              transformTemplate={({ y }) => `translateY(0)`} // Override drag transform to keep anchored
              style={{
                height: `${height}px`,
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              {/* Handle Bar and Content Container */}
              <div className="flex flex-col gap-[8px] items-center flex-1 min-h-0">
                {/* Handle Bar */}
                <div className="flex justify-center shrink-0">
                  <div className="h-1 w-12 rounded-full bg-neutral-300"></div>
                </div>

                {/* Content - Not scrollable, fixed layout */}
                <div className="flex flex-col items-start w-full flex-1 min-h-0">
                  {/* Icon and Title Section */}
                  <div className="flex flex-col gap-[8px] items-start w-full shrink-0">
                    {/* Icon */}
                    <div className="w-12 h-12 shrink-0">
                      <AnnouncementIcon className="w-full h-full" />
                    </div>

                    {/* Title and Metadata */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                      {/* Title */}
                      <h2 className="text-xl font-semibold text-neutral-700 leading-[30px] tracking-[-0.2px]">
                        {announcement.title}
                      </h2>

                      {/* Date and Time Badges */}
                      <div className="flex gap-[8px] items-start">
                        <Badge variant="neutral" size="sm" icon={CalendarIcon} showIcon={true}>
                          {announcement.date}
                        </Badge>
                        <Badge variant="neutral" size="sm" icon={TimerIcon} showIcon={true}>
                          {announcement.time}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Gap between icon/title section and masked content */}
                  <div className="h-[8px] shrink-0"></div>

                  {/* Masked Content Area - Body text and reactions */}
                  <motion.div 
                    className="flex flex-col gap-[8px] items-start w-full relative"
                    variants={announcementContentVariants}
                    animate={state}
                    style={{
                      maxHeight: state === 'expanded' ? 'none' : '82px',
                      maskImage: state === 'expanded'
                        ? 'none'
                        : 'linear-gradient(to bottom, black 0%, black calc(100% - 44px), rgba(0, 0, 0, 0.5) calc(100% - 28px), rgba(0, 0, 0, 0.2) calc(100% - 12px), transparent 100%)',
                      WebkitMaskImage: state === 'expanded'
                        ? 'none'
                        : 'linear-gradient(to bottom, black 0%, black calc(100% - 44px), rgba(0, 0, 0, 0.5) calc(100% - 28px), rgba(0, 0, 0, 0.2) calc(100% - 12px), transparent 100%)',
                      maskComposite: state === 'expanded' ? 'normal' : 'intersect',
                      WebkitMaskComposite: state === 'expanded' ? 'normal' : 'source-in',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Body Text */}
                    <p className="text-base font-normal text-neutral-500 leading-6 tracking-[-0.16px] w-full">
                      {announcement.body}
                    </p>

                    {/* Emoji Reactions */}
                    <div className="flex gap-[8px] items-start w-full flex-wrap">
                      {reactionsLoading && reactions.length === 0 ? (
                        // Loading state - show skeleton or placeholder
                        <div className="text-xs text-neutral-400">Loading reactions...</div>
                      ) : (
                        <>
                          {reactions.map((reaction) => (
                            <EmojiChip
                              key={reaction.emoji}
                              emoji={reaction.emoji}
                              count={reaction.count}
                              onClick={() => handleEmojiClick(reaction.emoji)}
                            />
                          ))}
                          {/* Add Reaction Button with Emoji Picker */}
                          <div className="relative" ref={emojiPickerRef}>
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="
                                bg-neutral-100 
                                flex 
                                items-center 
                                justify-center 
                                h-6 
                                w-7 
                                rounded-lg 
                                px-1 
                                py-0
                                transition-colors
                                hover:bg-neutral-200
                                active:bg-neutral-300
                              "
                              aria-label="Add reaction"
                              aria-expanded={showEmojiPicker}
                            >
                              <EmojiIcon className="h-3.5 w-3.5 text-neutral-400" />
                            </button>
                            
                            {/* Simple Emoji Picker Dropdown */}
                            {showEmojiPicker && (
                              <div className="absolute bottom-full left-0 mb-2 bg-white border border-neutral-200 rounded-lg shadow-lg p-2 z-10">
                                <div className="flex gap-1 flex-wrap" style={{ width: '200px' }}>
                                  {commonEmojis.map((emoji) => {
                                    const existingReaction = reactions.find((r) => r.emoji === emoji);
                                    return (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleAddEmoji(emoji)}
                                        className={`
                                          text-lg p-1 rounded hover:bg-neutral-100 transition-colors
                                          ${existingReaction?.userReacted ? 'bg-blue-50 ring-1 ring-blue-300' : ''}
                                        `}
                                        aria-label={`Add ${emoji} reaction`}
                                      >
                                        {emoji}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>

                  {/* Gap between masked content and continue button - 20px */}
                  <div className="h-[20px] shrink-0"></div>

                  {/* Continue Button - Always visible, fixed at bottom */}
                  <div className="w-full shrink-0">
                    <ButtonLarge
                      type="button"
                      onClick={handleContinue}
                      variant="primary"
                    >
                      Continue
                    </ButtonLarge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

