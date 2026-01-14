# Pandblink - AI Real Estate Photo Enhancement

## Project Overview
Dutch SaaS application for AI-powered real estate photo enhancement. Users upload property photos, and the AI improves lighting, colors, and sharpness for Funda listings.

**Live URL:** https://pandblink.nl
**GitHub:** https://github.com/markjkaem/pandblink

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5 (Google OAuth + Email magic links via Resend)
- **Payments:** Stripe (iDEAL + Credit Card)
- **AI:** Replicate API (Real-ESRGAN model)
- **Analytics:** Vercel Analytics
- **Hosting:** Vercel

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production (runs prisma generate first)
npm run start        # Start production server

# Type Checking & Linting (RUN BEFORE PUSH!)
npx tsc --noEmit     # TypeScript type check (no output files)
npm run build        # Full build check (same as Vercel)
npm run lint         # ESLint check

# Database
npx prisma studio    # Open Prisma Studio GUI
npx prisma migrate dev --name <name>  # Create migration
npx prisma db push   # Push schema changes (dev only)
npx prisma generate  # Regenerate Prisma client

# Testing with Playwright
npx playwright test              # Run all tests
npx playwright test --ui         # Open Playwright UI
npx playwright test --headed     # Run with visible browser
npx playwright codegen           # Generate tests by recording

# Git (always type-check before pushing!)
npx tsc --noEmit && git add . && git commit -m "message" && git push origin master
```

## Pre-Push Checklist
1. `npx tsc --noEmit` - Verify no TypeScript errors
2. `npm run build` - Verify build succeeds (same as Vercel)
3. Test locally if making significant changes
4. Then commit and push

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── enhance/             # Image enhancement (POST)
│   │   ├── history/             # User photo history (GET)
│   │   ├── stripe/              # checkout, webhook, verify
│   │   └── openapi.json/        # API documentation
│   ├── page.tsx                 # Homepage with upload
│   ├── login/                   # Auth pages
│   ├── credits/                 # Purchase credits
│   ├── history/                 # Photo gallery
│   ├── faq/                     # FAQ page
│   ├── sitemap.ts               # Dynamic sitemap
│   └── layout.tsx               # Root layout (analytics, metadata)
├── components/
│   ├── SessionProvider.tsx      # NextAuth wrapper
│   ├── CookieConsent.tsx        # GDPR cookie banner
│   ├── ErrorBoundary.tsx        # Error handling
│   └── Skeleton.tsx             # Loading skeletons
└── lib/
    ├── auth.ts                  # NextAuth config
    ├── prisma.ts                # Prisma client
    ├── stripe.ts                # Stripe client + packages
    ├── email.ts                 # Resend email templates
    ├── email-utils.ts           # Email normalization
    └── rate-limit.ts            # In-memory rate limiting
```

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://pandblink.nl
NEXTAUTH_SECRET=<random-string>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
RESEND_API_KEY=<from-resend>
STRIPE_SECRET_KEY=<from-stripe>
STRIPE_WEBHOOK_SECRET=<from-stripe>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from-stripe>
REPLICATE_API_TOKEN=<from-replicate>
```

## Credit System
- New users get **3 free credits** on signup
- 1 credit = 1 photo enhancement
- Packages: 10 credits (€9), 25 credits (€19), 50 credits (€29)
- Credits never expire

## API Rate Limits
- `/api/enhance`: 30 requests/hour per IP
- `/api/stripe/checkout`: 10 requests/hour per IP

## Key Files to Know

| Purpose | File |
|---------|------|
| Homepage UI | `src/app/page.tsx` |
| Auth config | `src/lib/auth.ts` |
| Database schema | `prisma/schema.prisma` |
| Image enhancement | `src/app/api/enhance/route.ts` |
| Stripe checkout | `src/app/api/stripe/checkout/route.ts` |
| Credit packages | `src/lib/stripe.ts` |
| SEO metadata | `src/app/layout.tsx` |

## Design System
- **Primary color:** Orange (#f97316) to Amber (#f59e0b) gradient
- **Font:** Inter (via Google Fonts)
- **Language:** Dutch (nl_NL)
- **Icons:** Inline SVGs (no icon library)

## Deployment
Vercel auto-deploys from `master` branch. Build command includes `prisma generate`.

## Testing Checklist
1. Upload image → enhance → download
2. Login with Google / Email magic link
3. Purchase credits (test mode: use card 4242...)
4. Check /history shows enhanced photos
5. Verify sitemap at /sitemap.xml
6. Test OG image with Facebook debugger

## Playwright Test Setup

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /stralen/i })).toBeVisible();
});

test('can navigate to FAQ', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /veelgestelde vragen/i }).click();
  await expect(page).toHaveURL('/faq');
});
```

## Common Issues

**Prisma client not found after deploy:**
→ Build script includes `prisma generate`

**Stripe webhook failing:**
→ Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard

**Images not loading from Replicate:**
→ Check `next.config.ts` has correct `remotePatterns`

**Rate limit hit in development:**
→ Rate limits are in-memory, restart dev server to reset
