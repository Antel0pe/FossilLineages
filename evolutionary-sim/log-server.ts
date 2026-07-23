/**
 * Tiny static + log-writing server for the eye-evolution sandbox.
 *
 *   bun run sim
 *
 * Serves everything in evolutionary-sim/ and accepts POST /log, which writes
 * files into evolutionary-sim/logs/ (gitignored). The sandbox page falls back
 * to a plain browser download if this server isn't running, so opening the
 * HTML directly over file:// still works — you just have to move the files.
 */
import { mkdir } from "node:fs/promises";
import { join, basename, resolve } from "node:path";

const ROOT = import.meta.dir;
const LOGS = join(ROOT, "logs");
const PORT = Number(process.env.PORT ?? 8787);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    if (url.pathname === "/log" && req.method === "POST") {
      const body = (await req.json()) as { files?: { name: string; content: string }[] };
      await mkdir(LOGS, { recursive: true });
      const written: string[] = [];
      for (const f of body.files ?? []) {
        const name = basename(String(f.name ?? ""));
        if (!/^[\w.\-]+$/.test(name)) continue; // no traversal, no surprises
        await Bun.write(join(LOGS, name), String(f.content ?? ""));
        written.push(name);
      }
      console.log(`wrote ${written.length} file(s) -> logs/${written.join(", ")}`);
      return Response.json({ ok: true, dir: LOGS, written }, { headers: CORS });
    }

    // static: serve the sim folder
    let p = decodeURIComponent(url.pathname);
    if (p === "/") p = "/eye-evolution-sandbox.html";
    const target = resolve(join(ROOT, p.replace(/^\/+/, "")));
    if (!target.startsWith(resolve(ROOT))) return new Response("nope", { status: 403 });
    const file = Bun.file(target);
    if (await file.exists()) return new Response(file, { headers: CORS });
    return new Response("not found", { status: 404 });
  },
});

console.log(`eye-sim server   http://localhost:${PORT}/`);
console.log(`logs written to  ${LOGS}`);
