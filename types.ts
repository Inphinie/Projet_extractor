export interface FileNode {
  path: string;
  name: string;
  size: number;
  content?: string;
  extension: string;
  type: 'file';
}

export interface DirectoryNode {
  path: string;
  name: string;
  children: (FileNode | DirectoryNode)[];
  type: 'directory';
}

export type ProjectStructure = DirectoryNode;

export interface ProcessingStats {
  totalFiles: number;
  processedFiles: number;
  totalSize: number;
  ignoredFiles: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  ANALYZING = 'ANALYZING',
}

export interface GeminiAnalysisResult {
  summary: string;
  techStack: string[];
  suggestions: string[];
}
