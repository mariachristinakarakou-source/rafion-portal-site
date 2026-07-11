import { NextResponse } from 'next/server';
import { fetchPendingDrafts } from '@/lib/actions';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') ?? undefined;
    const status = url.searchParams.get('status') ?? undefined;
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const pageSize = Number(url.searchParams.get('pageSize') ?? '20');
  const pageNumber = Math.max(0, page - 1);

  const result = await fetchPendingDrafts(undefined, undefined, pageSize, pageNumber, search, status);
    
    // Εδώ είναι η διόρθωση:
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data ?? [], count: result.count ?? 0 });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
