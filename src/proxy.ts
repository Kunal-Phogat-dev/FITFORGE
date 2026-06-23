import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  // In this architecture, Supabase is using localStorage for session management.
  // Next.js Middleware cannot read localStorage, so enforcing a cookie check here breaks the login loop.
  // Route protection is securely handled client-side via <AuthGuard>.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
