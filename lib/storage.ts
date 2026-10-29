import { DOCUMENTS_BUCKET, SUPABASE_URL } from "@/lib/env";

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

/** Public URL of an original document in the `makadiheights-data` bucket. */
export function documentUrl(storagePath: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${DOCUMENTS_BUCKET}/${encodePath(storagePath)}`;
}

/** Same file, served with `Content-Disposition: attachment` so browsers download it. */
export function documentDownloadUrl(storagePath: string) {
  const fileName = storagePath.split("/").pop() ?? storagePath;
  return `${documentUrl(storagePath)}?download=${encodeURIComponent(fileName)}`;
}
