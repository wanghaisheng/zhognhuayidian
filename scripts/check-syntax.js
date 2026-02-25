import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const tsconfigAppPath = path.join(projectRoot, 'tsconfig.app.json');
const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
const pnpmLock = path.join(projectRoot, 'pnpm-lock.yaml');
const yarnLock = path.join(projectRoot, 'yarn.lock');
const pkgLock = path.join(projectRoot, 'package-lock.json');

const runCommand = (command, args, name) => {
  return new Promise((resolve, reject) => {
    console.log(`\nStarting ${name}...`);
    console.log(`> ${command} ${args.join(' ')}`);

    const useYarn = fs.existsSync(yarnLock) && !fs.existsSync(pnpmLock);
    const usePnpm = fs.existsSync(pnpmLock);
    const bin = usePnpm ? (process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm') : useYarn ? (process.platform === 'win32' ? 'yarn.cmd' : 'yarn') : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
    const finalArgs = useYarn ? [command, ...args] : ['exec', command, '--', ...args];

    const child = spawn(bin, finalArgs, {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} passed.`);
        resolve();
      } else {
        console.error(`❌ ${name} failed with exit code ${code}.`);
        reject(new Error(`${name} failed`));
      }
    });

    child.on('error', (err) => {
      console.error(`❌ ${name} failed to start: ${err.message}`);
      reject(err);
    });
  });
};

async function main() {
  console.log('🔍 Starting Syntax and Type Check...');

  let hasError = false;
  const tsProjectArg = fs.existsSync(tsconfigAppPath) ? 'tsconfig.app.json' : (fs.existsSync(tsconfigPath) ? 'tsconfig.json' : 'tsconfig.app.json');
  await runCommand('tsc', ['-p', tsProjectArg, '--noEmit'], 'TypeScript Check').catch(() => {
    hasError = true;
  });

  await runCommand('eslint', ['.', '--max-warnings=0'], 'ESLint Check').catch(() => {
    hasError = true;
  });

  if (hasError) {
    console.error('\n💥 Syntax or lint checks failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n✨ All checks passed! No syntax or type errors found.');
    process.exit(0);
  }
}

main();
