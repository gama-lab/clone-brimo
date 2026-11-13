import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshContainerProps {
  children: React.ReactNode;
  /** Optional shimmer skeleton shown smoothly inside the body while refreshing */
  skeleton?: React.ReactNode;
  className?: string;
  /** 'blue' blends seamlessly beneath blue headers like Home; 'light' fits slate-50 lists */
  tone?: 'light' | 'blue';
  /** Optional async or sync callback invoked when pull crosses threshold */
  onRefresh?: () => Promise<void> | void;
}

const PULL_THRESHOLD = 56;
const MAX_PULL = 84;
const REFRESH_HOLD_DISTANCE = 48;
const MIN_REFRESH_MS = 600;

/**
 * Reusable native-feeling pull-to-refresh scroll container.
 * Uses GPU-composited translateY only when pulling from scrollTop === 0,
 * locking axis early so horizontal carousels and normal scrolling remain unaffected.
 */
export const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
  children,
  skeleton,
  className = '',
  tone = 'light',
  onRefresh,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const gestureRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    axis: 'none' as 'none' | 'vertical' | 'horizontal',
    triggeredHaptic: false,
  });

  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const triggerRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPullDistance(REFRESH_HOLD_DISTANCE);

    const startTime = Date.now();
    try {
      await onRefresh?.();
    } catch {
      // Non-fatal: UI still completes refresh cleanly
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_REFRESH_MS - elapsed);

    timerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setIsRefreshing(false);
      setPullDistance(0);
      timerRef.current = null;
    }, remaining);
  }, [onRefresh]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isRefreshing || e.touches.length !== 1) return;
    const el = scrollRef.current;
    if (!el || el.scrollTop > 0) {
      gestureRef.current.active = false;
      return;
    }

    gestureRef.current = {
      active: true,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      axis: 'none',
      triggeredHaptic: false,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    if (!g.active || isRefreshing || e.touches.length !== 1) return;

    const el = scrollRef.current;
    if (!el || el.scrollTop > 0) {
      g.active = false;
      if (pullDistance !== 0) {
        setIsDragging(false);
        setPullDistance(0);
      }
      return;
    }

    const dx = e.touches[0].clientX - g.startX;
    const dy = e.touches[0].clientY - g.startY;

    // Lock swipe axis once finger moves past slop threshold
    if (g.axis === 'none') {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        g.axis = 'horizontal';
        g.active = false;
        return;
      }
      g.axis = 'vertical';
    }

    if (dy <= 0) {
      if (pullDistance > 0) {
        setIsDragging(false);
        setPullDistance(0);
      }
      g.active = false;
      return;
    }

    // Damped rubber-band curve for native tactile resistance
    const damped = Math.min(MAX_PULL, Math.round(dy * 0.48));
    setIsDragging(true);
    setPullDistance(damped);

    if (damped >= PULL_THRESHOLD && !g.triggeredHaptic) {
      g.triggeredHaptic = true;
      try {
        navigator.vibrate?.(10);
      } catch {
        // Ignore on unsupported browsers
      }
    }
  };

  const handleTouchEnd = () => {
    const g = gestureRef.current;
    if (!g.active) return;
    g.active = false;
    setIsDragging(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      void triggerRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const isBlueTone = tone === 'blue';
  const progress = Math.min(1, pullDistance / PULL_THRESHOLD);
  const readyToRelease = pullDistance >= PULL_THRESHOLD;

  return (
    <div
      ref={scrollRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`flex-1 min-h-0 native-scroll relative ${isBlueTone ? 'bg-slate-50' : ''} ${className}`}
    >
      {/* Pull-to-refresh header backdrop (blends cleanly with blue or light screen top) */}
      <div
        aria-hidden="true"
        className={`absolute top-0 inset-x-0 flex items-center justify-center pointer-events-none overflow-hidden ${
          isBlueTone ? 'bg-[#1078CA] text-white' : 'bg-slate-50 text-[#1078CA]'
        }`}
        style={{
          height: `${Math.max(0, pullDistance)}px`,
          transition: isDragging ? 'none' : 'height 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="flex items-center space-x-2"
          style={{
            opacity: isRefreshing ? 1 : Math.min(1, progress * 1.15),
            transform: `scale(${isRefreshing ? 1 : 0.78 + progress * 0.22})`,
          }}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ${
              isBlueTone ? 'bg-white/15 border border-white/25' : 'bg-white border border-slate-200/80'
            }`}
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? 'animate-spin' : ''}
              style={
                isRefreshing
                  ? undefined
                  : { transform: `rotate(${Math.round(progress * 210)}deg)` }
              }
            />
          </div>
          <span
            className={`text-[11px] font-semibold tracking-tight ${
              isBlueTone ? 'text-white/95' : 'text-slate-600'
            }`}
          >
            {isRefreshing
              ? 'Memperbarui data...'
              : readyToRelease
              ? 'Lepas untuk memperbarui'
              : 'Tarik untuk memperbarui'}
          </span>
        </div>
      </div>

      {/* Sliding inner content wrapper (GPU composited) */}
      <div
        className={isRefreshing && !skeleton ? 'animate-pulse' : undefined}
        style={{
          transform: pullDistance > 0 ? `translate3d(0, ${pullDistance}px, 0)` : undefined,
          transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {isRefreshing && skeleton ? skeleton : children}
      </div>
    </div>
  );
};
