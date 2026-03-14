# noteseq

A real-time collaborative note-taking app that combines the best of Notion and Logseq. Block-based outliner with WYSIWYG editing, live multiplayer cursors, backlinks, a knowledge graph, and daily journals — all in a dark, polished, developer-luxe interface.

**Live app, not a toy.** This should be usable day one AND impressive as a portfolio piece.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **Next.js 14+ (App Router)** | SSR, routing, API layer |
| Backend / DB | **Convex** | Reactive database, server functions, file storage, real-time subscriptions |
| Real-time Editor Sync | **Yjs** (CRDT) | Conflict-free collaborative editing across clients |
| Yjs Transport | **y-partykit** or **y-websocket** (via Convex action or standalone server) | WebSocket provider for Yjs document sync |
| Auth | **Convex Auth** with **Google OAuth** | Sign-in with Google, open sign-up |
| Editor | **TipTap** (built on ProseMirror) + **yjs binding** (`y-prosemirror`) | WYSIWYG block editor with Yjs collab integration |
| Styling | **Tailwind CSS** | Utility-first styling |
| Deployment | **Vercel** (frontend) + **Convex Cloud** (backend) | Production hosting |
| Knowledge Graph | **D3.js** or **react-force-graph** | Interactive graph visualization of page links |

---

## Core Concepts

### Pages
- Every page is a **tree of blocks** (outliner structure like Logseq)
- Pages can be **personal** (private to the creator) or **shared** (invited collaborators can edit)
- Pages are either **freeform** (user-created) or **daily journal** (auto-created per day)
- Pages have a title, icon (optional emoji), and a creation/modified timestamp

### Blocks
- The fundamental unit of content
- Each block is a single line/node in the outliner tree
- Blocks can be **nested** (indented under parent blocks, collapsible)
- Blocks are individually referenceable (every block gets a unique ID)

### Collaboration Model
- **Personal pages**: Only the creator can see/edit. Default for new pages.
- **Shared pages**: Creator invites collaborators by email. All invited users can edit simultaneously.
- **Real-time sync**: When multiple users are on the same page, they see each other's cursors and edits live via Yjs.
- **Presence**: Show who is currently viewing/editing a page (avatars in the top bar).

---

## Features — MVP (v1)

### 1. Authentication
- Google OAuth sign-in via Convex Auth
- Open sign-up — anyone with a Google account can create an account
- User profile: name, email, avatar (pulled from Google)
- Session management handled by Convex

### 2. Editor — WYSIWYG Block Outliner
**This is the core of the app. It needs to feel incredible to type in.**

- **No markdown syntax.** Users type naturally. Bold is Cmd+B, italic is Cmd+I, etc.
- Built on **TipTap** with ProseMirror under the hood
- Yjs integration via `y-prosemirror` for real-time sync
- Outliner behavior:
  - Every block is a bullet point by default (like Logseq)
  - `Tab` to indent (nest under parent), `Shift+Tab` to outdent
  - `Enter` creates a new sibling block
  - Click the bullet dot to collapse/expand children
  - Drag blocks to reorder
- **Slash command menu**: Type `/` anywhere to open a floating command palette to insert block types

#### Block Types
| Type | Trigger | Description |
|------|---------|-------------|
| **Text** | Default | Plain rich text with bold, italic, underline, strikethrough, inline code, highlight |
| **Heading 1** | `/h1` | Large heading block |
| **Heading 2** | `/h2` | Medium heading block |
| **Heading 3** | `/h3` | Small heading block |
| **To-do** | `/todo` | Checkbox block, toggleable complete/incomplete |
| **Image** | `/image` | Upload an image or paste from clipboard. Stored in Convex file storage. Render inline with optional caption. |
| **Callout** | `/callout` | Highlighted alert/info box with emoji icon + colored background |
| **Toggle** | `/toggle` | Collapsible content block — click header to show/hide children |
| **Divider** | `/divider` or `---` | Horizontal rule separator |
| **Embed** | `/embed` | Paste a YouTube, Twitter, or generic URL — render as an inline embed/preview |

#### Inline Features
- `[[Page Name]]` — typing double brackets opens a page search dropdown. Selecting a page creates a **backlink** (clickable inline reference that navigates to that page). The linked page should be aware it was referenced (for the graph and backlinks panel).
- **Keyboard shortcuts**: Standard formatting (Cmd+B, Cmd+I, Cmd+U, Cmd+Shift+X for strikethrough, Cmd+E for inline code)

### 3. Real-Time Collaboration
- **Yjs CRDT** handles all document state and conflict resolution
- **Live cursors**: When multiple people edit the same page, show labeled colored cursors with each user's name
- **Presence indicators**: Top of the page shows avatar pills for everyone currently viewing the page
- **Awareness protocol**: Use Yjs awareness to broadcast cursor position, selection, and user info
- Edits sync with sub-100ms latency over WebSocket
- **Persistence**: Yjs document state must be persisted to Convex so pages aren't lost when all users disconnect. Use a Convex mutation to periodically snapshot the Yjs document state (encoded as base64 or Uint8Array stored in Convex).

### 4. Sidebar Navigation
- Fixed left sidebar (collapsible)
- Sections:
  - **Search** — full-text search across all accessible pages
  - **Journal** — expandable section showing daily journal entries (today at top, past days below)
  - **Personal Pages** — list of user's private pages, nestable in a tree
  - **Shared with Me** — pages others have shared with the user
  - **Graph View** — link to open the knowledge graph
- Create new page button (+ icon)
- Each page shows: title, emoji icon (if set), "shared" indicator badge
- Drag to reorder pages (nice to have for v1, not critical)

### 5. Daily Journal
- Opening the app defaults to **today's journal page**
- Auto-created: if today's journal doesn't exist yet, create it on load
- Journal page title is the formatted date (e.g., "March 13, 2026")
- Otherwise behaves exactly like a freeform page (same editor, same blocks)
- Calendar widget or date picker to jump to past journal entries (nice to have)

### 6. Sharing & Permissions
- On any personal page, the creator can click "Share" to invite collaborators
- Invite by email — if the email matches a noteseq account, they get access
- Shared pages show up in collaborators' "Shared with Me" sidebar section
- All collaborators have **equal edit access** (no viewer-only for v1)
- Page creator can revoke access

### 7. Backlinks & References
- When a user types `[[Page Name]]`, it creates a bidirectional link
- Each page has a **Backlinks panel** at the bottom (collapsed by default) showing all pages that reference it
- Clicking a backlink navigates to that page and highlights the referencing block

### 8. Knowledge Graph
- Full-page interactive graph visualization
- Every page is a **node**, every `[[backlink]]` is an **edge**
- Use **react-force-graph** or **D3 force simulation**
- Nodes are labeled with page titles
- Click a node to navigate to that page
- Visual: glowing nodes on dark background, animated force layout
- Filter controls: show only personal pages, only shared, or all
- Zoom, pan, hover to highlight connections

---

## Design & Visual Direction

**Aesthetic: Dark, polished, developer-luxe.** Think Obsidian meets Linear meets Vercel's dashboard.

### Color Palette

Uses the brand token system defined in the Brand Identity section below.

**Backgrounds** — Dark Ramp tokens:
- `--dark-void` (`#0A0A0F`) — Page background, deepest layer
- `--dark-surface` (`#111116`) — Sidebar, cards, content areas
- `--dark-elevated` (`#1A1A22`) — Modals, dropdowns, hover surfaces
- `--dark-raised` (`#252530`) — Active surfaces, selected items

**Accent** — Gold Ramp tokens:
- `--gold-100` (`#F2D479`) — Highlights, active states, sheen peak
- `--gold-300` (`#D4A843`) — Primary accent, buttons, links, borders
- `--gold-500` (`#B8892E`) — Hover states, secondary accent
- `--gold-700` (`#8B6D2E`) — Pressed states, deep accent, gradient anchors

**Text** — Text Color tokens:
- `--text-primary` (`#E8E8ED`) — Headings, body text
- `--text-secondary` (`#A0A0B0`) — Descriptions, metadata
- `--text-muted` (`#66667A`) — Placeholders, disabled, timestamps

**Other**:
- **Border/Dividers**: Subtle, low-contrast (`rgba(255,255,255,0.06)`)
- **Cursor colors**: Each collaborator gets a distinct bright color (pool of 8-10 vibrant colors)
- **Callout colors**: Soft tinted backgrounds (blue-ish for info, amber for warning, green for success, red for error)

The **carbon fiber CSS texture** should be used for premium surface areas: login page hero, sidebar header, empty states, and graph background.

### Typography

Uses **Outfit** as the primary display and body font, and **Space Mono** for code and monospace contexts.

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Logo | Outfit | 900 | 56px |
| Tagline | Outfit | 700 | 22px |
| H1 | Outfit | 700 | 32px |
| H2 | Outfit | 600 | 24px |
| Body | Outfit | 400 | 15px, line-height 1.6 |
| Inline code / mono | Space Mono | 400 | 13px |

### Layout
- Full-height app layout, no scrollable chrome
- Sidebar: 260px wide, collapsible to icon-only (56px)
- Editor: centered content column, max-width ~720px with generous padding
- Top bar: minimal — page title (editable inline), presence avatars, share button
- Smooth transitions on sidebar collapse, page navigation, modal open/close

### Interactions & Polish
- Subtle hover states on all interactive elements
- Smooth animated page transitions (fade or slide)
- Slash command menu: floating, filterable, keyboard-navigable (up/down arrows, Enter to select)
- Toast notifications for events (someone joined, page shared, etc.)
- Loading states: skeleton screens, not spinners
- The knowledge graph should feel alive — gentle node movement, glow effects, smooth zoom

---

## Brand Identity

### Logo
- **Primary mark**: "NOTESEQ" wordmark in Outfit 900 weight, 4px letter-spacing
- **Text treatment**: Animated metallic gold gradient sheen using these stops: `#8B6D2E → #D4A843 → #F2D479 → #FFF5D4 → #F2D479 → #D4A843 → #8B6D2E → #D4A843`
- `background-size: 200% 100%` with a 5s ease-in-out infinite animation shifting `background-position` from `0% 50%` to `100% 50%`
- Behind the main title, render a blurred echo layer: same text with `-webkit-text-stroke: 1.5px rgba(212,168,67,0.2)`, transparent fill, `filter: blur(6px)`, positioned absolute
- **Tagline**: "THINK TOGETHER" in Outfit 700, 22px, 8px letter-spacing, uppercase
  - Gold stencil outline: `-webkit-text-stroke: 1.2px #D4A843`, transparent fill
  - Subtle glow: `drop-shadow(0 0 16px rgba(212,168,67,0.18)) drop-shadow(0 0 36px rgba(212,168,67,0.07))`
- **Favicon**: "nq" monogram in Outfit 700, gold on dark or dark on gold variants
  - Dark variant: `background: #0A0A0F`, `color: #D4A843`
  - Gold variant: `background: linear-gradient(135deg, #C9A54E, #F2D479)`, `color: #0A0A0F`
  - Border radius: 6px at 32px, 10px at 64px

### Carbon Fiber Texture
Used as a surface material for hero sections, cards, sidebar backgrounds, or any area that needs premium texture. Pure CSS, no images:

```css
.carbon-fiber {
  background-color: #12151c;
  background-image:
    repeating-linear-gradient(135deg,
      rgba(200,210,230,0.22) 0px, rgba(170,180,200,0.18) 1.5px,
      rgba(60,66,80,0.4) 3px, rgba(20,24,32,0.55) 4px,
      rgba(60,66,80,0.4) 5px, rgba(170,180,200,0.18) 6.5px,
      rgba(200,210,230,0.22) 8px
    ),
    repeating-linear-gradient(45deg,
      rgba(170,180,200,0.16) 0px, rgba(140,150,170,0.12) 1.5px,
      rgba(45,50,65,0.35) 3px, rgba(12,15,22,0.5) 4px,
      rgba(45,50,65,0.35) 5px, rgba(140,150,170,0.12) 6.5px,
      rgba(170,180,200,0.16) 8px
    );
}
/* Optional sheen overlay */
.carbon-fiber::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 55% 30%, rgba(210,220,240,0.12) 0%, transparent 40%);
  pointer-events: none;
}
```

### Gold Ramp
| Token | Hex | Usage |
|-------|-----|-------|
| `--gold-100` | `#F2D479` | Highlights, active states, sheen peak |
| `--gold-300` | `#D4A843` | Primary accent, buttons, links, borders |
| `--gold-500` | `#B8892E` | Hover states, secondary accent |
| `--gold-700` | `#8B6D2E` | Pressed states, deep accent, gradient anchors |

### Dark Ramp
| Token | Hex | Usage |
|-------|-----|-------|
| `--dark-void` | `#0A0A0F` | Page background |
| `--dark-surface` | `#111116` | Sidebar, cards |
| `--dark-elevated` | `#1A1A22` | Modals, dropdowns, hover surfaces |
| `--dark-raised` | `#252530` | Active surfaces, selected items |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#E8E8ED` | Headings, body text |
| `--text-secondary` | `#A0A0B0` | Descriptions, metadata |
| `--text-muted` | `#66667A` | Placeholders, disabled, timestamps |

### Typography
| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Logo | Outfit | 900 | 56px |
| Tagline | Outfit | 700 | 22px |
| H1 | Outfit | 700 | 32px |
| H2 | Outfit | 600 | 24px |
| Body | Outfit | 400 | 15px, line-height 1.6 |
| Inline code / mono | Space Mono | 400 | 13px |

---

## Data Model (Convex Schema)

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    googleId: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_googleId", ["googleId"]),

  pages: defineTable({
    title: v.string(),
    icon: v.optional(v.string()), // emoji
    ownerId: v.id("users"),
    isJournal: v.boolean(),
    journalDate: v.optional(v.string()), // "2026-03-13" format for journal pages
    isShared: v.boolean(),
    // Yjs document state (persisted snapshot)
    yjsState: v.optional(v.bytes()), // Uint8Array encoded Yjs doc
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_journal", ["ownerId", "isJournal", "journalDate"])
    .index("by_updated", ["updatedAt"]),

  // Tracks who has access to shared pages
  pageCollaborators: defineTable({
    pageId: v.id("pages"),
    userId: v.id("users"),
    invitedBy: v.id("users"),
    addedAt: v.number(),
  })
    .index("by_page", ["pageId"])
    .index("by_user", ["userId"]),

  // Backlink tracking: page A references page B
  backlinks: defineTable({
    sourcePageId: v.id("pages"),
    targetPageId: v.id("pages"),
    // Block ID within source page that contains the reference
    sourceBlockId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_target", ["targetPageId"])
    .index("by_source", ["sourcePageId"]),

  // Image and file uploads
  files: defineTable({
    storageId: v.id("_storage"),
    uploadedBy: v.id("users"),
    pageId: v.id("pages"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    createdAt: v.number(),
  })
    .index("by_page", ["pageId"]),
});
```

---

## Yjs Architecture

### Document Sync Strategy
1. Each page has its own Yjs `Y.Doc`
2. When a user opens a page:
   - Load the persisted Yjs state from Convex (`yjsState` field)
   - Initialize a local `Y.Doc` and apply the persisted state
   - Connect to a WebSocket room for that page (room ID = page ID)
   - Any other users on the same page are in the same room
3. Edits sync peer-to-peer through the WebSocket provider
4. Periodically (on change, debounced ~2-5 seconds), encode the Y.Doc and persist to Convex via mutation
5. When all users leave, the final state is persisted

### WebSocket Provider Options
Choose ONE of these approaches:

**Option A: PartyKit (Recommended)**
- Use **PartyKit** as a standalone WebSocket server for Yjs sync
- `y-partykit` package provides a ready-made Yjs sync server
- Deploy to PartyKit's cloud (free tier is generous)
- Pros: Purpose-built for this, zero config, handles rooms natively
- Cons: Additional service to manage

**Option B: Self-hosted y-websocket**
- Run a `y-websocket` server on a small VPS or Railway
- More control, but more ops work

**Option C: Convex-native (Advanced)**
- Use Convex actions + WebSockets if Convex supports it
- Likely requires more custom code

### TipTap + Yjs Integration
```
TipTap Editor
  └── y-prosemirror (collaboration extension)
        └── Y.Doc (shared document state)
              └── WebSocket Provider (y-partykit)
                    └── Other connected clients
```

- Use TipTap's `@tiptap/extension-collaboration` for Yjs binding
- Use `@tiptap/extension-collaboration-cursor` for live cursor rendering
- Awareness protocol carries user name, color, and cursor position

---

## Key Pages & Routes

```
/                     → Redirect to today's journal
/journal              → Today's journal page
/journal/[date]       → Specific journal date
/p/[pageId]           → Freeform page editor
/graph                → Full-page knowledge graph
/settings             → User settings (profile, theme prefs)
/login                → Google OAuth login page
```

---

## Project Structure

```
noteseq/
├── convex/
│   ├── schema.ts           # Data model (above)
│   ├── auth.config.ts      # Convex Auth config with Google OAuth
│   ├── auth.helpers.ts     # Shared auth + validation utilities
│   ├── users.ts            # User queries/mutations
│   ├── pages.ts            # Page CRUD, journal logic, sharing
│   ├── backlinks.ts        # Backlink creation/querying
│   └── files.ts            # Image upload via Convex storage
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout (dark theme)
│   │   ├── globals.css     # Tailwind + brand tokens + editor styles
│   │   ├── page.tsx        # Redirect to journal
│   │   ├── login/
│   │   │   └── page.tsx    # Google OAuth login
│   │   ├── journal/
│   │   │   ├── page.tsx    # Today's journal
│   │   │   └── [date]/
│   │   │       └── page.tsx
│   │   ├── p/
│   │   │   └── [pageId]/
│   │   │       └── page.tsx
│   │   ├── graph/
│   │   │   └── page.tsx    # Knowledge graph
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── editor/
│   │   │   ├── Editor.tsx
│   │   │   ├── EditorPage.tsx
│   │   │   └── SlashCommandMenu.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── sharing/
│   │   │   ├── ShareModal.tsx
│   │   │   └── PresenceAvatars.tsx
│   │   └── ui/
│   │       ├── Toast.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       └── Tooltip.tsx
│   ├── lib/
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── test/
│       └── setup.ts
├── vitest.config.ts
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── .env.local              # CONVEX_DEPLOYMENT, Google OAuth keys, PartyKit URL
```

---

## Implementation Order

Build in this sequence — each phase is deployable and testable:

### Phase 1: Foundation
1. Initialize Next.js project with Tailwind
2. Set up Convex (install, init, deploy schema)
3. Implement Google OAuth with Convex Auth
4. Build the app shell: sidebar layout, routing, dark theme
5. Basic page CRUD (create, rename, delete pages in Convex)

### Phase 2: Editor Core
6. Integrate TipTap with basic rich text (bold, italic, headings)
7. Implement outliner behavior (indent/outdent, Enter for new blocks, collapse/expand)
8. Add slash command menu with all block types
9. Implement all block types: to-do, callout, toggle, divider, image upload, embed
10. Page persistence: save TipTap content to Convex on change (debounced)

### Phase 3: Real-Time Collaboration
11. Set up Yjs document per page
12. Set up PartyKit (or chosen WebSocket provider) with y-partykit
13. Connect TipTap to Yjs via `y-prosemirror`
14. Implement live cursors with user name labels
15. Implement presence (avatars in top bar showing who's on the page)
16. Yjs state persistence to Convex (periodic snapshots)

### Phase 4: Sharing & Backlinks
17. Share modal: invite collaborators by email
18. "Shared with Me" section in sidebar
19. `[[backlink]]` autocomplete: typing `[[` opens page search
20. Backlink tracking in Convex (create/delete backlink records)
21. Backlinks panel at bottom of each page

### Phase 5: Knowledge Graph & Journal
22. Daily journal: auto-create today's page, calendar navigation
23. Knowledge graph visualization with D3/react-force-graph
24. Graph interactivity: click to navigate, hover to highlight, zoom/pan
25. Full-text search across pages

### Phase 6: Polish
26. Skeleton loading states for all views
27. Animated page transitions
28. Toast notification system
29. Mobile responsiveness (at minimum: readable, ideally: usable)
30. Error handling, edge cases, empty states
31. Performance: lazy load graph, virtualize long page lists

---

## Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Google OAuth (configure in Convex Auth dashboard)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# PartyKit (if using)
NEXT_PUBLIC_PARTYKIT_HOST=noteseq.partykit.dev

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "convex": "latest",
    "@convex-dev/auth": "latest",
    "@tiptap/react": "latest",
    "@tiptap/starter-kit": "latest",
    "@tiptap/extension-collaboration": "latest",
    "@tiptap/extension-collaboration-cursor": "latest",
    "@tiptap/extension-placeholder": "latest",
    "@tiptap/extension-task-list": "latest",
    "@tiptap/extension-task-item": "latest",
    "@tiptap/extension-image": "latest",
    "@tiptap/extension-link": "latest",
    "yjs": "latest",
    "y-prosemirror": "latest",
    "y-partykit": "latest",
    "react-force-graph-2d": "latest",
    "tailwindcss": "latest",
    "framer-motion": "latest"
  }
}
```

---

## Non-Goals for v1
- Offline support / local-first
- Native mobile apps
- End-to-end encryption
- Version history / page snapshots
- Comments / annotations
- Public page sharing (link-based)
