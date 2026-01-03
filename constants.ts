export const ALLOWED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md', '.py', '.html', '.java', '.c', '.cpp', '.h', '.rs', '.go'
]);

export const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next', '__pycache__', 'venv', 'env', 'bin', 'obj', '.idea', '.vscode'
]);

export const IGNORED_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb', 'pack_for_ai.py', '.DS_Store', 'Thumbs.db'
]);

// Maximum file size to read (1MB) to prevent browser crash
export const MAX_FILE_SIZE_BYTES = 1024 * 1024; 
