import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AccentPalette } from '../types/physics';

export const THEME_TRANSITION = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1] as const,
};

interface ThemeTransitionLayerProps {
  resolvedDark: boolean;
  accent: AccentPalette;
}

function getVeilGlow(accent: AccentPalette, toDark: boolean): string {
  if (accent === 'emerald-teal') {
    return toDark ? 'rgba(16, 185, 129, 0.10)' : 'rgba(5, 150, 105, 0.08)';
  }
  if (accent === 'amber-rose') {
    return toDark ? 'rgba(245, 158, 11, 0.10)' : 'rgba(217, 119, 6, 0.08)';
  }
  return toDark ? 'rgba(34, 211, 238, 0.10)' : 'rgba(8, 145, 178, 0.08)';
}

/**
 * Renders a subtle, pointer-events-none cross-fade veil whenever the theme
 * switches between light and dark mode post-mount. Keeps all child trees
 * mounted so timers, simulations, and scroll positions remain intact.
 */
export const ThemeTransitionLayer: React.FC<ThemeTransitionLayerProps> = ({
  resolvedDark,
  accent,
}) => {
  const isMountedRef = useRef(false);
  const prevDarkRef = useRef(resolvedDark);
  const [veilState, setVeilState] = useState<{
    id: number;
    fromDark: boolean;
    toDark: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      prevDarkRef.current = resolvedDark;
      return;
    }

    if (prevDarkRef.current !== resolvedDark) {
      const fromDark = prevDarkRef.current;
      prevDarkRef.current = resolvedDark;
      const id = Date.now();
      setVeilState({ id, fromDark, toDark: resolvedDark });
    }
  }, [resolvedDark]);

  return (
    <AnimatePresence>
      {veilState && (
        <motion.div
          key={veilState.id}
          aria-hidden="true"
          initial={{ opacity: 0.56 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: THEME_TRANSITION.ease }}
          onAnimationComplete={() => {
            setVeilState((current) => (current?.id === veilState.id ? null : current));
          }}
          style={{
            backgroundColor: veilState.fromDark ? '#060913' : '#f8fafc',
            backgroundImage: `radial-gradient(circle at 50% 15%, ${getVeilGlow(accent, veilState.toDark)}, transparent 65%)`,
          }}
          className="pointer-events-none fixed inset-0 z-40"
        />
      )}
    </AnimatePresence>
  );
};

interface MotionStudioSurfaceProps {
  isDark: boolean;
  as?: 'div' | 'section' | 'footer';
  className?: string;
  children: React.ReactNode;
}

/**
 * Framer Motion-powered `.studio-surface` container that smoothly interpolates
 * background, border, and shadow tokens during theme switches.
 */
export const MotionStudioSurface: React.FC<MotionStudioSurfaceProps> = ({
  isDark,
  as = 'div',
  className = '',
  children,
}) => {
  const Component =
    as === 'section' ? motion.section : as === 'footer' ? motion.footer : motion.div;

  return (
    <Component
      initial={false}
      animate={{
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.88)',
        borderColor: isDark ? 'rgba(51, 65, 85, 0.72)' : 'rgba(203, 213, 225, 0.85)',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 30px -14px rgba(0, 0, 0, 0.6)'
          : '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.08)',
      }}
      transition={THEME_TRANSITION}
      className={`studio-surface ${className}`}
    >
      {children}
    </Component>
  );
};
