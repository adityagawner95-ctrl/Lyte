import React from 'react';
import { Database, Cpu, MonitorPlay, ArrowRight, Check, AlertCircle, Clock } from 'lucide-react';
import { ValidationResult, TransformationResult } from '../types';

interface PipelineVisualizerProps {
  xmlValidation: ValidationResult;
  xsltValidation: ValidationResult;
  transformResult: TransformationResult | null;
  isTransforming: boolean;
  onFocusXml: () => void;
  onFocusXslt: () => void;
  onFocusOutput: () => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  xmlValidation,
  xsltValidation,
  transformResult,
  isTransforming,
  onFocusXml,
  onFocusXslt,
  onFocusOutput,
}) => {
  return (
    <div className="h-9 bg-[#070A10] border-b border-white/[0.06] px-4 flex items-center justify-between text-xs select-none overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold hidden md:inline">
          Pipeline
        </span>

        {/* Node 1: XML DATA */}
        <button
          onClick={onFocusXml}
          className="group flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
          title="XML Source Data"
        >
          <Database size={11} className="text-indigo-400 group-hover:text-indigo-300" />
          <span className="font-mono text-[11px] text-slate-300 font-medium">XML DATA</span>
          {xmlValidation.isValid ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="XML is valid" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="XML syntax error" />
          )}
        </button>

        {/* Subtle connector */}
        <div className="flex items-center text-slate-600">
          <ArrowRight
            size={12}
            className={`transition-colors ${
              isTransforming ? 'text-indigo-400 animate-pulse' : 'text-slate-600'
            }`}
          />
        </div>

        {/* Node 2: XSLT TRANSFORMATION */}
        <button
          onClick={onFocusXslt}
          className="group flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
          title="XSLT Transformation Logic"
        >
          <Cpu size={11} className="text-cyan-400 group-hover:text-cyan-300" />
          <span className="font-mono text-[11px] text-slate-300 font-medium">XSLT LOGIC</span>
          {xsltValidation.isValid ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="XSLT is valid" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="XSLT syntax error" />
          )}
        </button>

        {/* Subtle connector */}
        <div className="flex items-center text-slate-600">
          <ArrowRight
            size={12}
            className={`transition-colors ${
              isTransforming ? 'text-cyan-400 animate-pulse' : 'text-slate-600'
            }`}
          />
        </div>

        {/* Node 3: OUTPUT RESULT */}
        <button
          onClick={onFocusOutput}
          className="group flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
          title="Live Transformation Output"
        >
          <MonitorPlay size={11} className="text-purple-400 group-hover:text-purple-300" />
          <span className="font-mono text-[11px] text-slate-300 font-medium">OUTPUT RESULT</span>
          {transformResult?.success ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          ) : transformResult && !transformResult.success ? (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          )}
        </button>
      </div>

      {/* Right side status indicator */}
      <div className="flex items-center gap-3 text-[11px] font-mono shrink-0 pl-3">
        {isTransforming ? (
          <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Transforming...</span>
          </div>
        ) : transformResult?.success ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400">
              <Check size={12} />
              <span>Transformed</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={11} />
              <span>{transformResult.durationMs}ms</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 uppercase font-mono">{transformResult.outputType}</span>
          </div>
        ) : transformResult && !transformResult.success ? (
          <div className="flex items-center gap-1.5 text-rose-400">
            <AlertCircle size={12} />
            <span>Transform Error</span>
          </div>
        ) : (
          <span className="text-slate-500 font-normal">Ready to transform</span>
        )}
      </div>
    </div>
  );
};
