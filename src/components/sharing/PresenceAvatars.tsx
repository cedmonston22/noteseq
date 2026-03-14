"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tooltip from "@/components/ui/Tooltip";
import { COLLAB_COLORS } from "@/lib/constants";
import type { Awareness } from "y-protocols/awareness";

interface User {
  id: string;
  name: string;
  color?: string;
}

const MAX_VISIBLE = 4;

interface PresenceAvatarsProps {
  users?: User[];
  awareness?: Awareness | null;
}

export default function PresenceAvatars({
  users: propUsers = [],
  awareness,
}: PresenceAvatarsProps) {
  const [awarenessUsers, setAwarenessUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!awareness) {
      setAwarenessUsers([]);
      return;
    }

    const updateUsers = () => {
      const states = awareness.getStates();
      const localClientId = awareness.clientID;
      const connectedUsers: User[] = [];
      states.forEach((state, clientId) => {
        if (clientId !== localClientId && state.user) {
          connectedUsers.push({
            id: String(clientId),
            name: state.user.name || "Anonymous",
            color: state.user.color,
          });
        }
      });
      setAwarenessUsers(connectedUsers);
    };

    updateUsers();
    awareness.on("change", updateUsers);
    return () => {
      awareness.off("change", updateUsers);
    };
  }, [awareness]);

  const users = awarenessUsers.length > 0 ? awarenessUsers : propUsers;
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
                  background: user.color || COLLAB_COLORS[index % COLLAB_COLORS.length],
                  boxShadow: "0 0 0 2px var(--bg-primary)",
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
                background: "var(--dark-raised)",
                color: "var(--text-secondary)",
                boxShadow: "0 0 0 2px var(--bg-primary)",
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
