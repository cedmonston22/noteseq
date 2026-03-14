"use client";
import { useEffect, useRef, useState } from "react";

// Default to local PartyKit dev server, override with env var for production
const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "127.0.0.1:1999";

interface UseYjsOptions {
  roomId: string;
  userName: string;
  userColor: string;
  enabled?: boolean;
}

export function useYjs({ roomId, userName, userColor, enabled = true }: UseYjsOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providerRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !roomId) return;

    let cancelled = false;

    async function setup() {
      try {
        // Dynamic imports to avoid Turbopack bundling issues with lib0
        const Y = await import("yjs");
        const { default: YPartyKitProvider } = await import("y-partykit/provider");

        if (cancelled) return;

        const doc = new Y.Doc();
        const provider = new YPartyKitProvider(PARTYKIT_HOST, roomId, doc, {
          connect: true,
        });

        provider.awareness.setLocalStateField("user", {
          name: userName,
          color: userColor,
        });

        provider.on("status", ({ status }: { status: string }) => {
          if (!cancelled) setConnected(status === "connected");
        });

        docRef.current = doc;
        providerRef.current = provider;
      } catch (err) {
        // PartyKit not available — stay in standalone mode
        console.debug("Yjs/PartyKit not available:", err);
      }
    }

    setup();

    return () => {
      cancelled = true;
      setConnected(false);
      if (providerRef.current) {
        try { providerRef.current.disconnect(); } catch {}
        providerRef.current = null;
      }
      if (docRef.current) {
        try { docRef.current.destroy(); } catch {}
        docRef.current = null;
      }
    };
  }, [roomId, userName, userColor, enabled]);

  return {
    doc: docRef.current,
    provider: providerRef.current,
    connected,
  };
}
