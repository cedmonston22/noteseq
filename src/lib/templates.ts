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
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Date: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Attendees: " }] },
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
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Challenges" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Lessons Learned" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Goals for Next Week" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph" }] },
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
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Favorites" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
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
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Today" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Blockers" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
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
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Environment: " }] },
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
  {
    id: "reading-notes",
    name: "Reading Notes",
    icon: "\u{1F4D6}",
    description: "Capture key takeaways, quotes, and reflections from a book",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Reading Notes" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Title: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Author: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Genre: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Rating: " }, { type: "text", text: "\u2B50\u2B50\u2B50\u2B50\u2B50 ( /5)" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Summary" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Write a brief summary of the book in your own words..." }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Key Takeaways" }] },
        { type: "orderedList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "First major insight" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Second major insight" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Third major insight" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Favorite Quotes" }] },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "\"Quote goes here...\"" }] }] },
        { type: "paragraph", content: [{ type: "text", text: "\u2014 Page #" }] },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "\"Another quote...\"" }] }] },
        { type: "paragraph", content: [{ type: "text", text: "\u2014 Page #" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Personal Reflections" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "How does this book relate to your life? What will you do differently?" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Action Items" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Apply insight from this book" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Recommend to someone" }] }] },
        ]},
      ]
    }
  },
  {
    id: "decision-log",
    name: "Decision Log",
    icon: "\u2696\uFE0F",
    description: "Document decisions with context, options, and outcomes",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Decision Log" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Date: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Decision Owner: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Status: " }, { type: "text", text: "Pending / Decided / Revisited" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Decision" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "State the decision clearly in one sentence..." }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Context & Background" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Why is this decision needed? What problem are we solving?" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Options Considered" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Option A: " }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Pros: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Cons: " }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Option B: " }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Pros: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Cons: " }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Option C: " }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Pros: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Cons: " }] }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Final Decision" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Chosen option: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Rationale: " }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Outcome & Follow-up" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Revisit this decision on [date] to evaluate results..." }] },
      ]
    }
  },
  {
    id: "retrospective",
    name: "Retrospective",
    icon: "\u{1F504}",
    description: "Team retro with what went well, what didn't, and improvements",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Retrospective" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Sprint/Period: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Date: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Facilitator: " }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "\u2705 What Went Well" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Positive outcome or success" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Good collaboration moment" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Process improvement that worked" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "\u274C What Didn\u2019t Go Well" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Challenge or blocker" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Miscommunication or delay" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Tool or process issue" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "\u{1F4A1} What To Improve" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Specific improvement suggestion" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Process change to try" }] }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "\u{1F3AF} Action Items" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action item \u2014 Owner: @name \u2014 Due: date" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action item \u2014 Owner: @name \u2014 Due: date" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action item \u2014 Owner: @name \u2014 Due: date" }] }] },
        ]},
      ]
    }
  },
  {
    id: "one-on-one",
    name: "1-on-1 Meeting",
    icon: "\u{1F465}",
    description: "Structured 1-on-1 with mood check, topics, and follow-ups",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "1-on-1 Meeting" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "With: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Date: " }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Mood Check" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "How are you feeling? (1\u20135 or emoji)" }] },
        { type: "blockquote", content: [{ type: "paragraph" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Discussion Topics" }] },
        { type: "orderedList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Topic from last meeting follow-up" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Current project updates" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Career growth & development" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Feedback (giving & receiving)" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Blockers or concerns" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Notes" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Action Items" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action for me" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action for them" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Follow-ups for Next Meeting" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Revisit topic from today" }] }] },
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
      ]
    }
  },
  {
    id: "content-calendar",
    name: "Content Calendar",
    icon: "\u{1F4C5}",
    description: "Weekly content planning with platforms and status tracking",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Content Calendar" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Week of: " }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Monday" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "[Blog] " }, { type: "text", text: "Topic \u2014 Draft" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Tuesday" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "[Twitter/X] " }, { type: "text", text: "Topic \u2014 Scheduled" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Wednesday" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "[YouTube] " }, { type: "text", text: "Topic \u2014 Filming" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Thursday" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "[Newsletter] " }, { type: "text", text: "Topic \u2014 Writing" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Friday" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "[LinkedIn] " }, { type: "text", text: "Topic \u2014 Published" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Weekend" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Batch content creation, review analytics, plan next week" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Content Ideas Backlog" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Idea 1" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Idea 2" }] }] },
        ]},
      ]
    }
  },
  {
    id: "okr-tracker",
    name: "OKR Tracker",
    icon: "\u{1F3AF}",
    description: "Track objectives and key results with progress notes",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "OKR Tracker" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Quarter: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Owner: " }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Objective 1: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Describe the objective clearly..." }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "KR 1.1: " }, { type: "text", text: "Key result with measurable target" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "KR 1.2: " }, { type: "text", text: "Key result with measurable target" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "KR 1.3: " }, { type: "text", text: "Key result with measurable target" }] }] },
        ]},
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Progress Notes: " }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Objective 2: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Describe the objective clearly..." }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "KR 2.1: " }, { type: "text", text: "Key result with measurable target" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "KR 2.2: " }, { type: "text", text: "Key result with measurable target" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "KR 2.3: " }, { type: "text", text: "Key result with measurable target" }] }] },
        ]},
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Progress Notes: " }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
      ]
    }
  },
  {
    id: "interview-notes",
    name: "Interview Notes",
    icon: "\u{1F3A4}",
    description: "Structured interview notes with questions, responses, and evaluation",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Interview Notes" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Candidate: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Role: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Date: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Interviewer: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Interview Type: " }, { type: "text", text: "Phone Screen / Technical / Behavioral / Final" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Questions & Responses" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Q1: " }] },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Candidate's response summary..." }] }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Rating: " }, { type: "text", text: "\u2B50\u2B50\u2B50 (1\u20135)" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Q2: " }] },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Candidate's response summary..." }] }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Rating: " }, { type: "text", text: "\u2B50\u2B50\u2B50 (1\u20135)" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Q3: " }] },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Candidate's response summary..." }] }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Rating: " }, { type: "text", text: "\u2B50\u2B50\u2B50 (1\u20135)" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Strengths" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Concerns" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Overall Assessment" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Overall Rating: " }, { type: "text", text: "\u2B50\u2B50\u2B50 (1\u20135)" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Decision: " }, { type: "text", text: "Strong Yes / Yes / Maybe / No / Strong No" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Notes: " }] },
      ]
    }
  },
  {
    id: "research-notes",
    name: "Research Notes",
    icon: "\u{1F52C}",
    description: "Organize research with hypothesis, sources, and conclusions",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Research Notes" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Topic: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Date: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Researcher: " }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Research Question" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "What are you trying to find out or prove?" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Hypothesis" }] },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "State your hypothesis or expected outcome..." }] }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Sources" }] },
        { type: "orderedList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Source title \u2014 URL or reference" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Source title \u2014 URL or reference" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Source title \u2014 URL or reference" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Findings" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Finding 1: " }, { type: "text", text: "Description and supporting evidence" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Finding 2: " }, { type: "text", text: "Description and supporting evidence" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Finding 3: " }, { type: "text", text: "Description and supporting evidence" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Conclusions" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "What did you learn? Was your hypothesis correct?" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Next Steps" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Follow-up research on..." }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Share findings with..." }] }] },
        ]},
      ]
    }
  },
  {
    id: "product-spec",
    name: "Product Spec",
    icon: "\u{1F4D0}",
    description: "Product specification with user stories, requirements, and timeline",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Product Spec" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Author: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Last Updated: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Status: " }, { type: "text", text: "Draft / In Review / Approved" }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Problem Statement" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "What problem are we solving? Who is affected and how?" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Proposed Solution" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "High-level description of the proposed solution..." }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "User Stories" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "As a [user type], I want [goal] so that [reason]" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "As a [user type], I want [goal] so that [reason]" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "As a [user type], I want [goal] so that [reason]" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Requirements" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Must Have (P0)" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Critical requirement" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Critical requirement" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Should Have (P1)" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Important requirement" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Nice to Have (P2)" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Optional enhancement" }] }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Success Metrics" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Metric 1: Target value" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Metric 2: Target value" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Timeline" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Week 1\u20132: " }, { type: "text", text: "Design & planning" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Week 3\u20134: " }, { type: "text", text: "Development" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Week 5: " }, { type: "text", text: "Testing & QA" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Week 6: " }, { type: "text", text: "Launch" }] }] },
        ]},
      ]
    }
  },
  {
    id: "changelog",
    name: "Changelog",
    icon: "\u{1F4DD}",
    description: "Version changelog with added, changed, fixed, and removed sections",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Changelog" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "All notable changes to this project will be documented here." }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "v1.0.0 \u2014 YYYY-MM-DD" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Added" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "New feature description" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Another new feature" }] }] },
        ]},
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Changed" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Updated behavior description" }] }] },
        ]},
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Fixed" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Bug fix description" }] }] },
        ]},
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Removed" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Deprecated feature removed" }] }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "v0.9.0 \u2014 YYYY-MM-DD" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Added" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Initial feature" }] }] },
        ]},
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Fixed" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Initial bug fix" }] }] },
        ]},
      ]
    }
  },
  {
    id: "personal-goals",
    name: "Personal Goals",
    icon: "\u{1F31F}",
    description: "Track short-term goals, long-term vision, and habits",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Personal Goals" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Last reviewed: " }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Short-term Goals (This Month)" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Goal with specific deadline" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Goal with specific deadline" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Goal with specific deadline" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Long-term Goals (This Year)" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Career or learning goal" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Health or fitness goal" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Personal or relationship goal" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Financial goal" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Habits to Build" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Morning routine: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Exercise: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Reading: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Journaling: " }] }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Milestones & Wins" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Celebrate your progress here..." }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Reflections" }] },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "What's working? What needs to change?" }] }] },
      ]
    }
  },
  {
    id: "trip-planner",
    name: "Trip Planner",
    icon: "\u2708\uFE0F",
    description: "Plan your trip with itinerary, flights, accommodation, and budget",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Trip Planner" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Destination: " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Dates: " }, { type: "text", text: " to " }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Travelers: " }] },
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Flights" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Outbound: " }, { type: "text", text: "Airline \u2014 Flight # \u2014 Depart time \u2014 Arrive time" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Return: " }, { type: "text", text: "Airline \u2014 Flight # \u2014 Depart time \u2014 Arrive time" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Accommodation" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Hotel/Airbnb: " }, { type: "text", text: "Name" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Address: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Check-in: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Check-out: " }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Confirmation #: " }] }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Daily Itinerary" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Day 1" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Morning: " }, { type: "text", text: "Activity" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Afternoon: " }, { type: "text", text: "Activity" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Evening: " }, { type: "text", text: "Activity / Dinner reservation" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Day 2" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Morning: " }, { type: "text", text: "Activity" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Afternoon: " }, { type: "text", text: "Activity" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Evening: " }, { type: "text", text: "Activity / Dinner reservation" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Day 3" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Morning: " }, { type: "text", text: "Activity" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Afternoon: " }, { type: "text", text: "Activity" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Evening: " }, { type: "text", text: "Activity / Dinner reservation" }] }] },
        ]},
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Packing List" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Passport / ID" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Chargers & adapters" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Medications" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Clothing (days 1\u20133)" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Toiletries" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Camera" }] }] },
        ]},
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Budget" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Flights: " }, { type: "text", text: "$" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Accommodation: " }, { type: "text", text: "$" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Food & Dining: " }, { type: "text", text: "$" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Activities: " }, { type: "text", text: "$" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Transport: " }, { type: "text", text: "$" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Total Budget: " }, { type: "text", text: "$" }] }] },
        ]},
      ]
    }
  },
];
