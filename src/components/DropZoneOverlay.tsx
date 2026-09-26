import React from 'react';
import { UploadCloud, FileCode, FileText } from 'lucide-react';

interface DropZoneOverlayProps {
  isDragging: boolean;
}

export const DropZoneOverlay: React.FC<DropZoneOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-indigo-950/80 backdrop-blur-md border-4 border-dashed border-indigo-400/80 flex items-center justify-center p-8 animate-in fade-in duration-150">
      <div className="bg-[#0B0F19] border border-indigo-400/40 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-4 text-indigo-400 animate-bounce">
          <UploadCloud size={32} />
        </div>

        <h2 className="text-lg font-bold text-white mb-1 tracking-tight">
          Drop XML or XSL files here
        </h2>

        <p className="text-xs text-indigo-200/80 mb-4 font-mono">
          Supports .xml, .xsl and .xslt
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <FileCode size={14} className="text-indigo-400" />
            <span>.xml documents</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-cyan-400" />
            <span>.xsl stylesheets</span>
          </div>
        </div>
      </div>
    </div>
  );
};
