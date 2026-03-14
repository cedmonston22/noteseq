"use client";

import React from "react";
import { cn } from "@/lib/utils";

function ShimmerBase({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("skeleton rounded", className)}
      style={style}
    />
  );
}

interface SkeletonLineProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonLine({
  width = "100%",
  height = 14,
  className,
}: SkeletonLineProps) {
  return (
    <ShimmerBase
      className={cn("rounded-md", className)}
      style={{ width, height }}
    />
  );
}

interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export function SkeletonAvatar({ size = 36, className }: SkeletonAvatarProps) {
  return (
    <ShimmerBase
      className={cn("rounded-full shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}

interface SkeletonBlockProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonBlock({
  width = "100%",
  height = 80,
  className,
}: SkeletonBlockProps) {
  return (
    <ShimmerBase
      className={cn("rounded-lg", className)}
      style={{ width, height }}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-8 py-12">
      {/* Title */}
      <SkeletonLine width="55%" height={32} />
      {/* Subtitle / meta */}
      <SkeletonLine width="30%" height={14} />
      {/* Paragraph lines */}
      <div className="space-y-3 pt-4">
        <SkeletonLine width="100%" />
        <SkeletonLine width="92%" />
        <SkeletonLine width="87%" />
        <SkeletonLine width="60%" />
      </div>
      {/* Gap */}
      <div className="pt-2" />
      {/* Another paragraph */}
      <div className="space-y-3">
        <SkeletonLine width="100%" />
        <SkeletonLine width="95%" />
        <SkeletonLine width="78%" />
      </div>
      {/* Block element */}
      <SkeletonBlock height={120} className="mt-4" />
      {/* More lines */}
      <div className="space-y-3 pt-2">
        <SkeletonLine width="100%" />
        <SkeletonLine width="45%" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-5 px-3 py-4">
      {/* Section header */}
      <SkeletonLine width="40%" height={10} />
      {/* Nav items */}
      {[85, 72, 90, 60, 78].map((w, i) => (
        <div key={i} className="flex items-center gap-3 px-2">
          <ShimmerBase
            className="rounded shrink-0"
            style={{ width: 18, height: 18 }}
          />
          <SkeletonLine width={`${w}%`} height={13} />
        </div>
      ))}
      {/* Separator */}
      <div className="py-2">
        <SkeletonLine width="50%" height={10} />
      </div>
      {/* More items */}
      {[68, 80, 55].map((w, i) => (
        <div key={i} className="flex items-center gap-3 px-2">
          <ShimmerBase
            className="rounded shrink-0"
            style={{ width: 18, height: 18 }}
          />
          <SkeletonLine width={`${w}%`} height={13} />
        </div>
      ))}
    </div>
  );
}
