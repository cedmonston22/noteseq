"use client";

// Real-time collaboration via Yjs + PartyKit.
// PartyKit is deployed at: noteseq.cedmonston22.partykit.dev
// The TipTap Collaboration extension integration needs further work
// to resolve compatibility issues. The infrastructure is ready.

export function useYjs() {
  return {
    doc: null,
    provider: null,
    connected: false,
  };
}
