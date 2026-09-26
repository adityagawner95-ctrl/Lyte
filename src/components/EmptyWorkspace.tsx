import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Plus, BookOpen, Upload, ArrowDown, Database, Cpu, Globe } from 'lucide-react';

interface EmptyWorkspaceProps {
  onCreateXml: () => void;
  onOpenExample: () => void;
  onImportFiles: () => void;
}

export const EmptyWorkspace: React.FC<EmptyWorkspaceProps> = ({
  onCreateXml,
  onOpenExample,
  onImportFiles,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-[#07090E]">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Brand Icon */}
        <BrandLogo size={56} className="mb-6 shadow-indigo-500/10" />

        {/* Heading & Tagline */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
          Build your transformation pipeline.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed max-w-sm">
          Create XML data, define an XSLT transformation, and see the result instantly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={onCreateXml}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-900/30 border border-indigo-400/30 transition-all active:scale-95"
          >
            <Plus size={14} />
            <span>Create XML</span>
          </button>
          <button
            onClick={onOpenExample}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg border border-white/[0.08] transition-all"
          >
            <BookOpen size={14} className="text-indigo-400" />
            <span>Open Example</span>
          </button>
          <button
            onClick={onImportFiles}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg border border-white/[0.08] transition-all"
          >
            <Upload size={14} className="text-cyan-400" />
            <span>Import Files</span>
          </button>
        </div>

        {/* Pipeline Diagram */}
        <div className="flex flex-col items-center gap-2 text-xs font-mono text-slate-500 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] w-64">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <Database size={13} />
            <span>XML DATA</span>
          </div>
          <ArrowDown size={13} className="text-slate-600" />
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Cpu size={13} />
            <span>XSLT LOGIC</span>
          </div>
          <ArrowDown size={13} className="text-slate-600" />
          <div className="flex items-center gap-2 text-purple-400 font-semibold">
            <Globe size={13} />
            <span>OUTPUT PREVIEW</span>
          </div>
        </div>

        <p className="mt-8 text-[11px] font-mono text-slate-600 tracking-wide">
          “Shape data. Transform logic. See the result.”
        </p>
      </div>
    </div>
  );
};
