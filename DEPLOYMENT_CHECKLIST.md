# 🚀 Rafion AI Dashboard - Deployment & Operations Checklist

## Phase 1: Pre-Launch Setup (Week 1)

### ✅ Infrastructure Setup
- [ ] Create Supabase project (or connect existing)
- [ ] Note project URL: `https://YOUR-PROJECT.supabase.co`
- [ ] Generate API keys:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public, safe for frontend)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (SECRET - server only)
- [ ] Store secrets in:
  - [ ] Local: `.env.local` (never commit)
  - [ ] Staging: GitHub Secrets or deployment platform
  - [ ] Production: Managed secrets service (AWS Secrets Manager, etc.)

### ✅ Database Initialization
- [ ] Execute `lib/database.sql` in Supabase SQL Editor
- [ ] Verify tables created:
  ```sql
  \dt pending_drafts
  \dt audit_log
  ```
- [ ] Verify RLS enabled:
  ```sql
  SELECT schemaname, tablename, rowsecurity 
  FROM pg_tables 
  WHERE tablename IN ('pending_drafts', 'audit_log');
  -- Should show: rowsecurity = true
  ```
- [ ] Test RLS policies with sample data:
  ```sql
  INSERT INTO pending_drafts (...) VALUES (...);
  ```

### ✅ User & Firm Setup
- [ ] Create test users in Supabase Auth (at least 2 from different firms)
- [ ] Set firm_id in user metadata:
  ```sql
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    raw_user_meta_data, 
    '{firm_id}', 
    '"firm-uuid-1"'::jsonb
  )
  WHERE email = 'user1@firm1.com';
  ```
- [ ] Create at least 3 test drafts per firm:
  ```sql
  INSERT INTO pending_drafts (...) VALUES (
    gen_random_uuid(),
    'user-uuid',
    'firm-uuid',
    'Test Deal 1',
    'acquisition',
    'Executive summary text...',
    '{"estimated_valuation": 50000000, "valuation_method": "DCF", "confidence_score": 85}'::jsonb,
    'Risk assessment text...',
    78,
    'v1.0'
  );
  ```

### ✅ Environment Variables
- [ ] Create `.env.local` (development):
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  DEMO_USER_ID=demo-user
  DEMO_FIRM_ID=demo-firm
  ```
- [ ] Create `.env.staging` for staging deployment
- [ ] Create `.env.production` for production (use managed secrets)
- [ ] ⚠️ NEVER commit `.env*` files to git

### ✅ Local Development Testing
- [ ] `npm install` - verify all dependencies
- [ ] `npm run dev` - start development server
- [ ] Navigate to `http://localhost:3000/dashboard`
- [ ] Verify dashboard loads (shows pending drafts or empty state)
- [ ] Test approve functionality:
  - [ ] Click "✓ Approve"
  - [ ] Draft disappears from list
  - [ ] Check database: `SELECT status FROM pending_drafts WHERE id = 'draft-id'` → should be 'approved'
  - [ ] Check audit log: `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 1`
- [ ] Test reject functionality:
  - [ ] Click "✕ Reject"
  - [ ] Enter rejection reason
  - [ ] Confirm rejection
  - [ ] Verify in database and audit log
- [ ] Test error states:
  - [ ] Temporarily change SUPABASE_SERVICE_ROLE_KEY to invalid value
  - [ ] Verify error message displays
  - [ ] Test retry button
- [ ] Test pagination:
  - [ ] Create 25+ test drafts
  - [ ] Verify pagination controls appear
  - [ ] Navigate through pages

---

## Phase 2: Security Hardening (Week 1-2)

### ✅ RLS Policy Review
- [ ] Review all RLS policies in `lib/database.sql`
- [ ] Test each policy:
  ```sql
  -- Login as User from Firm A
  SELECT * FROM pending_drafts; -- Should only see Firm A drafts
  
  -- Try to access Firm B's data
  SELECT * FROM pending_drafts WHERE firm_id = 'firm-b-uuid';
  -- Should return 0 rows (RLS blocks it)
  ```
- [ ] Verify immutable delete policy:
  ```sql
  DELETE FROM pending_drafts WHERE id = 'draft-id';
  -- Should fail with: "policy "Only system can delete pending_drafts" USING expression failed"
  ```
- [ ] Test audit trail is working:
  - [ ] Make a change (approve/reject draft)
  - [ ] Check: `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 1`
  - [ ] Verify change is logged with full details

### ✅ Credential Security
- [ ] Verify SERVICE_ROLE_KEY never appears in:
  - [ ] Browser console (client-side code)
  - [ ] Git history
  - [ ] Error messages sent to client
  - [ ] Frontend environment files
- [ ] Set up `.gitignore`:
  ```
  .env.local
  .env*.local
  .env.*.local
  .next/
  node_modules/
  ```
- [ ] Rotate credentials:
  - [ ] Generate new keys in Supabase
  - [ ] Update all deployment environments
  - [ ] Old keys remain usable for rollback grace period

### ✅ HTTPS & Network Security
- [ ] Verify HTTPS enforcement on production domain
- [ ] Set Supabase project URL to use HTTPS only
- [ ] Configure CORS whitelist in Supabase:
  - [ ] Allowed origins: `https://yourdomain.com`
  - [ ] NOT: `*` (too permissive)

### ✅ Input Validation
- [ ] Test with SQL injection attempts:
  ```
  In browser: firmId = "'; DROP TABLE pending_drafts; --"
  Expected: Server validates and rejects input
  ```
- [ ] Test with XSS attempts:
  ```
  In draft title: "<script>alert('xss')</script>"
  Expected: Escaped/sanitized in UI
  ```
- [ ] Test with oversized inputs:
  ```
  rejection_reason = "A".repeat(100000)
  Expected: Rejected or truncated
  ```

---

## Phase 3: Performance Testing (Week 2)

### ✅ Database Performance
- [ ] Create load test data:
  ```bash
  # Script to insert 1,000 test drafts per firm
  for i in {1..1000}; do
    INSERT INTO pending_drafts (...) VALUES (...);
  done
  ```
- [ ] Measure query performance:
  ```sql
  EXPLAIN ANALYZE
  SELECT * FROM pending_drafts
  WHERE firm_id = $1 AND status = 'pending_review'
  ORDER BY created_at DESC
  LIMIT 10;
  ```
  - [ ] Expected: Index Scan (not Seq Scan)
  - [ ] Expected time: <10ms
  - [ ] If Seq Scan: Check indexes exist
- [ ] Monitor slow queries:
  - [ ] Enable Supabase slow query log
  - [ ] Set threshold: 1 second
  - [ ] Review weekly for optimization opportunities

### ✅ Frontend Performance
- [ ] Lighthouse audit:
  - [ ] Run `npm run build`
  - [ ] Check: Performance >90, Accessibility >90
  - [ ] Fix any Critical issues
- [ ] Load testing:
  - [ ] Use tool: k6, JMeter, or Artillery
  - [ ] Simulate: 100 concurrent users viewing dashboard
  - [ ] Expected: <2s response time (p95)
  - [ ] Monitor: CPU, memory, database connections

### ✅ Pagination at Scale
- [ ] Test with 10,000+ drafts
- [ ] Measure pagination load time:
  - [ ] Page 1 (offset 0): <100ms
  - [ ] Page 500 (offset 50,000): <500ms
  - [ ] If slow: Implement cursor-based pagination

---

## Phase 4: Monitoring & Alerting (Week 2-3)

### ✅ Application Monitoring
- [ ] Set up error tracking (Sentry, LogRocket):
  - [ ] Capture client-side errors
  - [ ] Capture server-side errors
  - [ ] Set up Slack notifications for Critical errors
- [ ] Monitor API response times:
  - [ ] Average: <200ms
  - [ ] P95: <500ms
  - [ ] P99: <1s
- [ ] Track success rates:
  - [ ] Goal: >99.9% successful requests
  - [ ] Alert if <99%

### ✅ Database Monitoring
- [ ] Set up Supabase monitoring dashboard:
  - [ ] Query count per minute
  - [ ] Slow queries (>1s)
  - [ ] Connection pool usage
  - [ ] Storage usage
- [ ] Enable audit logging:
  ```sql
  SELECT * FROM audit_log
  WHERE created_at > NOW() - INTERVAL '24 hours'
  ORDER BY created_at DESC;
  ```
- [ ] Alert conditions:
  - [ ] Unusual spike in query volume (>2x average)
  - [ ] Unusual spike in storage growth
  - [ ] Connection pool near max

### ✅ Security Monitoring
- [ ] Monitor unauthorized access attempts:
  ```sql
  SELECT * FROM audit_log
  WHERE action IN ('SELECT', 'UPDATE', 'DELETE')
  AND DATE(created_at) = CURRENT_DATE;
  ```
- [ ] Alert if:
  - [ ] 100+ errors in 5 minutes
  - [ ] Repeated unauthorized access from same IP
  - [ ] Unexpected changes to RLS policies
- [ ] Weekly security review:
  - [ ] Check for suspicious patterns in audit log
  - [ ] Review database backup integrity
  - [ ] Verify no credentials exposed in logs

---

## Phase 5: Staging Deployment (Week 3)

### ✅ Staging Environment
- [ ] Create staging Supabase project (or separate database)
- [ ] Copy production schema (without sensitive data)
- [ ] Deploy to staging URL: `https://staging.yourdomain.com`
- [ ] Run full test suite:
  - [ ] Fetch drafts ✓
  - [ ] Approve draft ✓
  - [ ] Reject draft ✓
  - [ ] Pagination ✓
  - [ ] Error states ✓
- [ ] Run security tests:
  - [ ] RLS policy enforcement ✓
  - [ ] Audit logging ✓
  - [ ] No credential leaks ✓
- [ ] User acceptance testing (UAT):
  - [ ] Have 2-3 institutional users test
  - [ ] Collect feedback on UX
  - [ ] Fix any issues

### ✅ Load Testing in Staging
- [ ] Simulate peak load (100 concurrent users)
- [ ] Duration: 30 minutes
- [ ] Monitor:
  - [ ] Response times
  - [ ] Error rates
  - [ ] Database stability
- [ ] If issues:
  - [ ] Identify bottleneck
  - [ ] Optimize (add indexes, adjust query, etc.)
  - [ ] Re-test

---

## Phase 6: Production Deployment (Week 4)

### ✅ Pre-Deployment Checklist
- [ ] Staging passed all tests ✓
- [ ] Security review approved ✓
- [ ] Performance benchmarks met ✓
- [ ] All secrets configured ✓
- [ ] Database backup created ✓
- [ ] Rollback plan documented ✓
- [ ] Incident response team briefed ✓

### ✅ Deployment Steps
1. [ ] Create database backup snapshot:
   ```bash
   # In Supabase Dashboard → Settings → Backups
   # Create manual backup
   ```

2. [ ] Deploy Next.js application:
   ```bash
   # Using Vercel, Netlify, or your deployment platform
   npm run build
   git push production main
   # Wait for deployment to complete
   ```

3. [ ] Update production DNS (if needed):
   - [ ] Point `dashboard.yourdomain.com` to deployment

4. [ ] Smoke tests:
   - [ ] Can users login? ✓
   - [ ] Can fetch drafts? ✓
   - [ ] Can approve/reject? ✓
   - [ ] No errors in monitoring? ✓

5. [ ] Monitor for 24 hours:
   - [ ] Error rates stable ✓
   - [ ] Response times normal ✓
   - [ ] No security alerts ✓

### ✅ Post-Deployment
- [ ] Send communications:
  - [ ] Email: "Dashboard now live"
  - [ ] Slack: "#announcements"
  - [ ] In-app: Success message
- [ ] Document deployment:
  - [ ] Deployment time
  - [ ] Commit hash
  - [ ] Any issues encountered
- [ ] Schedule post-deployment review:
  - [ ] Date: 1 week after launch
  - [ ] Review: metrics, user feedback, issues

---

## Phase 7: Ongoing Operations (Monthly)

### ✅ Monthly Maintenance
- [ ] [ ] Database optimization:
  - [ ] Review query plans
  - [ ] Update table statistics: `ANALYZE`
  - [ ] Reindex if needed: `REINDEX TABLE pending_drafts`

- [ ] [ ] Security audit:
  - [ ] Review RLS policies
  - [ ] Check for unusual access patterns
  - [ ] Rotate credentials if needed
  - [ ] Review user permissions

- [ ] [ ] Performance review:
  - [ ] Compare metrics to baseline
  - [ ] Identify slow queries
  - [ ] Plan optimizations

- [ ] [ ] Backup verification:
  - [ ] Test restore from latest backup
  - [ ] Document restore time
  - [ ] Update disaster recovery runbook

- [ ] [ ] Update dependencies:
  - [ ] `npm outdated` - check for updates
  - [ ] `npm update` - update minor/patch versions
  - [ ] Test in staging before production
  - [ ] Schedule major upgrades

### ✅ Quarterly Review
- [ ] [ ] Architecture review:
  - [ ] Does current design meet business needs?
  - [ ] Identify bottlenecks
  - [ ] Plan scaling if needed
  - [ ] Review security practices

- [ ] [ ] Cost optimization:
  - [ ] Review Supabase usage and costs
  - [ ] Identify optimization opportunities
  - [ ] Plan capacity for next quarter

- [ ] [ ] Training:
  - [ ] Update runbooks
  - [ ] Train team on deployment process
  - [ ] Drill incident response

---

## Emergency Procedures

### 🚨 Critical Issue: Dashboard Down
```
1. Immediately:
   - Alert on-call engineer
   - Notify users in Slack
   - Start incident log

2. Assess:
   - Check deployment platform status
   - Check Supabase status
   - Check error tracking (Sentry)
   - Check database logs

3. If code issue:
   - Rollback to previous version
   - Deploy immediately
   - Notify users

4. If database issue:
   - Contact Supabase support
   - Restore from backup if needed
   - Test functionality

5. Post-mortem (within 24 hours):
   - Document root cause
   - Identify preventive measures
   - Update runbooks
```

### 🚨 Security Incident: Unauthorized Access
```
1. Immediately:
   - Revoke compromised credentials
   - Check audit log for changes
   - Take backup
   - Alert security team

2. Investigation:
   - Review audit_log table
   - Identify what was accessed
   - Check for data exfiltration
   - Review network logs

3. Remediation:
   - Restore from clean backup if needed
   - Patch vulnerability
   - Update RLS policies
   - Rotate all credentials

4. Communication:
   - Notify affected users
   - File incident report
   - Update security documentation
```

### 🚨 Database Corruption
```
1. Immediately:
   - Stop accepting writes
   - Alert team
   - Contact Supabase support

2. Recovery:
   - Restore from most recent backup
   - Validate data integrity
   - Run consistency checks

3. Investigation:
   - Identify cause
   - Implement fixes
   - Add monitoring to prevent recurrence
```

---

## Success Metrics

Track these metrics monthly:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Uptime | 99.9% | — | |
| P95 Response Time | <500ms | — | |
| Error Rate | <0.1% | — | |
| Drafts Processed | (business KPI) | — | |
| User Satisfaction | 4.5+/5 | — | |
| Security Incidents | 0 | — | |
| RLS Policy Violations | 0 | — | |

---

## Contact Information

**On-Call Engineer**: [name] ([phone])  
**Supabase Support**: support@supabase.io  
**Incident Slack Channel**: #incident-response  
**War Room**: [meeting link]

---

**Last Updated**: July 9, 2026  
**Next Review**: August 9, 2026  
**Maintained By**: Rafion AI Ops Team ✅
