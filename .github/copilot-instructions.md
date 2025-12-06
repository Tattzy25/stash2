# TaTTTy - AI Coding Agent Instructions

## Project Overview
**TaTTTy** is a tattoo image generation & management platform with two core features:
1. **AI Image Generation** (`/tattty`) - Generate tattoo designs using Replicate & Fireworks AI
2. **Gallery & Search** (`/tattty/gallery`) - Upload images, get AI descriptions, semantic search via Upstash

Built with **Next.js 16** (App Router + Turbopack), **React 19**, **Tailwind CSS 4**, **Vercel Workflow**.

## Architecture

### Routes Structure
```
/                    → Landing (Enter button → /tattty)
/tattty              → AI image generation UI (sidebar layout)
/tattty/gallery      → Upload & search gallery (Vercel Blob + Upstash Search)
/tattty/settings     → Settings placeholder
/my-tatttz           → Personal collection (localStorage-based liked/generated)
```

### Data Flows
**Generation Flow:**
```
Prompt → useImageGeneration hook → /api/generate-images → AI SDK → base64 image
       → localStorage (lib/image-storage.ts)
```

**Upload Flow (Workflow):**
```
File → /api/upload → Vercel Workflow (process-image.ts):
  1. uploadImage → Vercel Blob
  2. generateDescription → AI description
  3. indexImage → Upstash Search with metadata
```

**Search Flow:**
```
Query → app/actions/search.ts → Upstash Search index "images" → filtered results
```

### Key Directories
- `app/tattty/` - Main app with sidebar layout (`layout.tsx` wraps with AppSidebar)
- `app/api/upload/` - Workflow-based image processing (4 files)
- `app/api/generate-images/` - Direct AI generation endpoint
- `components/ui/` - 55+ shadcn/ui components (DO NOT MODIFY)
- `lib/` - Utilities, provider configs, storage helpers

## Development Commands
```bash
pnpm dev          # Dev server with Turbopack
pnpm build        # Production build with Turbopack  
pnpm check        # Biome linter via ultracite
pnpm format       # Format via ultracite
```

## Critical Conventions

### UI Components
- **Use ONLY shadcn/ui** from `components/ui/` - no custom primitives
- Import: `import { Button } from "@/components/ui/button"`
- Icons: `lucide-react` and `@tabler/icons-react`

### Code Style
- Biome/Ultracite strict linting (relaxed for `components/ui/`)
- `@/` path alias for all imports
- `"use client"` directive for components with hooks/state

### Provider System (`lib/provider-config.ts`)
```typescript
type ProviderKey = "replicate" | "fireworks";
type ModelMode = "performance" | "quality";
```
Two providers, each with preset models. Extend `PROVIDERS` record to add more.

### Storage Patterns
- **Generated images**: `localStorage` via `lib/image-storage.ts` (max 100)
- **Uploaded images**: Vercel Blob (`@vercel/blob`)
- **Search index**: Upstash Search with tattoo metadata filtering

### Workflow Pattern (`app/api/upload/`)
Uses Vercel Workflow (`"use workflow"` directive) for multi-step processing:
- `process-image.ts` - orchestrator
- `upload-image.ts` → `generate-description.ts` → `index-image.ts`

## Environment Variables (Required)
```bash
BLOB_READ_WRITE_TOKEN=...           # Vercel Blob
UPSTASH_SEARCH_REST_URL=...         # Upstash Search
UPSTASH_SEARCH_REST_TOKEN=...       # Upstash Search
UPSTASH_SEARCH_REST_READONLY_TOKEN=...
# AI providers (for generation)
REPLICATE_API_TOKEN=...
FIREWORKS_API_KEY=...
```

## Key Files Reference
- `lib/provider-config.ts` - AI provider/model configuration
- `lib/image-storage.ts` - localStorage persistence for generated images
- `hooks/use-image-generation.ts` - React hook for generation state
- `components/app-sidebar.tsx` - Navigation structure
- `app/actions/search.ts` - Server action for Upstash Search
