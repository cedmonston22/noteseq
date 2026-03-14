import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CalendarBlock from "./CalendarBlock";

export const CalendarNode = Node.create({
  name: "calendarBlock",
  group: "block",
  atom: true,

  parseHTML() {
    return [{ tag: "div[data-type='calendar-block']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "calendar-block" }, "📅 Calendar"];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalendarBlock);
  },
});
