import React from 'react';
import { GeminiAnalysisResult } from '../types';
import { BrainCircuit, Layers, Lightbulb } from 'lucide-react';

interface AnalysisPanelProps {
  result: GeminiAnalysisResult | null;
  loading: boolean;
  onAnalyze: () => void;
  disabled: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ result, loading, onAnalyze, disabled }) => {
  return (
    <div className="flex flex-col gap-6 bg-slate-900/80 p-6 rounded-xl border border-purple-500/30 shadow-2xl backdrop-blur-md">
      <div className="flex justify-between items-center border-b border-purple-500/20 pb-4">
        <h2 className="text-2xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Symbion AI Architect
        </h2>
        <button
          onClick={onAnalyze}
          disabled={disabled || loading}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-mono font-bold transition-all ${
            disabled
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : loading
              ? 'bg-purple-600/50 text-purple-200 cursor-wait animate-pulse'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
          }`}
        >
          <BrainCircuit className="w-5 h-5" />
          {loading ? 'ANALYZING...' : 'INITIATE ANALYSIS'}
        </button>
      </div>

      {!result && !loading && (
        <div className="text-center py-10 text-slate-500 font-mono">
          <p>Awaiting Neural Link...</p>
          <p className="text-sm mt-2">Upload a project and click "Initiate Analysis" to activate Symbion AI.</p>
        </div>
      )}

      {loading && !result && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-cyan-400 border-b-purple-500 border-l-cyan-400 rounded-full animate-spin"></div>
            <p className="font-mono text-cyan-400 animate-pulse">Scanning Neural Pathways...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Summary */}
          <div className="bg-slate-950/50 p-4 rounded-lg border-l-4 border-cyan-500">
            <h3 className="text-cyan-400 font-bold mb-2 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4" /> EXECUTIVE SUMMARY
            </h3>
            <p className="text-slate-300 leading-relaxed font-light">{result.summary}</p>
          </div>

          {/* Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <h3 className="text-purple-400 font-bold mb-3 font-mono">DETECTED TECHNOLOGIES</h3>
              <div className="flex flex-wrap gap-2">
                {result.techStack.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-900/30 text-purple-200 text-xs font-mono border border-purple-500/30 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <h3 className="text-green-400 font-bold mb-3 font-mono flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> OPTIMIZATION PROTOCOLS
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-2 text-slate-300 text-sm">
                    <span className="text-green-500 font-mono">[{i + 1}]</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
