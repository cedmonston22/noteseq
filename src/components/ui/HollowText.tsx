"use client";

interface HollowTextProps {
  children: string;
  className?: string;
}

export function HollowText({ children, className = "" }: HollowTextProps) {
  return (
    <span className={`hollow-text ${className}`}>
      {children}
    </span>
  );
}
