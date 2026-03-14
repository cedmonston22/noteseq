"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tooltip from "@/components/ui/Tooltip";
import { COLLAB_COLORS } from "@/lib/constants";

interface User {
  id: string;
  name: string;
}

const DUMMY_USERS: User[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

const MAX_VISIBLE = 4;

interface PresenceAvatarsProps {
  users?: User[];
}

export default function PresenceAvatars({
  users = DUMMY_USERS,
}: PresenceAvatarsProps) {
  const visible = users.slice(0, MAX_VISIBLE);
  const overflow = users.length - MAX_VISIBLE;

  return (
    <div className="flex items-center">
      <AnimatePresence mode="popLayout">
        {visible.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.5, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ marginLeft: index === 0 ? 0 : -8, zIndex: users.length - index }}
          >
            <Tooltip content={user.name} position="bottom">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white ring-2"
                style={{
                  background: COLLAB_COLORS[index % COLLAB_COLORS.length],
                  boxShadow: "0 0 0 2px #0A0A0F",
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Tooltip>
          </motion.div>
        ))}

        {overflow > 0 && (
          <motion.div
            key="overflow"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ marginLeft: -8, zIndex: 0 }}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ring-2"
              style={{
                background: "#252530",
                color: "#A0A0B0",
                boxShadow: "0 0 0 2px #0A0A0F",
              }}
            >
              +{overflow}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
