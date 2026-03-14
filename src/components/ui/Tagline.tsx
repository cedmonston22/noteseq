"use client";

interface TaglineProps {
  children: string;
  className?: string;
}

export function Tagline({ children, className = "" }: TaglineProps) {
  return (
    <div className={`tagline-wrap ${className}`}>
      <div className="tagline-line" />
      <span className="tagline-text">{children}</span>
      <div className="tagline-line" />
    </div>
  );
}
