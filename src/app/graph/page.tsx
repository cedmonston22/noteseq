"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const NODES = [
  { id: "1", name: "Project Ideas", group: "personal" },
  { id: "2", name: "Architecture Notes", group: "personal" },
  { id: "3", name: "API Design", group: "personal" },
  { id: "4", name: "Meeting Notes", group: "shared" },
  { id: "5", name: "Reading List", group: "personal" },
  { id: "6", name: "Team Standup", group: "shared" },
  { id: "7", name: "Sprint Planning", group: "shared" },
  { id: "8", name: "Bug Tracker", group: "personal" },
  { id: "9", name: "Design System", group: "personal" },
  { id: "10", name: "Deployment Guide", group: "personal" },
  { id: "11", name: "Onboarding", group: "shared" },
  { id: "12", name: "Performance Notes", group: "personal" },
  { id: "13", name: "Database Schema", group: "personal" },
  { id: "14", name: "Security Audit", group: "shared" },
  { id: "15", name: "Q1 Goals", group: "shared" },
  { id: "16", name: "Tech Debt", group: "personal" },
  { id: "17", name: "Release Notes", group: "shared" },
  { id: "18", name: "Code Review", group: "personal" },
];

const LINKS = [
  { source: "1", target: "2" }, { source: "1", target: "3" },
  { source: "2", target: "3" }, { source: "2", target: "13" },
  { source: "3", target: "13" }, { source: "4", target: "6" },
  { source: "4", target: "7" }, { source: "5", target: "1" },
  { source: "6", target: "7" }, { source: "6", target: "15" },
  { source: "8", target: "16" }, { source: "9", target: "2" },
  { source: "10", target: "11" }, { source: "10", target: "2" },
  { source: "12", target: "16" }, { source: "12", target: "8" },
  { source: "13", target: "10" }, { source: "14", target: "3" },
  { source: "14", target: "13" }, { source: "15", target: "7" },
  { source: "16", target: "18" }, { source: "17", target: "10" },
  { source: "17", target: "15" }, { source: "18", target: "8" },
  { source: "9", target: "3" }, { source: "11", target: "4" },
  { source: "1", target: "15" },
];

type FilterType = "all" | "personal" | "shared";

export default function GraphPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
  }, [filter]);

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
  }, [hoveredNode]);

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
        </div>
      </div>
    </AppShell>
  );
}
