"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "noteseq.cedmonston22.partykit.dev";

interface YjsState {
  doc: Y.Doc | null;
  provider: YPartyKitProvider | null;
  synced: boolean;
  ready: boolean; // true once doc + provider are created (before sync)
}

export function useYjs(pageId?: string) {
  const [state, setState] = useState<YjsState>({
    doc: null,
    provider: null,
    synced: false,
    ready: false,
  });

  useEffect(() => {
    if (!pageId) {
      setState({ doc: null, provider: null, synced: false, ready: false });
      return;
    }

    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(PARTYKIT_HOST, pageId, doc);

    setState({ doc, provider, synced: false, ready: true });

    const onSynced = ({ synced: isSynced }: { synced: boolean }) => {
      if (isSynced) {
        setState((prev) => ({ ...prev, synced: true }));
      }
    };

    provider.on("synced", onSynced);

    if (provider.synced) {
      setState((prev) => ({ ...prev, synced: true }));
    }

    return () => {
      provider.off("synced", onSynced);
      provider.disconnect();
      provider.destroy();
      doc.destroy();
      setState({ doc: null, provider: null, synced: false, ready: false });
    };
  }, [pageId]);

  return state;
}
