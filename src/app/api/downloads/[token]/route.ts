import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const PRIVATE_UPLOADS_ROOT = path.join(process.cwd(), "private-uploads");

export async function GET(
  _req: Request,
  { params }: RouteContext<"/api/downloads/[token]">,
) {
  const { token } = await params;

  const item = await prisma.orderItem.findUnique({
    where: { downloadToken: token },
    include: { order: true, beat: true, licenseOption: true },
  });

  if (!item || item.order.status !== "PAID") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (item.downloadExpires < new Date()) {
    return NextResponse.json({ error: "Download link expired" }, { status: 410 });
  }

  const filePath = path.join(PRIVATE_UPLOADS_ROOT, item.licenseOption.filePath);
  if (!filePath.startsWith(PRIVATE_UPLOADS_ROOT)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  let file: Buffer;
  try {
    file = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  const extension = path.extname(filePath) || "";
  const filename = `${item.beat.title} - ${item.licenseOption.name}${extension}`.replace(
    /[^a-z0-9.\- ]/gi,
    "",
  );

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
