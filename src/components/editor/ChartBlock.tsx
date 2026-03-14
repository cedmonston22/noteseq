"use client";

import React, { useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { Plus, Trash2, BarChart3, LineChartIcon, PieChartIcon, AreaChartIcon } from "lucide-react";

type ChartType = "bar" | "line" | "pie" | "area";

interface DataRow {
  label: string;
  value: number;
}

const COLORS = ["#D4A843", "#6366F1", "#10B981", "#EC4899", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"];

const CHART_TYPES: { type: ChartType; icon: React.ElementType; label: string }[] = [
  { type: "bar", icon: BarChart3, label: "Bar" },
  { type: "line", icon: LineChartIcon, label: "Line" },
  { type: "area", icon: AreaChartIcon, label: "Area" },
  { type: "pie", icon: PieChartIcon, label: "Pie" },
];

export default function ChartBlock() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [title, setTitle] = useState("Chart");
  const [data, setData] = useState<DataRow[]>([
    { label: "Item A", value: 40 },
    { label: "Item B", value: 30 },
    { label: "Item C", value: 50 },
    { label: "Item D", value: 25 },
  ]);
  const [editMode, setEditMode] = useState(false);

  const addRow = () => {
    setData([...data, { label: `Item ${String.fromCharCode(65 + data.length)}`, value: 0 }]);
  };

  const removeRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: "label" | "value", val: string) => {
    const updated = [...data];
    if (field === "value") {
      updated[index] = { ...updated[index], value: parseFloat(val) || 0 };
    } else {
      updated[index] = { ...updated[index], label: val };
    }
    setData(updated);
  };

  const chartData = data.map((d) => ({ name: d.label, value: d.value }));

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#D4A843" strokeWidth={2} dot={{ fill: "#D4A843", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#D4A843" fill="rgba(212,168,67,0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                dataKey="value"
                label={false}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <NodeViewWrapper className="my-4">
      <div
        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
        contentEditable={false}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[var(--text-primary)] outline-none"
            placeholder="Chart title"
          />
          <div className="flex items-center gap-1">
            {CHART_TYPES.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`rounded-md p-1.5 transition-colors ${
                  chartType === type
                    ? "bg-[rgba(212,168,67,0.15)] text-[#D4A843]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
            <div className="mx-1 h-4 w-px bg-[var(--border-subtle)]" />
            <button
              onClick={() => setEditMode(!editMode)}
              className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                editMode
                  ? "bg-[#D4A843] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {editMode ? "Done" : "Edit Data"}
            </button>
          </div>
        </div>

        {/* Chart */}
        {renderChart()}

        {/* Data editor */}
        {editMode && (
          <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
            <div className="space-y-1.5">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_80px_28px] gap-2 px-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Label</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Value</span>
                <span />
              </div>
              {data.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_28px] gap-2">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateRow(i, "label", e.target.value)}
                    className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[#D4A843]"
                  />
                  <input
                    type="number"
                    value={row.value}
                    onChange={(e) => updateRow(i, "value", e.target.value)}
                    className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[#D4A843]"
                  />
                  <button
                    onClick={() => removeRow(i)}
                    className="flex items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addRow}
              className="mt-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Plus size={12} />
              Add row
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
