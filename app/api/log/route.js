import { access, appendFile, mkdir } from "fs/promises";
import os from "os";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const csvEscape = (value) => {
  const text = String(value ?? "");
  return '"' + text.replace(/"/g, '""') + '"';
};

const ensureCsvHeader = async (csvPath) => {
  try {
    await access(csvPath);
  } catch {
    await appendFile(csvPath, "timestamp,name,rollNo,action,pdfFileName,userAgent,ip\n", "utf8");
  }
};

const getClientIp = (request) => {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
};

const writeLogFiles = async ({ entry, csvRow }) => {
  const preferredDir = path.join(process.cwd(), "logs");
  const fallbackDir = path.join(os.tmpdir(), "noway-title-page-logs");
  const errors = [];

  for (const logsDir of [preferredDir, fallbackDir]) {
    try {
      await mkdir(logsDir, { recursive: true });
      const csvPath = path.join(logsDir, "pdf-edit-logs.csv");
      const jsonlPath = path.join(logsDir, "pdf-edit-logs.jsonl");
      await ensureCsvHeader(csvPath);
      await appendFile(csvPath, csvRow + "\n", "utf8");
      await appendFile(jsonlPath, JSON.stringify(entry) + "\n", "utf8");
      return { logsDir, csvPath, jsonlPath };
    } catch (error) {
      errors.push(logsDir + ": " + error.message);
    }
  }

  throw new Error(errors.join(" | "));
};

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const rollNo = String(body.rollNo ?? "").trim();
    const action = String(body.action ?? "PDF generated from app").trim();
    const pdfFileName = String(body.pdfFileName ?? "").trim();

    if (!name || !rollNo) {
      return Response.json({ ok: false, message: "Name aur Roll Number required hain." }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const userAgent = request.headers.get("user-agent") || "";
    const ip = getClientIp(request);
    const entry = { timestamp, name, rollNo, action, pdfFileName, userAgent, ip };
    const csvRow = [timestamp, name, rollNo, action, pdfFileName, userAgent, ip].map(csvEscape).join(",");
    const result = await writeLogFiles({ entry, csvRow });

    return Response.json({
      ok: true,
      message: "Log saved",
      logDir: result.logsDir,
      csvPath: result.csvPath,
      jsonlPath: result.jsonlPath,
      entry,
    });
  } catch (error) {
    console.error("Log save error:", error);
    return Response.json({ ok: false, message: "Log save karne me masla aaya: " + error.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "Log API theek chal rahi hai. PDF generate karne par logs/pdf-edit-logs.csv aur logs/pdf-edit-logs.jsonl update honge.",
  });
}
