import React from 'react';
import { cn } from '../lib/utils';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { radius: 20, stroke: 3, font: 'text-xs' },
  md: { radius: 32, stroke: 4, font: 'text-base' },
  lg: { radius: 48, stroke: 6, font: 'text-2xl' },
};

export function ScoreRing({ score, size = 'md', className }: ScoreRingProps) {
  const { radius, stroke, font } = sizes[size];
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="var(--color-surface-fill)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--color-primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className={cn("absolute font-mono font-medium text-primary", font)}>
        {score}%
      </span>
    </div>
  );
}
