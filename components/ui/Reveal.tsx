'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in milliseconds */
  delay?: number;
  className?: string;
  /** Rendered element tag (default: div) */
  as?: ElementType;
}

/**
 * Scroll-reveal wrapper. Fades + slides content in once it enters the viewport.
 * Uses IntersectionObserver, animates only once, and respects prefers-reduced-motion
 * (the .reveal CSS disables the transform/opacity under that media query).
 */
export function Reveal({ children, delay = 0, className = '', as }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is unavailable, show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
