import React from 'react';
import { cn } from '../lib/utils';

interface SkillPillProps {
  label: string;
  status: 'matched' | 'missing' | 'neutral';
  className?: string;
}

export function SkillPill({ label, status, className }: SkillPillProps) {
  const styles = {
    matched: 'bg-[rgba(29,158,117,0.1)] text-secondary border-secondary/20',
    missing: 'bg-[rgba(212,83,126,0.1)] text-primary border-primary/20',
    neutral: 'bg-surface-fill text-text-secondary border-border'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-[12px] font-medium border",
      styles[status],
      className
    )}>
      {label}
    </span>
  );
}
