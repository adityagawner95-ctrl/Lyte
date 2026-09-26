import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  ExternalLink,
  Copy,
  Download,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Code,
  Globe,
  Maximize2,
  Minimize2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { TransformationResult } from '../types';

interface PreviewPanelProps {
  result: TransformationResult | null;
  onRefresh: () => void;
  onDownloadHtml: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  result,
  onRefresh,
  onDownloadHtml,
  isMaximized = false,
  onToggleMaximize,
}) => {
  const [viewMode, setViewMode] = useState<'rendered' | 'source'>('rendered');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [animatePulse, setAnimatePulse] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Trigger brief animation when transformation result updates
  useEffect(() => {
    if (result) {
      setAnimatePulse(true);
      const timer = setTimeout(() => setAnimatePulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [result?.timestamp]);

  const handleCopyOutput = () => {
    if (!result?.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    if (!result?.output) return;
    const blob = new Blob([result.output], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      alert('Popup was blocked by your browser. Please allow popups to view preview in a new tab.');
    }
  };

  const getViewportWidthClass = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-[375px] my-4 shadow-2xl border border-white/[0.1] rounded-xl';
      case 'tablet':
        return 'max-w-[768px] my-4 shadow-2xl border border-white/[0.1] rounded-xl';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col min-w-0 h-full bg-[#080C14] border border-white/[0.07] rounded-lg overflow-hidden shadow-lg shadow-black/40 transition-all ${
        animatePulse ? 'ring-1 ring-indigo-500/40' : ''
      }`}
    >
      {/* Browser Chrome Header */}
      <div className="h-10 bg-[#0A0F1A] border-b border-white/[0.07] px-3 flex items-center justify-between gap-3 shrink-0 select-none">
        {/* Browser Traffic Lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="font-mono text-xs font-semibold text-slate-300 ml-2 tracking-tight uppercase">
            Live Preview
          </span>
        </div>

        {/* Browser Simulated URL Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-black/40 border border-white/[0.06] rounded-md px-2.5 py-0.5 text-xs text-slate-400 font-mono flex-1 max-w-sm truncate">
          <Globe size={11} className="text-indigo-400 shrink-0" />
          <span className="truncate">output.html</span>
          {result?.success && (
            <span className="text-[10px] text-emerald-400 ml-auto font-mono">
              200 OK
            </span>
          )}
        </div>

        {/* View mode toggle (Rendered vs Source) */}
        <div className="flex items-center gap-1">
          <div className="flex items-center p-0.5 bg-black/40 border border-white/[0.06] rounded-md text-xs">
            <button
              onClick={() => setViewMode('rendered')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'rendered'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe size={11} />
              <span className="hidden md:inline">Preview</span>
            </button>
            <button
              onClick={() => setViewMode('source')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'source'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code size={11} />
              <span className="hidden md:inline">Source</span>
            </button>
          </div>

          {onToggleMaximize && (
            <button
              onClick={onToggleMaximize}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
              title={isMaximized ? 'Restore View' : 'Maximize Preview'}
            >
              {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Browser Sub-Toolbar */}
      <div className="h-9 bg-[#080C14] border-b border-white/[0.06] px-3 flex items-center justify-between text-xs select-none">
        {/* Viewport size toggles (Rendered mode) */}
        <div className="flex items-center gap-1">
          {viewMode === 'rendered' && (
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setViewportSize('desktop')}
                className={`p-1 rounded transition-colors ${
                  viewportSize === 'desktop' ? 'bg-white/[0.08] text-indigo-300' : 'hover:bg-white/[0.04]'
                }`}
                title="Desktop View (100%)"
              >
                <Monitor size={13} />
              </button>
              <button
                onClick={() => setViewportSize('tablet')}
                className={`p-1 rounded transition-colors ${
                  viewportSize === 'tablet' ? 'bg-white/[0.08] text-indigo-300' : 'hover:bg-white/[0.04]'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet size={13} />
              </button>
              <button
                onClick={() => setViewportSize('mobile')}
                className={`p-1 rounded transition-colors ${
                  viewportSize === 'mobile' ? 'bg-white/[0.08] text-indigo-300' : 'hover:bg-white/[0.04]'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
            title="Refresh Output"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={handleCopyOutput}
            disabled={!result?.output}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors disabled:opacity-30"
            title="Copy Output HTML"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          <button
            onClick={onDownloadHtml}
            disabled={!result?.output}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors disabled:opacity-30"
            title="Download HTML"
          >
            <Download size={13} />
          </button>
          <button
            onClick={handleOpenExternal}
            disabled={!result?.output}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors disabled:opacity-30"
            title="Open in New Tab"
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 min-h-0 bg-[#05070C] relative flex items-center justify-center overflow-auto">
        {!result ? (
          /* Empty / Unexecuted State */
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm text-slate-400">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-3">
              <Sparkles size={20} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              Ready for Transformation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Click “Transform XML” or press <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-[11px] font-mono">⌘ + Enter</kbd> to compile your XSLT stylesheet against the XML document.
            </p>
            <button
              onClick={onRefresh}
              className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Execute Transformation</span>
            </button>
          </div>
        ) : !result.success ? (
          /* Transformation Error State */
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-3">
              <AlertTriangle size={20} className="text-rose-400" />
            </div>
            <h3 className="text-sm font-semibold text-rose-300 mb-1">
              Transformation Failed
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono bg-black/40 p-3 rounded-lg border border-white/[0.06] text-left break-all max-h-40 overflow-y-auto">
              {result.error}
            </p>
          </div>
        ) : viewMode === 'rendered' ? (
          /* Live Sandboxed Rendered Preview */
          <div className={`transition-all duration-200 flex items-center justify-center w-full h-full p-2`}>
            <div className={`h-full overflow-hidden bg-white ${getViewportWidthClass()}`}>
              <iframe
                ref={iframeRef}
                title="Transformation Preview"
                srcDoc={result.output}
                sandbox="allow-scripts allow-modals allow-same-origin"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        ) : (
          /* HTML Source View */
          <div className="w-full h-full p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#060910]">
            <pre className="whitespace-pre select-text">{result.output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
