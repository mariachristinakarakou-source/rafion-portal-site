/**
 * REFERENCE GUIDE: Authentication Integration Patterns
 * 
 * This file shows example patterns for integrating the Dashboard
 * with Supabase authentication. Not meant to be executed directly.
 * Copy patterns to your own files.
 */

// ============================================================================
// PATTERN 1: Server Component with Session Check
// ============================================================================
/*
// File: app/dashboard/page-with-auth.tsx

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPageWithAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session) {
    redirect('/auth/login');
  }

  const userId = session.user.id;
  const firmId = session.user.user_metadata?.firm_id;

  if (!firmId) {
    return <div>Setup Required: Contact administrator</div>;
  }

  return <DashboardContent userId={userId} firmId={firmId} />;
}
*/

// ============================================================================
// PATTERN 2: Client-Side Sign Out
// ============================================================================
/*
'use client';

import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function AuthMenu({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <button onClick={handleSignOut} className="px-4 py-2">
      Sign Out
    </button>
  );
}
*/

// ============================================================================
// PATTERN 3: Route Protection Middleware
// ============================================================================
/*
// File: middleware.ts

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Add auth check logic
    // Redirect to login if not authenticated
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
*/

// ============================================================================
// PATTERN 4: Setting User Firm ID After Signup
// ============================================================================
/*
// Server-side: After user signup via Supabase Auth

import { createClient } from '@supabase/supabase-js';

async function setupUserFirmId(userId: string, firmId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { firm_id: firmId },
  });

  if (error) {
    console.error('Error setting firm_id:', error);
    return false;
  }
  return true;
}

// Usage: After user signup
const userId = newUser.id;
const firmId = selectedFirm.id; // From onboarding
await setupUserFirmId(userId, firmId);
*/

// ============================================================================
// PRODUCTION CHECKLIST
// ============================================================================

/**
 * 1. AUTHENTICATION SETUP ✓
 *    - User signup/login with Supabase Auth
 *    - firm_id set in user metadata after signup
 *    - Session verification middleware in place
 *
 * 2. RLS POLICIES ✓
 *    - Verify all policies reference auth.jwt()->>'firm_id'
 *    - Test policies with multiple users/firms
 *    - Monitor slow queries from RLS evaluation
 *
 * 3. ENVIRONMENT VARIABLES ✓
 *    - NEXT_PUBLIC_SUPABASE_URL configured
 *    - NEXT_PUBLIC_SUPABASE_ANON_KEY configured
 *    - SUPABASE_SERVICE_ROLE_KEY configured (server-side only)
 *    - Never commit to git!
 *
 * 4. ERROR HANDLING ✓
 *    - Auth errors redirect to login
 *    - Missing firm_id shows setup page
 *    - Database errors show user-friendly messages
 *
 * 5. AUDIT & MONITORING ✓
 *    - Audit logs enabled in database
 *    - Critical actions logged
 *    - Access patterns monitored
 *
 * 6. PERFORMANCE ✓
 *    - Database indexes present
 *    - Pagination implemented
 *    - Query performance baseline established
 *
 * 7. SECURITY ✓
 *    - HTTPS enforced
 *    - CORS properly configured
 *    - Rate limiting on actions
 *    - Regular security audits scheduled
 */
