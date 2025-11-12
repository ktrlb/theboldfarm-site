import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { gates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDbInstance();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    const body = await request.json();
    const [updated] = await db.update(gates).set({ ...body, updated_at: new Date() }).where(eq(gates.id, parseInt(id))).returning();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update gate' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDbInstance();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    await db.delete(gates).where(eq(gates.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete gate' }, { status: 500 });
  }
}





