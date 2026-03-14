"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AppShell from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-sm text-[#66667A]">Loading graph...</div>
    </div>
  ),
});

type FilterType = "all" | "personal" | "shared";

export default function GraphPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { isAuthenticated } = useConvexAuth();

  // Load real data from Convex
  const graphData = useQuery(
    api.pages.getAllPagesForGraph,
    isAuthenticated ? {} : "skip"
  );

  // Build nodes and links from real data, falling back to demo
  const { nodes: NODES, links: LINKS } = useMemo(() => {
    if (graphData && graphData.pages.length > 0) {
      const nodes = graphData.pages
        .filter(Boolean)
        .map((p) => ({
          id: p!._id as string,
          name: p!.title || "Untitled",
          group: p!.isShared ? "shared" : "personal",
        }));
      const links = graphData.links.map((l) => ({
        source: l.source as string,
        target: l.target as string,
      }));
      return { nodes, links };
    }
    return { nodes: [], links: [] };
  }, [graphData]);

  const filteredData = useMemo(() => {
    const filteredNodes =
      filter === "all"
        ? NODES
        : NODES.filter((n) => n.group === filter);
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = LINKS.filter(
      (l) => nodeIds.has(l.source as string) && nodeIds.has(l.target as string)
    );
    return { nodes: filteredNodes, links: filteredLinks };
  }, [filter, NODES, LINKS]);

  const connectedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const connected = new Set<string>();
    connected.add(hoveredNode);
    LINKS.forEach((l) => {
      const s = typeof l.source === "object" ? (l.source as { id: string }).id : l.source;
      const t = typeof l.target === "object" ? (l.target as { id: string }).id : l.target;
      if (s === hoveredNode) connected.add(t);
      if (t === hoveredNode) connected.add(s);
    });
    return connected;
  }, [hoveredNode, LINKS]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D) => {
      if (!node.x || !node.y) return;

      const isHovered = hoveredNode === node.id;
      const isConnected = connectedNodes.has(node.id as string);
      const dimmed = hoveredNode && !isConnected;

      const radius = isHovered ? 8 : 6;
      const alpha = dimmed ? 0.15 : 1;

      // Glow
      if (isHovered || (!hoveredNode && !dimmed)) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 6, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, radius,
          node.x, node.y, radius + 6
        );
        gradient.addColorStop(0, `rgba(212, 168, 67, ${isHovered ? 0.4 : 0.15})`);
        gradient.addColorStop(1, "rgba(212, 168, 67, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(212, 168, 67, ${alpha})`;
      ctx.fill();

      if (isHovered) {
        ctx.strokeStyle = "rgba(242, 212, 121, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label
      const label = node.name || "";
      ctx.font = `${isHovered ? "bold " : ""}11px -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = `rgba(232, 232, 237, ${dimmed ? 0.15 : isHovered ? 1 : 0.7})`;
      ctx.fillText(label, node.x, node.y + radius + 4);
    },
    [hoveredNode, connectedNodes]
  );

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Personal", value: "personal" },
    { label: "Shared", value: "shared" },
  ];

  return (
    <AppShell>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-6 top-6 z-10 flex items-center gap-3"
        >
          <Link
            href="/journal"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1A1A22]/90 text-[#A0A0B0] backdrop-blur-sm transition-all hover:border-[rgba(255,255,255,0.1)] hover:text-[#E8E8ED]"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1A1A22]/90 p-1 backdrop-blur-sm">
            <Filter size={14} className="mx-2 text-[#66667A]" />
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  filter === f.value
                    ? "bg-[#D4A843] text-white"
                    : "text-[#A0A0B0] hover:text-[#E8E8ED]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-6 top-6 z-10"
        >
          <h1 className="text-lg font-semibold text-[#E8E8ED]">
            Knowledge Graph
          </h1>
          <p className="text-xs text-[#66667A]">
            {filteredData.nodes.length} pages, {filteredData.links.length} connections
          </p>
        </motion.div>

        {/* Graph */}
        <div className="flex-1">
          {NODES.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <p className="text-sm text-[#66667A]">
                {isAuthenticated
                  ? "Create pages and link them with [[backlinks]] to build your graph."
                  : "Sign in to see your knowledge graph."}
              </p>
            </div>
          ) : (
          <ForceGraph2D
            graphData={filteredData}
            nodeCanvasObject={nodeCanvasObject}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
              if (!node.x || !node.y) return;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
            }}
            linkColor={() => "rgba(212, 168, 67, 0.12)"}
            linkWidth={1.5}
            backgroundColor="#111116"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onNodeHover={(node: any) =>
              setHoveredNode(node?.id as string || null)
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onNodeClick={(node: any) => {
              if (node.id) router.push(`/p/${node.id}`);
            }}
            cooldownTime={3000}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            warmupTicks={50}
          />
          )}
        </div>
      </div>
    </AppShell>
  );
}
