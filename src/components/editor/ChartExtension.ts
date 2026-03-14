import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ChartBlock from "./ChartBlock";

export const ChartNode = Node.create({
  name: "chartBlock",
  group: "block",
  atom: true,

  parseHTML() {
    return [{ tag: "div[data-type='chart-block']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "chart-block" }, "📊 Chart"];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartBlock);
  },
});
