# Rafion AI Dashboard - Quick Reference Guide

## 📁 File Structure at a Glance

```
rafion-site/
├── app/dashboard/page.tsx                    ← Dashboard page (entry point)
├── components/
│   ├── DashboardContent.tsx                 ← Main logic (state, fetch, pagination)
│   ├── DraftCard.tsx                        ← Individual draft UI
│   └── DashboardSkeleton.tsx                ← Loading state
├── lib/
│   ├── types.ts                             ← TypeScript definitions
│   ├── actions.ts                           ← Server actions (RLS enforced)
│   ├── supabase.ts                          ← Supabase client config
│   ├── database.sql                         ← Schema & RLS setup
│   └── AUTHENTICATION_REFERENCE.tsx         ← Auth integration patterns
├── IMPLEMENTATION_SUMMARY.md                ← Feature overview
├── ARCHITECTURE_DIAGRAM.md                  ← System design & data flow
├── DASHBOARD_SETUP.md                       ← Setup guide with troubleshooting
└── DEPLOYMENT_CHECKLIST.md                  ← Launch & ops checklist
```

## 🚀 Quick Start (5 minutes)

```bash
# 1. Set environment variables in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# 2. Initialize database (copy lib/database.sql into Supabase SQL Editor)

# 3. Set user firm_id metadata
UPDATE auth.users SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, '{firm_id}', '"firm-uuid"'::jsonb
) WHERE email = 'user@example.com';

# 4. Start dev server
npm run dev
# Visit http://localhost:3000/dashboard
```

## 🔑 Key Files & Their Purpose

| File | Purpose | When to Edit |
|------|---------|--------------|
| `app/dashboard/page.tsx` | Dashboard page wrapper | Add header, footer, or metadata |
| `components/DashboardContent.tsx` | Dashboard logic | Change loading behavior, pagination size, API calls |
| `components/DraftCard.tsx` | Draft card UI | Change draft display, add fields, modify buttons |
| `lib/actions.ts` | Server logic | Add new endpoints, change RLS checks |
| `lib/database.sql` | Database schema | Add columns, change RLS policies |
| `DASHBOARD_SETUP.md` | Setup guide | Update for specific environments |

## 💾 Database Schema Quick Reference

### pending_drafts table
```sql
id (UUID, PK)
firm_id (UUID) - Multi-tenant isolation
user_id (UUID) - Creator
status (TEXT) - 'pending_review', 'approved', 'rejected', 'archived'
deal_title (TEXT)
investment_type (TEXT)
executive_summary (TEXT)
valuation_analysis (JSONB) - {estimated_valuation, valuation_method, confidence_score}
risk_assessment (TEXT)
strategic_fit_score (SMALLINT) - 0-100
reviewer_id (UUID) - Who approved/rejected
review_timestamp (TIMESTAMPTZ)
review_notes (TEXT) - Approval/rejection notes
created_at, updated_at (TIMESTAMPTZ)
created_by_model_version (TEXT)
source_document_ids (TEXT[])
rag_context_used (JSONB) - {total_documents_queried, top_sources}
```

### audit_log table
```sql
id (UUID, PK)
firm_id, user_id (FK)
action (TEXT) - 'INSERT', 'UPDATE', 'DELETE'
table_name (TEXT)
record_id (UUID)
changes (JSONB)
created_at (TIMESTAMPTZ)
```

## 🔐 Security Checklist (Before Deployment)

- [ ] SERVICE_ROLE_KEY never visible in frontend code
- [ ] All .env files in .gitignore
- [ ] RLS policies tested (cross-firm access blocked)
- [ ] Audit logging working (changes recorded)
- [ ] HTTPS enabled on production domain
- [ ] CORS whitelisted (not `*`)
- [ ] Error messages don't leak sensitive info
- [ ] Database backups automated
- [ ] Secrets stored in secure vault (not git)

## 🔄 Common Tasks

### Add a New Field to Draft Display
1. Add field to `pending_drafts` table schema
2. Update `lib/types.ts` - PendingDraft interface
3. Update SQL query in `lib/actions.ts` - add to SELECT
4. Update `components/DraftCard.tsx` - display new field
5. Update `DASHBOARD_SETUP.md` - document change

### Change Pagination Size
```typescript
// In components/DashboardContent.tsx
const loadDrafts = async (pageNumber = 0) => {
  const result = await fetchPendingDrafts(
    userId, 
    firmId, 
    20,  // ← Change from 10 to 20
    pageNumber
  );
```

### Add a New Server Action
1. Create function in `lib/actions.ts`:
   ```typescript
   'use server';
   export async function myNewAction(param: string) {
     // Validate input
     // Create Supabase client
     // Verify authorization (check firm_id)
     // Execute query
     // Handle errors
     // Return result
   }
   ```
2. Import in component
3. Call from event handler

### Modify RLS Policies
1. Edit `lib/database.sql`
2. Drop old policy: `DROP POLICY "policy-name" ON pending_drafts;`
3. Create new policy (copy-paste template)
4. Test in SQL console
5. Document change in `DASHBOARD_SETUP.md`

## 🧪 Testing Commands

### Test Database Connection
```bash
# In browser DevTools console
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient(
  'YOUR_URL',
  'YOUR_KEY'
);
const { data, error } = await sb.from('pending_drafts').select('id').limit(1);
console.log(data, error);
```

### Test RLS Policy
```sql
-- Query from Supabase as different users
-- User should only see their firm's drafts
SELECT * FROM pending_drafts;
-- Check: Only rows with matching firm_id

-- Try cross-firm access
SELECT * FROM pending_drafts WHERE firm_id = 'other-firm-uuid';
-- Check: Returns 0 rows (RLS blocks it)
```

### Test Audit Logging
```sql
-- Approve a draft, then check audit
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 1;
-- Should show: action='UPDATE', status change in changes column
```

## 🚨 Troubleshooting Quick Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| "Missing server-side Supabase credentials" | SUPABASE_SERVICE_ROLE_KEY not set | Add to .env.local |
| Dashboard shows no drafts | firm_id not in user metadata | Run UPDATE auth.users... |
| "Unauthorized: Draft does not belong to your firm" | firm_id mismatch | Check user's firm_id metadata |
| Approve/reject button does nothing | Server error (check console) | Look in browser DevTools Network tab |
| RLS returning 0 rows | User not in auth context | Re-test with proper session |
| Performance slow | Missing indexes | Run database.sql again to create indexes |
| Pagination buttons disabled | Total < 10 drafts | Create more test drafts |

## 📊 Monitoring Queries

### Check System Health
```sql
-- Recent approvals/rejections
SELECT id, status, reviewer_id, review_timestamp, review_notes
FROM pending_drafts
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;

-- Audit trail
SELECT user_id, action, table_name, changes, created_at
FROM audit_log
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Slow queries
SELECT query, calls, mean_time
FROM pg_stat_statements
WHERE query LIKE '%pending_drafts%'
ORDER BY mean_time DESC;
```

### Track Performance
```sql
-- Drafts per firm
SELECT firm_id, COUNT(*) as draft_count, 
  COUNT(CASE WHEN status = 'pending_review' THEN 1 END) as pending
FROM pending_drafts
GROUP BY firm_id;

-- User activity
SELECT user_id, COUNT(*) as actions_taken
FROM audit_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY user_id
ORDER BY actions_taken DESC;
```

## 🎯 Next Steps After Deployment

1. **Week 1**: Monitor error rates, user feedback
2. **Week 2**: Optimize any slow queries
3. **Week 3**: Add additional features (filters, export, etc.)
4. **Week 4**: Security audit, load testing
5. **Month 2**: Scale testing, user training
6. **Month 3**: Plan feature additions based on feedback

## 📞 Support Resources

- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **React Docs**: https://react.dev

## 🎓 Key Concepts to Understand

**Row Level Security (RLS)**
- Database-level access control
- Filters rows based on user/session context
- Unbypassable by application code

**Server Actions**
- Next.js feature for secure server-side functions
- Can't be called from outside the app
- Handle business logic safely

**Multi-Tenancy**
- Data isolation by firm_id
- Every query filtered by user's firm
- Prevents cross-firm data access

**Audit Logging**
- Automatic tracking of changes
- Immutable (can't delete records)
- Enables compliance & forensics

---

**Last Updated**: July 9, 2026  
**Status**: Production Ready ✅  
**Maintained By**: Rafion AI Engineering
