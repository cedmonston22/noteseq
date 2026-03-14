export interface PageTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  content: Record<string, unknown>;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    icon: "\u{1F4CB}",
    description: "Structured meeting notes with attendees, agenda, and action items",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Meeting Notes" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Date: " }, { type: "text", text: "" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Attendees: " }, { type: "text", text: "" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Agenda" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Topic 1" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Topic 2" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Notes" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Action Items" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action item 1" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action item 2" }] }] },
        ]},
      ]
    }
  },
  {
    id: "project-plan",
    name: "Project Plan",
    icon: "\u{1F680}",
    description: "Project overview with goals, timeline, and tasks",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Project Plan" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Overview" }] },
        { type: "paragraph", content: [{ type: "text", text: "Describe the project goals and scope..." }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Timeline" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Phase 1: " }, { type: "text", text: "Planning" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Phase 2: " }, { type: "text", text: "Development" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Phase 3: " }, { type: "text", text: "Launch" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Tasks" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Define requirements" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Design mockups" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Build MVP" }] }] },
        ]},
      ]
    }
  },
  {
    id: "weekly-review",
    name: "Weekly Review",
    icon: "\u{1F4CA}",
    description: "Weekly reflection with wins, challenges, and next week goals",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Weekly Review" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Wins" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Challenges" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Lessons Learned" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Goals for Next Week" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
      ]
    }
  },
  {
    id: "brainstorm",
    name: "Brainstorm",
    icon: "\u{1F4A1}",
    description: "Free-form brainstorming with ideas and categories",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Brainstorm" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Dump all ideas here, organize later..." }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Ideas" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Favorites" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
      ]
    }
  },
  {
    id: "daily-standup",
    name: "Daily Standup",
    icon: "\u2600\uFE0F",
    description: "Yesterday, today, blockers format",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Daily Standup" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Yesterday" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Today" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Blockers" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }] },
        ]},
      ]
    }
  },
  {
    id: "bug-report",
    name: "Bug Report",
    icon: "\u{1F41B}",
    description: "Structured bug report with steps to reproduce",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Bug Report" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Severity: " }, { type: "text", text: "High / Medium / Low" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Environment: " }, { type: "text", text: "" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Description" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Steps to Reproduce" }] },
        { type: "orderedList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 1" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 2" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Expected Behavior" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Actual Behavior" }] },
        { type: "paragraph" },
      ]
    }
  },
];
