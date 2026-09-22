import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const PUBLIC_ROOT = path.join(process.cwd(), "public", "uploads");
const PRIVATE_ROOT = path.join(process.cwd(), "private-uploads");

function safeExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return /^\.[a-z0-9]{1,6}$/.test(ext) ? ext : "";
}

async function saveFile(
  file: File,
  root: string,
  subdir: string,
): Promise<string> {
  const dir = path.join(root, subdir);
  await mkdir(dir, { recursive: true });

  const filename = `${crypto.randomUUID()}${safeExtension(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `${subdir}/${filename}`;
}

/** Saves a publicly-servable file (cover art, preview audio). Returns a URL under /uploads/... */
export async function savePublicUpload(file: File, subdir: string) {
  const relativePath = await saveFile(file, PUBLIC_ROOT, subdir);
  return `/uploads/${relativePath}`;
}

/** Saves a gated file (license deliverable). Returns a path used by the download route, never served directly. */
export async function savePrivateUpload(file: File, subdir: string) {
  return saveFile(file, PRIVATE_ROOT, subdir);
}
