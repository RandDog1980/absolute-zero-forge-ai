import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const portableDir = path.join(rootDir, "portable-build");
const appDir = path.join(portableDir, "app");
const zipPath = path.join(rootDir, "portable-build.zip");

if (!existsSync(distDir)) {
  console.error("Missing dist/ folder. Run `npm run build` before creating a portable package.");
  process.exit(1);
}

if (existsSync(portableDir)) {
  rmSync(portableDir, { recursive: true, force: true });
}

if (existsSync(zipPath)) {
  rmSync(zipPath, { force: true });
}

mkdirSync(appDir, { recursive: true });
cpSync(distDir, appDir, { recursive: true });

const windowsLauncher = `@echo off\r\nsetlocal\r\nset PORT=%1\r\nif "%PORT%"=="" set PORT=4173\r\ncd /d "%~dp0app"\r\npy -m http.server %PORT%\r\n`;

const unixLauncher = `#!/usr/bin/env bash\nset -euo pipefail\nPORT="\${1:-4173}"\ncd "$(dirname "$0")/app"\npython3 -m http.server "$PORT"\n`;

const readme = `# Portable build\n\nThis folder contains a self-contained static build of the app.\n\n## Windows\n1. Double-click \`start-windows.bat\`\n2. Open http://localhost:4173\n\n## macOS / Linux\n1. Run \`chmod +x start-unix.sh\` (first run only)\n2. Run \`./start-unix.sh\`\n3. Open http://localhost:4173\n`;

writeFileSync(path.join(portableDir, "start-windows.bat"), windowsLauncher, "utf8");
writeFileSync(path.join(portableDir, "start-unix.sh"), unixLauncher, { encoding: "utf8", mode: 0o755 });
writeFileSync(path.join(portableDir, "README.txt"), readme, "utf8");

const zipResult = tryCreateZip(rootDir, zipPath, portableDir);

console.log(`Portable package created at ${portableDir}`);
if (zipResult) {
  console.log(`Zip package created at ${zipPath}`);
} else {
  console.warn("Could not create portable-build.zip automatically. You can zip the portable-build folder manually.");
}

function tryCreateZip(cwd, targetZipPath, sourceDirPath) {
  const sourceDirName = path.basename(sourceDirPath);
  const targetZipName = path.basename(targetZipPath);

  const zipBinary = spawnSync("zip", ["-r", "-q", targetZipName, sourceDirName], { cwd });
  if (zipBinary.status === 0) {
    return true;
  }

  const pythonBinary = spawnSync("python3", ["-m", "zipfile", "-c", targetZipName, sourceDirName], { cwd });
  if (pythonBinary.status === 0) {
    return true;
  }

  const pyBinary = spawnSync("py", ["-m", "zipfile", "-c", targetZipName, sourceDirName], { cwd });
  return pyBinary.status === 0;
}
