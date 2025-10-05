import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  decimals = 6, 
  duration = 1000,
  className = '' 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(value);

  useEffect(() => {
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
    <span className={className}>
      {displayValue.toFixed(decimals)}
    </span>
  );
}
