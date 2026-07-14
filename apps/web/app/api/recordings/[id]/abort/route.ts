import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recording } from "@/lib/db/schema";
import { abortMultipartUpload, objectKey } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

/** Cancel an in-progress upload. By default the row is removed; cloud uploads
 * can request a failed row so the dashboard still reflects what happened. */
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [row] = await db
    .select()
    .from(recording)
    .where(and(eq(recording.id, id), eq(recording.userId, session.user.id)));
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  if (typeof body.uploadId === "string") {
    await abortMultipartUpload(objectKey(id, row.mimeType), body.uploadId).catch(
      () => {},
    );
  }
  if (body.markFailed === true) {
    await db
      .update(recording)
      .set({
        status: "failed",
        sizeBytes: typeof body.sizeBytes === "number" ? body.sizeBytes : null,
        durationSec:
          typeof body.durationSec === "number" ? body.durationSec : null,
      })
      .where(eq(recording.id, id));
    return NextResponse.json({ ok: true });
  }
  await db.delete(recording).where(eq(recording.id, id));

  return NextResponse.json({ ok: true });
}
