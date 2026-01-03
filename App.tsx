import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileCode, Download, Cpu, FolderOpen, Terminal } from 'lucide-react';
import { processFiles, generatePackFile } from './utils/fileUtils';
import { analyzeProject } from './services/geminiService';
import { AppState, ProjectStructure, FileNode, ProcessingStats, GeminiAnalysisResult } from './types';
import ProjectVisualizer from './components/ProjectVisualizer';
import AnalysisPanel from './components/AnalysisPanel';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [projectStructure, setProjectStructure] = useState<ProjectStructure | null>(null);
  const [flatFiles, setFlatFiles] = useState<FileNode[]>([]);
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [analysisResult, setAnalysisResult] = useState<GeminiAnalysisResult | null>(null);
  const [packedContent, setPackedContent] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAppState(AppState.PROCESSING);
      setAnalysisResult(null);
      
      try {
        const { structure, flatFiles: processedFiles, stats: processedStats } = await processFiles(e.target.files);
        setProjectStructure(structure);
        setFlatFiles(processedFiles);
        setStats(processedStats);
        
        const packed = generatePackFile(processedFiles);
        setPackedContent(packed);
        
        setAppState(AppState.READY);
      } catch (err) {
        console.error("Processing error:", err);
        setAppState(AppState.IDLE);
        alert("An error occurred while processing the files.");
      }
    }
  };

  const triggerAnalysis = async () => {
    if (!packedContent) return;
    
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeProject(packedContent);
      setAnalysisResult(result);
    } catch (e) {
      alert("Analysis failed. Please check your API Key and try again.");
    } finally {
      setAppState(AppState.READY); // Return to ready state even after analysis
    }
  };

  const downloadPack = () => {
    const blob = new Blob([packedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SYMBIION_PROJECT_CONTEXT.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-symbion-900 text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200 pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-sans tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                SYMBIΩN
              </h1>
              <p className="text-xs text-slate-500 font-mono tracking-widest">MULTIVERSE LAB</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-slate-500">
                <Terminal className="w-3 h-3" />
                <span>v3.0.1-ALPHA</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Upload Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="p-4 bg-slate-800 rounded-full group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-cyan-500/50 shadow-lg shadow-black/50">
              <Upload className="w-8 h-8 text-cyan-400" />
            </div>
            
            <div>
              <h2 className="text-2xl font-sans font-bold text-slate-100 mb-2">Initialize Project Ingestion</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-6">Select a project directory. Symbion will map the structure, filter irrelevant data, and prepare a context matrix for AI analysis.</p>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] flex items-center gap-2"
            >
              <FolderOpen className="w-5 h-5" />
              SELECT ROOT DIRECTORY
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              // @ts-ignore - directory attributes are non-standard but supported
              webkitdirectory="" 
              directory="" 
              multiple
              onChange={handleFolderSelect}
            />
          </div>
        </div>

        {/* Dashboard Grid - Only show if processed */}
        {(appState === AppState.READY || appState === AppState.ANALYZING) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Left Col: Stats & Pack */}
            <div className="lg:col-span-1 space-y-8">
              {/* Stats Card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-sans font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" /> INGESTION METRICS
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 text-sm font-mono">Total Files Found</span>
                    <span className="text-cyan-400 font-mono font-bold">{stats?.totalFiles}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 text-sm font-mono">Processed Code</span>
                    <span className="text-green-400 font-mono font-bold">{stats?.processedFiles}</span>
                  </div>
                   <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 text-sm font-mono">Ignored/Filtered</span>
                    <span className="text-red-400 font-mono font-bold">{stats?.ignoredFiles}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 text-sm font-mono">Context Size</span>
                    <span className="text-purple-400 font-mono font-bold">{(stats!.totalSize / 1024).toFixed(2)} KB</span>
                  </div>
                </div>
              </div>

              {/* Action Card */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-xl">
                 <h3 className="text-lg font-sans font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" /> CONTEXT MATRIX
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  The project has been flattened into a single context stream suitable for LLM ingestion.
                </p>
                <button 
                  onClick={downloadPack}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-lg font-mono text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD CONTEXT.TXT
                </button>
              </div>
            </div>

            {/* Right Col: Visualization & Analysis */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Visualizer */}
              <div className="relative">
                 <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur px-3 py-1 rounded border border-slate-700 text-xs font-mono text-slate-400">
                    PROJECT_TOPOLOGY_MAP
                 </div>
                 {projectStructure && <ProjectVisualizer data={projectStructure} />}
              </div>

              {/* AI Analysis */}
              <AnalysisPanel 
                result={analysisResult} 
                loading={appState === AppState.ANALYZING} 
                onAnalyze={triggerAnalysis}
                disabled={appState === AppState.PROCESSING}
              />
            </div>

          </div>
        )}
        
        {/* Empty State / Intro - Hidden when active */}
        {appState === AppState.IDLE && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 mt-12">
              <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/30">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-cyan-400 font-bold font-mono">01</div>
                <h3 className="text-slate-200 font-bold mb-2">Upload Source</h3>
                <p className="text-sm text-slate-400">Select your project root. Symbion automatically filters node_modules, build artifacts, and lockfiles.</p>
              </div>
               <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/30">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-purple-400 font-bold font-mono">02</div>
                <h3 className="text-slate-200 font-bold mb-2">Visualize & Pack</h3>
                <p className="text-sm text-slate-400">View your project topology and generate a single "context file" optimized for LLM windows.</p>
              </div>
               <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/30">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-green-400 font-bold font-mono">03</div>
                <h3 className="text-slate-200 font-bold mb-2">AI Architect</h3>
                <p className="text-sm text-slate-400">Send the context to Gemini 3 Flash to get an instant architectural audit and tech stack summary.</p>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default App;
