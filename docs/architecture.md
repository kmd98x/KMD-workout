# Keeping a Multi-Feature App Fast: Next.js (App Router) + Convex

Examples showing how one app with many features stays as fast as single-purpose apps.

**Good news:** Next.js gives you code splitting and route isolation for free, and Convex's reactive queries are naturally on-demand — a query only runs (and only stays subscribed) while a component using it is mounted. Your job is mostly folder structure and discipline.

> Examples below use two placeholder features, `feature-a` and `feature-b` (e.g. `posts`/`comments`, `orders`/`inventory`, `sports`/`nutrition` — swap in whatever your app actually has). Replace the names, not the patterns.

---

## 1. Code Splitting / Lazy Loading

### Automatic: every route is its own chunk ✅

Each `page.jsx` in the App Router is automatically a separate bundle:

```
app/
├── layout.jsx            # app shell + ConvexClientProvider — always loaded
├── page.jsx              # home
├── feature-a/page.jsx    # → feature-a chunk, loads only on /feature-a
├── feature-b/page.jsx    # → feature-b chunk
└── feature-c/page.jsx    # → feature-c chunk
```

A user visiting `/feature-a` never downloads a byte of `feature-b` or `feature-c` code. Zero configuration.

### Manual: `next/dynamic` for heavy components *within* a page

```jsx
// app/feature-a/page.jsx
import dynamic from 'next/dynamic';

// A charting/heavy library — don't load it until the page renders it
const UsageChart = dynamic(() => import('./UsageChart'), {
  loading: () => <ChartSkeleton />,
});

// Editor only loads when the user opens it
const ItemEditor = dynamic(() => import('./ItemEditor'), {
  ssr: false, // client-only component
});
```

### Prefetching is automatic too

```jsx
import Link from 'next/link';

// Next prefetches the feature-a chunk when this link enters the viewport
<Link href="/feature-a">Feature A</Link>
```

---

## 2. Route-Based Isolation

Folders are routes in the App Router — so isolation is mostly about organizing well. With Convex, this applies **twice**: once in `app/`, once in `convex/`.

### Folder structure

```
app/
├── layout.jsx                 # shell, nav, ConvexClientProvider
├── page.jsx
├── feature-a/
│   ├── page.jsx               # /feature-a
│   ├── loading.jsx            # instant skeleton
│   └── [itemId]/page.jsx
├── feature-b/
│   ├── page.jsx
│   └── log/page.jsx
└── feature-c/
    ├── page.jsx
    ├── loading.jsx
    └── [id]/page.jsx

convex/                        # backend functions — ALSO per feature
├── schema.js                  # one schema, tables grouped by feature
├── featureA.js                 # api.featureA.* queries/mutations
├── featureB.js                 # api.featureB.*
└── featureC.js                 # api.featureC.*

features/                      # client components/hooks per feature
├── feature-a/
├── feature-b/
└── feature-c/

shared/
└── ui/
```

Convex mirrors your feature boundaries naturally: one file (or folder) per feature in `convex/` gives you namespaced APIs like `api.featureA.list` — one feature's functions never touch another feature's tables.

### Schema grouped by feature

```js
// convex/schema.js
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // --- feature-a ---
  items: defineTable({
    userId: v.string(),
    title: v.string(),
    thumbnail: v.optional(v.string()),
  }).index('by_user', ['userId']),

  itemDetails: defineTable({
    itemId: v.id('items'),
    order: v.number(),
    text: v.string(),
  }).index('by_item', ['itemId']),

  // --- feature-b ---
  entries: defineTable({
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    updatedAt: v.number(),
  }).index('by_user_updated', ['userId', 'updatedAt']),

  // --- feature-c, ... ---
});
```

### Per-feature loading states

```jsx
// app/feature-a/loading.jsx
export default function Loading() {
  return <ItemListSkeleton count={8} />;
}
```

---

## 3. On-Demand Data (the Convex way)

Convex queries are **reactive subscriptions**: `useQuery` starts when the component mounts, updates live when data changes, and unsubscribes on unmount. That's on-demand data with real-time updates built in — no polling, no manual cache invalidation.

### Feature-scoped Convex functions

```js
// convex/featureA.js
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// List query: only light fields, only this user's items
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query('items')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .take(20);
  },
});

// Detail query: heavy data only when viewing one item
export const get = query({
  args: { id: v.id('items') },
  handler: async (ctx, { id }) => {
    const item = await ctx.db.get(id);
    if (!item) return null;
    const details = await ctx.db
      .query('itemDetails')
      .withIndex('by_item', (q) => q.eq('itemId', id))
      .collect();
    return { ...item, details };
  },
});
```

### Client component: subscribe only while mounted

```jsx
// features/feature-a/components/ItemList.jsx
'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function ItemList() {
  // Subscription starts on mount (user visits /feature-a),
  // updates in real time, stops on unmount.
  const items = useQuery(api.featureA.list);

  if (items === undefined) return <ItemListSkeleton />; // loading
  if (items.length === 0) return <EmptyState />;

  return (
    <ul>
      {items.map((item) => (
        <li key={item._id}>{item.title}</li>
      ))}
    </ul>
  );
}
```

Key point for the multi-feature question: **a user on `/feature-a` holds exactly one subscription — `api.featureA.list`.** Other features' queries don't exist for them. When they navigate away, even that one closes.

### Detail page subscribes to its own data

```jsx
// features/feature-a/components/ItemDetail.jsx
'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function ItemDetail({ id }) {
  const item = useQuery(api.featureA.get, { id });

  if (item === undefined) return <DetailSkeleton />;
  if (item === null) return <NotFound />;

  return (
    <article>
      <h1>{item.title}</h1>
      <Details details={item.details} />
    </article>
  );
}
```

### Avoiding the loading flash: preload on the server

Plain `useQuery` means a skeleton on first paint. For key pages, preload in a Server Component and hand off to the client — you get server-rendered content *and* live reactivity after hydration:

```jsx
// app/feature-a/page.jsx  (Server Component)
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import ItemList from '@/features/feature-a/components/ItemList';

export default async function FeatureAPage() {
  const preloaded = await preloadQuery(api.featureA.list);
  return <ItemList preloaded={preloaded} />;
}
```

```jsx
// features/feature-a/components/ItemList.jsx
'use client';
import { usePreloadedQuery } from 'convex/react';

export default function ItemList({ preloaded }) {
  // Server-rendered data on first paint, live updates after
  const items = usePreloadedQuery(preloaded);
  return /* ... */;
}
```

### Pagination for big lists

```js
// convex/featureB.js
import { paginationOptsValidator } from 'convex/server';

export const feed = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const identity = await ctx.auth.getUserIdentity();
    return ctx.db
      .query('entries')
      .withIndex('by_user_updated', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .paginate(paginationOpts);
  },
});
```

```jsx
// features/feature-b/components/EntriesFeed.jsx
'use client';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function EntriesFeed() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.featureB.feed,
    {},
    { initialNumItems: 20 }
  );
  // A user with thousands of entries loads 20 — and those 20 stay live-updating.

  return (
    <>
      {results.map((entry) => <EntryCard key={entry._id} entry={entry} />)}
      {status === 'CanLoadMore' && (
        <button onClick={() => loadMore(20)}>Load more</button>
      )}
    </>
  );
}
```

### What you get for free vs. React Query

| Concern | React Query | Convex |
|---------|-------------|--------|
| Fetch on mount only | ✅ manual setup | ✅ default behavior |
| Live updates (real-time data) | polling / websockets you build | ✅ automatic, every query |
| Cache invalidation after mutations | manual `invalidateQueries` | ✅ automatic |
| Unsubscribe on route leave | ✅ | ✅ |

For any feature with fast-changing shared data (live scores, presence, shared docs), this is a big deal — updates just work with a plain `useQuery`, no `refetchInterval`.

---

## How the pieces combine

A user opening your app and going to `feature-a`:

| Step | What downloads / runs |
|------|----------------------|
| Open app | Root layout + home chunk; zero feature subscriptions |
| `/feature-a` link in viewport | feature-a JS chunk prefetched |
| Tap "Feature A" | Server preloads `api.featureA.list` → page renders with data → live subscription takes over |
| Tap an item | One `api.featureA.get` subscription for that item |
| Navigate away | feature-a subscriptions close automatically |
| Never opens feature-b | feature-b code, queries, subscriptions: **zero** |

---

## Quick checklist

- [ ] One folder per feature in `app/`, one file/folder per feature in `convex/`
- [ ] Schema tables grouped and indexed per feature; queries always use indexes
- [ ] List queries return light fields with `.take()`; detail queries carry the heavy data
- [ ] `usePaginatedQuery` for anything that grows (feeds, logs, history)
- [ ] `preloadQuery` + `usePreloadedQuery` on key pages to avoid loading flashes
- [ ] `next/dynamic` for heavy in-page components (charts, editors)
- [ ] `loading.jsx` per feature for instant skeletons
- [ ] No cross-feature imports; one feature's functions never read another feature's tables
