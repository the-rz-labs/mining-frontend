import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  earningPerSecond?: number;
  isOnline?: boolean;
}

export function AnimatedCounter({ 
  value, 
  decimals = 6, 
  duration = 1000,
  className = '',
  earningPerSecond = 0,
  isOnline = true
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(value);
  const lastValueRef = useRef(value);
  const tickIntervalRef = useRef<NodeJS.Timeout>();

  // Real-time ticking for online miners
  useEffect(() => {
    if (isOnline && earningPerSecond > 0) {
      tickIntervalRef.current = setInterval(() => {
        setDisplayValue(prev => prev + earningPerSecond);
      }, 1000);

      return () => {
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
        }
      };
    }
  }, [earningPerSecond, isOnline]);

  // Smooth animation when API updates
  useEffect(() => {
    if (value !== lastValueRef.current) {
      setIsIncreasing(true);
      setTimeout(() => setIsIncreasing(false), 600);
    }
    
    lastValueRef.current = value;
    startValueRef.current = displayValue;
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValueRef.current + (value - startValueRef.current) * easeOut;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={`${className} ${isIncreasing ? 'animate-glow-pulse' : ''} transition-all duration-300`}>
      {displayValue.toFixed(decimals)}
    </span>
  );
}
