# Rafion AI - Dashboard Implementation Guide

## 📋 Project Structure Overview

```
rafion-site/
├── lib/
│   ├── types.ts              # Domain types & interfaces
│   ├── actions.ts            # Server actions (RLS-enforced)
│   ├── supabase.ts           # Supabase client config
│   └── database.sql          # Schema & RLS policies
├── components/
│   ├── DraftCard.tsx         # Single draft UI component
│   ├── DashboardSkeleton.tsx # Loading state
│   └── DashboardContent.tsx  # Main dashboard logic
└── app/
    └── dashboard/
        └── page.tsx          # Dashboard page
```

## 🔐 Security Architecture

### Row Level Security (RLS) - Core Defense
- **Multi-tenancy enforcement**: `firm_id` column ensures data isolation
- **User authentication**: RLS policies verify `auth.uid()`
- **Immutable audit trail**: Automatic logging of all changes
- **No DELETE operations**: Maintain historical record

### Environment Variables (Never Commit!)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Demo credentials for testing
DEMO_USER_ID=demo-user-123
DEMO_FIRM_ID=demo-firm-456
```

## 🚀 Quick Start

### 1. Initialize Database
Execute all SQL from `lib/database.sql` in Supabase SQL Editor:
- Creates `pending_drafts` table
- Enables RLS policies
- Creates audit logging triggers
- Establishes indexes for performance

### 2. Configure User Metadata
Each authenticated user needs `firm_id` in their metadata:
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{firm_id}', 
  '"firm-uuid-here"'::jsonb
)
WHERE id = 'user-uuid-here';
```

### 3. Verify Installation
```bash
npm run dev
# Navigate to http://localhost:3000/dashboard
```

## 📊 Data Flow

### Fetching Pending Drafts
```
User clicks "Dashboard"
    ↓
DashboardContent component mounts
    ↓
fetchPendingDrafts() server action called
    ↓
Supabase client queries with RLS context
    ↓
Row Level Security filters rows (firm_id + status checks)
    ↓
Returns only user's firm's pending drafts
    ↓
DraftCard components render with approve/reject buttons
```

### Approving a Draft
```
User clicks "✓ Approve"
    ↓
approvePendingDraft() server action called with draftId
    ↓
Verify draft belongs to user's firm
    ↓
Update status → 'approved', set reviewer_id + timestamp
    ↓
Audit trigger automatically logs the change
    ↓
Draft removed from dashboard list (UI updates)
    ↓
New drafts load on refresh
```

## 🎯 Human-in-the-Loop Workflow

### Draft Lifecycle
1. **AI Generation** (Not shown): Backend model creates draft → stored with `status: 'pending_review'`
2. **Dashboard Review** (This implementation): Human reviews AI analysis
3. **Approval Decision**:
   - ✓ **Approve**: Status → `'approved'`, reviewer_id recorded, sent to next stage
   - ✕ **Reject**: Status → `'rejected'`, rejection reason stored for model feedback
4. **Audit Trail**: Every action logged with timestamp, user, and changes

### Transparency Features
- **Confidence Scores**: AI displays confidence (0-100%) for all valuations
- **RAG Context**: Shows how many documents were used + top sources
- **Model Version**: Tracks which AI model version created each draft
- **Review Metadata**: Reviewer name, timestamp, and notes permanently recorded

## 🛡️ Error Handling

### Client-Side Error States
1. **Loading**: DashboardSkeleton component (3 skeleton cards)
2. **Fetch Error**: Full-page error message with retry button
3. **No Drafts**: Friendly "nothing to review" state
4. **Action Error**: Inline error message below affected draft

### Server-Side Error Handling
- Try-catch blocks capture unexpected errors
- Supabase errors logged to console (server-side)
- User-friendly error messages returned (never expose internal details)
- Graceful degradation: Show partial results if possible

## 📈 Performance Optimization

### Database Indexes
```sql
CREATE INDEX idx_pending_drafts_firm_status ON public.pending_drafts(firm_id, status);
CREATE INDEX idx_pending_drafts_created_at ON public.pending_drafts(created_at DESC);
```

### Pagination
- Defaults to 10 drafts per page
- Prevents loading entire table for large firms
- Client-side pagination controls

### Loading States
- Skeleton loaders improve perceived performance
- Animations smooth transitions
- Error states recoverable without full page reload

## 🧪 Testing the Implementation

### Test 1: Fetch Drafts
```bash
# In browser DevTools
const { DashboardContent } = await import('./components/DashboardContent.tsx');
// Component will log to console
```

### Test 2: Verify RLS
```sql
-- Login as user from Firm A
SELECT * FROM pending_drafts; -- Should only see Firm A's drafts

-- Attempt to access Firm B's data
SELECT * FROM pending_drafts WHERE firm_id = 'firm-b-uuid';
-- Returns 0 rows (RLS blocks it)
```

### Test 3: Approve/Reject
1. Navigate to dashboard
2. Click "✓ Approve" on a draft
3. Verify status changed in database: `SELECT status FROM pending_drafts WHERE id = 'draft-id'`
4. Check audit log was created: `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 1`

## 🔄 Integration with Authentication

The current implementation uses placeholder credentials. To integrate with real auth:

### Using Supabase Auth
```tsx
// In app/dashboard/page.tsx (server component)
import { createServerComponentClient } from '@supabase/ssr';

export default async function DashboardPage() {
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  const userId = session.user.id;
  const firmId = session.user.user_metadata.firm_id;
  
  return <DashboardContent userId={userId} firmId={firmId} />;
}
```

## 📝 Key Design Decisions

### Why Server Actions?
- Execute database queries with RLS context
- Never expose Supabase credentials to client
- Automatic NextAuth session management

### Why JSONB for Valuation Data?
- Flexible schema for complex nested data
- Query-able: Can filter by confidence score
- Versioning: Different models can change structure

### Why Immutable Deletes?
- Regulatory compliance: Maintain permanent audit trail
- Prevents accidental data loss
- Industry standard for financial platforms

### Why Pagination?
- Scales to firms with 1000+ pending drafts
- Reduces initial load time
- Follows institutional UX patterns

## 🚨 Security Checklist

Before deploying to production:

- [ ] All environment variables configured in `.env.local`
- [ ] Supabase RLS policies reviewed and tested
- [ ] Service Role Key never exposed to frontend
- [ ] Audit logging enabled and monitored
- [ ] User firm_id metadata correctly set
- [ ] Rate limiting implemented on server actions
- [ ] CORS configured properly
- [ ] HTTPS enabled
- [ ] Regular backups scheduled
- [ ] Access logs monitored for suspicious activity

## 📞 Support & Documentation

### Useful Links
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Supabase TypeScript Docs](https://supabase.com/docs/reference/typescript/introduction)

### Troubleshooting

**Q: "Missing server-side Supabase credentials"**
- A: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`

**Q: RLS returning 0 rows**
- A: Verify user's `firm_id` is set in `auth.users.raw_user_meta_data`

**Q: "Unauthorized: Draft does not belong to your firm"**
- A: Check that draft's `firm_id` matches your user's `firm_id` metadata

**Q: Pagination buttons disabled**
- A: Total draft count is less than page size (10 items)

---

**Last Updated**: July 2026  
**Maintained By**: Rafion AI Engineering Team
