# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

UIGen is an AI-powered React component generator. Users describe components via chat, Claude generates them in real-time using a virtual file system (no disk writes), and a live preview renders the result in an iframe.

## Commands

- `npm run setup` — Install deps, generate Prisma client, run migrations (first-time setup)
- `npm run dev` — Start dev server with Turbopack on http://localhost:3000
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run test` — Run Vitest suite
- `npx vitest run path/to/file.test.ts` — Run a single test file
- `npm run db:reset` — Reset SQLite database

## Architecture

**Stack**: Next.js 15 (App Router) / React 19 / TypeScript / Tailwind CSS v4 / Prisma (SQLite) / Vercel AI SDK

**Three-panel layout** (`src/app/main-content.tsx`): Chat (left) | Preview + Code Editor (right, split vertically)

### AI Flow

1. User sends prompt → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Vercel AI SDK `streamText()` calls Claude (claude-haiku-4-5) with two tools:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`) — create/edit files
   - `file_manager` (`src/lib/tools/file-manager.ts`) — rename/delete files
3. Tool calls modify the in-memory VirtualFileSystem → changes reflect in editor and preview
4. On completion, project state saved to DB if user is authenticated

The system prompt is in `src/lib/prompts/generation.tsx`. AI generates React+Tailwind components with `/App.jsx` as entry point.

If `ANTHROPIC_API_KEY` is not set in `.env`, a MockLanguageModel is used instead (`src/lib/provider.ts`).

### Virtual File System

`src/lib/file-system.ts` — In-memory tree with Map-based storage. Supports create, update, delete, rename, and serialization for persistence. This is the core abstraction that both AI tools and the UI operate on.

### State Management

Two React Contexts wrap the main content:
- `ChatContext` (`src/lib/contexts/chat-context.tsx`) — wraps `useChat()` from `@ai-sdk/react`, manages messages and submission
- `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) — manages VirtualFileSystem state, handles tool calls from AI, tracks selected file

### Auth

JWT-based auth with httpOnly cookies (jose library). Server actions in `src/actions/index.ts` handle signUp/signIn/signOut. Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem` routes. Anonymous users can work without signing in; their work is tracked via localStorage and can be saved on sign-in.

### Database

SQLite via Prisma. Two models: `User` (email, password) and `Project` (name, userId, messages as JSON string, data as JSON string). Schema at `prisma/schema.prisma`, client generated to `src/generated/prisma/`.

### UI Components

- `src/components/ui/` — shadcn/ui primitives (Radix-based)
- `src/components/chat/` — ChatInterface, MessageList, MessageInput
- `src/components/editor/` — CodeEditor (Monaco), FileTree
- `src/components/preview/` — PreviewFrame (iframe with Babel compilation)
- `src/components/auth/` — SignInForm, SignUpForm, AuthDialog

### Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Testing

Vitest with jsdom environment and React Testing Library. Tests live in `__tests__` directories alongside source code.
