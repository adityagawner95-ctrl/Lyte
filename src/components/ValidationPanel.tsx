import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUpRight, X, CheckCircle2 } from 'lucide-react';
import { ValidationError } from '../types';

interface ValidationPanelProps {
  xmlErrors: ValidationError[];
  xsltErrors: ValidationError[];
  warnings: ValidationError[];
  onJumpToError: (type: 'xml' | 'xslt', line: number) => void;
  onClose?: () => void;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  xmlErrors,
  xsltErrors,
  warnings,
  onJumpToError,
  onClose,
}) => {
  const totalErrors = xmlErrors.length + xsltErrors.length;
  const totalWarnings = warnings.length;

  if (totalErrors === 0 && totalWarnings === 0) {
    return null;
  }

  return (
    <div className="bg-[#0B0F19] border-t border-rose-500/30 shadow-2xl shadow-black/80 max-h-56 overflow-y-auto select-none p-3 animate-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          {totalErrors > 0 ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              <AlertCircle size={14} className="text-rose-500 shrink-0" />
              <span className="font-mono tracking-wide uppercase">Validation Diagnostics</span>
              <span className="bg-rose-500/20 text-rose-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-rose-500/30">
                {totalErrors} Error{totalErrors > 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <AlertTriangle size={14} className="text-amber-500 shrink-0" />
              <span className="font-mono tracking-wide uppercase">Validation Notices</span>
              <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-amber-500/30">
                {totalWarnings} Warning{totalWarnings > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* XML Errors */}
        {xmlErrors.map((err, idx) => (
          <div
            key={`xml-err-${idx}`}
            className="bg-rose-950/20 border border-rose-500/25 rounded-md p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="font-mono text-[10px] font-semibold uppercase bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                XML
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">
                    Line {err.line} · Col {err.column}
                  </span>
                </div>
                <div className="text-rose-200 font-medium mt-0.5 text-xs break-words">
                  {err.message}
                </div>
                {err.sourceSnippet && (
                  <div className="font-mono text-[11px] text-slate-400 bg-black/40 px-2 py-1 rounded mt-1.5 border border-white/[0.05] truncate">
                    {err.sourceSnippet}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onJumpToError('xml', err.line)}
              className="flex items-center gap-1 self-start sm:self-center px-2.5 py-1 text-[11px] font-mono text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 rounded transition-colors shrink-0"
            >
              <span>Jump to Error</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        ))}

        {/* XSLT Errors */}
        {xsltErrors.map((err, idx) => (
          <div
            key={`xslt-err-${idx}`}
            className="bg-rose-950/20 border border-rose-500/25 rounded-md p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="font-mono text-[10px] font-semibold uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                XSLT
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">
                    Line {err.line} · Col {err.column}
                  </span>
                </div>
                <div className="text-rose-200 font-medium mt-0.5 text-xs break-words">
                  {err.message}
                </div>
                {err.sourceSnippet && (
                  <div className="font-mono text-[11px] text-slate-400 bg-black/40 px-2 py-1 rounded mt-1.5 border border-white/[0.05] truncate">
                    {err.sourceSnippet}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onJumpToError('xslt', err.line)}
              className="flex items-center gap-1 self-start sm:self-center px-2.5 py-1 text-[11px] font-mono text-cyan-300 hover:text-white bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/30 rounded transition-colors shrink-0"
            >
              <span>Jump to Error</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        ))}

        {/* Warnings */}
        {warnings.map((warn, idx) => (
          <div
            key={`warn-${idx}`}
            className="bg-amber-950/20 border border-amber-500/20 rounded-md p-2.5 flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[10px] font-semibold uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                Notice
              </span>
              <span className="text-slate-300 text-xs truncate">{warn.message}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500 shrink-0">
              Line {warn.line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
