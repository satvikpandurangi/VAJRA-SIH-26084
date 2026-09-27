import React from 'react';
import { clsx } from 'clsx';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'card' | 'subtle';
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  variant = 'default',
  glow = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-xl border backdrop-blur-md transition-all duration-200',
        variant === 'default' && 'bg-panel-translucent border-glass shadow-glass',
        variant === 'card' && 'bg-panel-card border-glass hover:border-glass-bright',
        variant === 'subtle' && 'bg-panel-card/50 border-glass/50',
        glow && 'shadow-glow border-accent-orange/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
