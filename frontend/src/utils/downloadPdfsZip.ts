import { createStoreZip, type ZipStoreFile } from './zipStore';

export type PdfZipItem = {
  path: string;
  name: string;
};

export type ZipProgressPhase = 'fetch' | 'zip';

type DownloadPdfsAsZipOptions = {
  items: PdfZipItem[];
  zipName: string;
  signal?: AbortSignal;
  concurrency?: number;
  onProgress?: (done: number, total: number, phase: ZipProgressPhase) => void;
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function uniqueZipName(name: string, used: Set<string>): string {
  const safe = name.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'thema.pdf';
  const withExt = safe.toLowerCase().endsWith('.pdf') ? safe : `${safe}.pdf`;
  if (!used.has(withExt)) {
    used.add(withExt);
    return withExt;
  }
  const dot = withExt.lastIndexOf('.');
  const base = dot >= 0 ? withExt.slice(0, dot) : withExt;
  const ext = dot >= 0 ? withExt.slice(dot) : '';
  let i = 2;
  let candidate = `${base}-${i}${ext}`;
  while (used.has(candidate)) {
    i += 1;
    candidate = `${base}-${i}${ext}`;
  }
  used.add(candidate);
  return candidate;
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  const worker = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index], index);
    }
  };

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function downloadPdfsAsZip({
  items,
  zipName,
  signal,
  concurrency = 5,
  onProgress,
}: DownloadPdfsAsZipOptions): Promise<{ failed: string[] }> {
  if (items.length === 0) {
    throw new Error('Δεν υπάρχουν αρχεία για λήψη.');
  }

  const usedNames = new Set<string>();
  let done = 0;
  onProgress?.(0, items.length, 'fetch');

  const results = await mapPool(items, concurrency, async (item) => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    try {
      const res = await fetch(item.path, { signal });
      if (!res.ok) throw new Error(String(res.status));
      const data = new Uint8Array(await res.arrayBuffer());
      const name = uniqueZipName(item.name, usedNames);
      done += 1;
      onProgress?.(done, items.length, 'fetch');
      return { ok: true as const, file: { name, data } satisfies ZipStoreFile };
    } catch (err) {
      if (signal?.aborted) throw err;
      done += 1;
      onProgress?.(done, items.length, 'fetch');
      return { ok: false as const, name: item.name };
    }
  });

  const files = results.filter((r) => r.ok).map((r) => r.file);
  const failed = results.filter((r) => !r.ok).map((r) => r.name);

  if (files.length === 0) {
    throw new Error('Η λήψη των PDF απέτυχε.');
  }

  onProgress?.(files.length, files.length, 'zip');
  const blob = createStoreZip(files);
  triggerDownload(blob, zipName.endsWith('.zip') ? zipName : `${zipName}.zip`);
  return { failed };
}
