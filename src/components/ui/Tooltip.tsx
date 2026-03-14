"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Position = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  position?: Position;
  children: React.ReactNode;
}

const positionStyles: Record<
  Position,
  { placement: React.CSSProperties; arrow: React.CSSProperties }
> = {
  top: {
    placement: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: 8,
    },
    arrow: {
      bottom: -4,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
  },
  bottom: {
    placement: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: 8,
    },
    arrow: {
      top: -4,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
  },
  left: {
    placement: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: 8,
    },
    arrow: {
      right: -4,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
  },
  right: {
    placement: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: 8,
    },
    arrow: {
      left: -4,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
  },
};

export default function Tooltip({
  content,
  position = "top",
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 200);
  }, []);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const { placement, arrow } = positionStyles[position];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="pointer-events-none absolute z-50 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg"
            style={{
              ...placement,
              background: "#252530",
              color: "#E8E8ED",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
          >
            {content}
            {/* Arrow */}
            <div
              className="absolute h-2 w-2"
              style={{
                ...arrow,
                background: "#252530",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
