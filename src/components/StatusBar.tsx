import React from 'react';
import { Check, AlertCircle, AlertTriangle, Terminal, Code, Cpu } from 'lucide-react';
import { ValidationResult, TransformationResult } from '../types';

interface StatusBarProps {
  xmlValidation: ValidationResult;
  xsltValidation: ValidationResult;
  transformResult: TransformationResult | null;
  cursorLine: number;
  cursorCol: number;
  activeFileType: 'xml' | 'xslt';
  contentLength: number;
  onOpenXPathTester: () => void;
  onToggleValidationPanel?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  xmlValidation,
  xsltValidation,
  transformResult,
  cursorLine,
  cursorCol,
  activeFileType,
  contentLength,
  onOpenXPathTester,
  onToggleValidationPanel,
}) => {
  return (
    <footer className="h-7 bg-[#070A10] border-t border-white/[0.06] px-3 flex items-center justify-between text-[11px] font-mono select-none text-slate-400 shrink-0 z-20">
      {/* Left: Validation & Transformation Real-time Status */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden truncate">
        {/* XML Status */}
        <button
          onClick={onToggleValidationPanel}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          title={xmlValidation.isValid ? 'XML is well-formed' : xmlValidation.errors[0]?.message}
        >
          {xmlValidation.isValid ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Check size={12} />
              <span>XML Valid</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <AlertCircle size={12} />
              <span>XML Error ({xmlValidation.errors.length})</span>
            </span>
          )}
        </button>

        <span className="text-slate-700 hidden sm:inline">|</span>

        {/* XSLT Status */}
        <button
          onClick={onToggleValidationPanel}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          title={xsltValidation.isValid ? 'XSLT stylesheet is ready' : xsltValidation.errors[0]?.message}
        >
          {xsltValidation.isValid ? (
            <span className="flex items-center gap-1 text-cyan-400">
              <Check size={12} />
              <span>XSLT Ready</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <AlertCircle size={12} />
              <span>XSLT Error ({xsltValidation.errors.length})</span>
            </span>
          )}
        </button>

        <span className="text-slate-700 hidden md:inline">|</span>

        {/* Transform Status */}
        <div className="hidden md:flex items-center gap-1.5">
          {transformResult?.success ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check size={12} />
              <span>Transformation Successful</span>
            </span>
          ) : transformResult && !transformResult.success ? (
            <span className="text-rose-400 flex items-center gap-1">
              <AlertCircle size={12} />
              <span>Transform Failed</span>
            </span>
          ) : (
            <span className="text-slate-500">Pipeline Idle</span>
          )}
        </div>
      </div>

      {/* Center: File Encoding & Format Info */}
      <div className="hidden lg:flex items-center gap-3 text-slate-500 text-[10px]">
        <span>UTF-8</span>
        <span>•</span>
        <span className="uppercase text-slate-400 font-semibold">{activeFileType} 1.0</span>
        <span>•</span>
        <span>LF</span>
        <span>•</span>
        <span>Spaces: 2</span>
      </div>

      {/* Right: Position & Utilities */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenXPathTester}
          className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
          title="Open XPath Evaluator"
        >
          <Terminal size={11} className="text-cyan-400" />
          <span>XPath</span>
        </button>

        <span className="text-slate-700 hidden sm:inline">|</span>

        <span className="text-slate-300">
          Ln <span className="tabular-nums font-semibold">{cursorLine}</span>, Col{' '}
          <span className="tabular-nums font-semibold">{cursorCol}</span>
        </span>

        <span className="text-slate-700 hidden sm:inline">|</span>

        <span className="text-slate-500 hidden sm:inline tabular-nums">
          {contentLength.toLocaleString()} chars
        </span>
      </div>
    </footer>
  );
};
