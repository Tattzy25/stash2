# TaTTTy - Copilot Instructions

## Repository Overview

**TaTTTy** is an AI-powered tattoo image generation and management platform built with Next.js 16, React 19, and TypeScript. The application features AI image generation, semantic search via Upstash, workflow-based image processing with Vercel Workflow, and a modern UI using shadcn/ui components.

- **Size**: ~178 source files, 56MB total
- **Type**: Full-stack Next.js web application with App Router
- **Languages**: TypeScript, TSX (React)
- **Runtime**: Node.js 18+ (note: some packages require 22+, use with `--legacy-peer-deps`)
- **Package Manager**: npm (README mentions pnpm but npm works with `--legacy-peer-deps`)

## Critical Build Instructions

### Environment Setup

**ALWAYS install dependencies with `--legacy-peer-deps` flag:**
```bash
npm install --legacy-peer-deps
```

This is REQUIRED due to:
- Next.js 16.0.7 + React 19.2.1 peer dependency conflicts
- Vercel Workflow beta package compatibility
- mixpart package requiring Node 22+ (current: 20.19.6)

**Never run `npm install` without this flag** - it will fail with peer dependency errors.

### Build Process (IMPORTANT)

The build will **always fail in sandbox environments** due to Google Fonts fetch errors. This is **NOT a code issue**:

```bash
npm run build
# Expected error: "Failed to fetch `Geist` from Google Fonts"
# This is a network/sandbox limitation, NOT a compilation error
```

**To verify TypeScript compilation success**, check that:
1. No TypeScript errors appear before the Google Fonts error
2. The error occurs during "Creating an optimized production build..."
3. Error message specifically mentions Google Fonts connection issues

### Scripts

- `npm run dev` - Start dev server with Turbopack
- `npm run build` - Production build (fails on Google Fonts in sandbox)
- `npm run check` - Run linter (requires ultracite config, may fail in fresh clone)
- `npm run format` - Format code with ultracite

### Known Build Issues & Workarounds

1. **Peer Dependency Conflicts**: Always use `--legacy-peer-deps`
2. **Google Fonts Failure**: Ignore in sandbox - this is environmental, not code
3. **ultracite linter**: May fail with "Could not resolve ultracite" - this is expected in CI
4. **Next.js not found**: Run `npm install --legacy-peer-deps` first
5. **Workflow package errors**: Requires stable Next.js 16.0.7 (not canary versions)

## Architecture & File Structure

### Routes
```
/                         → Landing page
/tattty                   → AI image generation (main app)
/tattty/gallery           → Upload & search gallery
/tattty/fonts             → Font generator (NEW)
/tattty/customize         → Custom image editor (NEW)
/tattty/settings          → Settings
/my-tatttz                → Personal collection (localStorage)
```

### Key Directories

```
app/
├── api/
│   ├── generate-images/route.ts    # Main image generation (Replicate)
│   ├── generate-fonts/route.ts     # Font generation (OpenAI GPT-4o-mini)
│   ├── generate-fonts-pdf/route.ts # PDF export (jsPDF)
│   ├── customize-image/route.ts    # Custom images (Fal.ai Flux Pro)
│   └── upload/                     # Vercel Workflow steps
│       ├── process-image.ts        # Workflow orchestrator
│       ├── upload-image.ts         # Step 1: Blob storage
│       ├── generate-description.ts # Step 2: AI description
│       └── index-image.ts          # Step 3: Upstash indexing
├── tattty/                         # Main app routes
│   ├── page.tsx                    # Image generation UI
│   ├── gallery/page.tsx            # Gallery with search
│   ├── fonts/page.tsx              # Font generator (NEW)
│   ├── customize/page.tsx          # Custom image editor (NEW)
│   ├── settings/page.tsx           # Settings
│   └── layout.tsx                  # Sidebar + header layout
├── my-tatttz/                      # User's saved images
│   ├── page.tsx                    # Collection view
│   └── components/                 # Image cards, carousel
├── actions/search.ts               # Server action for search
└── layout.tsx                      # Root layout

components/
├── app-sidebar.tsx                 # Navigation (5 menu items)
├── results.client.tsx              # Gallery search UI
├── ui/                             # 55+ shadcn/ui components (DO NOT MODIFY)
└── [various feature components]

lib/
├── provider-config.ts              # AI provider configuration (ONLY replicate)
├── image-storage.ts                # localStorage utilities
├── api-types.ts                    # Type definitions
└── utils.ts                        # Utility functions
```

### Configuration Files

- `next.config.ts` - Uses `withWorkflow()` wrapper, image config for Vercel Blob
- `tsconfig.json` - Strict mode enabled, `@/*` path alias
- `biome.jsonc` - Linter config (extends ultracite), relaxed rules for `components/ui/`
- `env.ts` - Environment validation (BLOB_READ_WRITE_TOKEN, UPSTASH_* vars)
- `package.json` - All dependencies, scripts

## Code Patterns & Conventions

### Provider Configuration (CRITICAL)

**The codebase ONLY supports `replicate` provider.** Previous references to `fireworks` were bugs and have been removed.

In `lib/provider-config.ts`:
```typescript
export type ProviderKey = "replicate";  // ONLY replicate
```

**Never reference `fireworks` provider** - this causes TypeScript errors. If adding providers, update:
1. `ProviderKey` type
2. `PROVIDERS` record
3. `MODEL_CONFIGS` record
4. `PROVIDER_ORDER` array

### AI SDK Usage

**Correct pattern for generateText (AI SDK v5):**
```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "...",
  // NO maxTokens parameter - this causes errors
});
```

**For image generation:**
```typescript
import { experimental_generateImage as generateImage } from "ai";
import { replicate } from "@ai-sdk/replicate";

const { image } = await generateImage({
  model: replicate.image("model-id"),
  prompt: "...",
  size: "1024x1024",
});
```

### React/UI Patterns

1. **Use "use client" directive** for all components with hooks/state
2. **Import shadcn/ui components** from `@/components/ui/[name]`
3. **Use existing components** - DO NOT create custom primitives
4. **Icons**: Use `lucide-react` or `@tabler/icons-react`
5. **Styling**: Tailwind CSS with existing utility classes

### Vercel Workflow Pattern

Workflow files use `"use step"` directive:
```typescript
export const stepName = async (params) => {
  "use step";
  // step implementation
};
stepName.maxRetries = 5;
```

## Security & Versions (CVE-2025-55182)

**Current versions (REQUIRED for security):**
- Next.js: 16.0.7 stable (NOT canary)
- React: 19.2.1
- React-DOM: 19.2.1

**Do not use:**
- Next.js 16.1.0-canary.* (workflow compatibility issues)
- React 19.2.0 or earlier (security vulnerability)

## Common Errors & Solutions

### "Property 'fireworks' does not exist"
**Cause**: Code references non-existent fireworks provider  
**Fix**: Remove all fireworks references, only use `replicate`

### "maxTokens does not exist in type"
**Cause**: Invalid parameter for AI SDK v5 generateText  
**Fix**: Remove `maxTokens` parameter from generateText calls

### "Cannot find module 'next/dist/lib/server-external-packages.json'"
**Cause**: Canary Next.js version incompatible with Workflow  
**Fix**: Use Next.js 16.0.7 stable

### "Peer dependency conflict"
**Cause**: Missing `--legacy-peer-deps` flag  
**Fix**: Always use `npm install --legacy-peer-deps`

### Build fails on "Google Fonts"
**Cause**: Sandbox network restrictions  
**Fix**: This is expected - verify no TypeScript errors before this

## Testing & Validation

### Manual Validation Steps

1. **After dependency changes**: 
   ```bash
   npm install --legacy-peer-deps
   npm run build  # Verify no TS errors before Google Fonts
   ```

2. **After code changes**:
   - Check TypeScript compilation (ignore Google Fonts error)
   - Verify no references to `fireworks` provider
   - Ensure AI SDK calls don't use invalid parameters

3. **Before committing**:
   - All new files use existing shadcn/ui components
   - No custom HTML primitives added
   - Sidebar menu items follow existing patterns

### No Automated Tests

This project has **no test suite**. Validation is manual through:
- TypeScript compilation
- Build process (minus Google Fonts)
- Manual UI testing in development

## Environment Variables
```bash
BLOB_READ_WRITE_TOKEN=...           # Vercel Blob (required)
UPSTASH_SEARCH_REST_URL=...         # Upstash Search (required)
UPSTASH_SEARCH_REST_TOKEN=...       # Upstash Search (required)
UPSTASH_SEARCH_REST_READONLY_TOKEN=... # Upstash Search (required)
```

## Key Dependencies

### AI & Image Generation
- `@ai-sdk/openai` - Font generation
- `@ai-sdk/fal` - Custom image generation
- `@ai-sdk/replicate` - Main image generation
- `ai` - Vercel AI SDK v5
- `jspdf` - PDF generation for fonts

### Vercel Services
- `@vercel/blob` - Image storage
- `workflow` - Vercel Workflow (beta)

### UI Framework
- 55+ `@radix-ui/*` packages (via shadcn/ui)
- `lucide-react`, `@tabler/icons-react` - Icons
- `tailwindcss` v4 - Styling

## Trust These Instructions

When working on this codebase:
- **Always use `--legacy-peer-deps`** for npm install
- **Ignore Google Fonts errors** in build output
- **Never reference fireworks provider**
- **Use Next.js 16.0.7 stable, React 19.2.1**
- **Follow existing shadcn/ui patterns**
- **Check provider-config.ts before adding AI features**

Only perform additional searches if information is not covered above.
