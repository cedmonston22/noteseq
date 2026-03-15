"use client";

import { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "noteseq.cedmonston22.partykit.dev";

export function useYjs(pageId?: string) {
  const [synced, setSynced] = useState(false);
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<YPartyKitProvider | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!pageId) {
      docRef.current = null;
      providerRef.current = null;
      setSynced(false);
      forceUpdate((n) => n + 1);
      return;
    }

    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(PARTYKIT_HOST, pageId, doc);

    docRef.current = doc;
    providerRef.current = provider;
    setSynced(false);
    forceUpdate((n) => n + 1);

    const onSynced = ({ synced: isSynced }: { synced: boolean }) => {
      if (isSynced) {
        setSynced(true);
      }
    };

    provider.on("synced", onSynced);

    // Check if already synced (in case the event fired before we subscribed)
    if (provider.synced) {
      setSynced(true);
    }

    return () => {
      provider.off("synced", onSynced);
      provider.disconnect();
      provider.destroy();
      doc.destroy();
      docRef.current = null;
      providerRef.current = null;
      setSynced(false);
    };
  }, [pageId]);

  return {
    doc: docRef.current,
    provider: providerRef.current,
    synced,
  };
}
