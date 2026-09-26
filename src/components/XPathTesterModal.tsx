import React, { useState, useEffect } from 'react';
import { Terminal, Search, X, Check, Copy, AlertCircle, ArrowRight } from 'lucide-react';
import { evaluateXPath } from '../services/xmlXsltService';
import { XPathResultItem } from '../types';

interface XPathTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  xmlContent: string;
}

export const XPathTesterModal: React.FC<XPathTesterModalProps> = ({
  isOpen,
  onClose,
  xmlContent,
}) => {
  const [query, setQuery] = useState('//product');
  const [results, setResults] = useState<XPathResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const sampleQueries = [
    '//product',
    '//product[price > 100]',
    '/catalog/product/@id',
    'count(//product)',
    '//item',
    '//title',
  ];

  const handleEvaluate = () => {
    const res = evaluateXPath(xmlContent, query);
    if (res.error) {
      setError(res.error);
      setResults([]);
    } else {
      setError(null);
      setResults(res.results);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleEvaluate();
    }
  }, [isOpen, query, xmlContent]);

  if (!isOpen) return null;

  const handleCopy = (val: string, idx: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0B0F19] border border-white/[0.1] rounded-xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 border-b border-white/[0.08] px-4 flex items-center justify-between bg-[#0E1422]">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-semibold text-sm text-slate-100">XPath Query Inspector</span>
            <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              Live XPath 1.0
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-b border-white/[0.08] bg-[#090D16] space-y-3">
          <div className="flex items-center gap-2 bg-black/50 border border-white/[0.12] rounded-lg px-3 py-2">
            <span className="font-mono text-cyan-400 font-bold text-xs select-none">$</span>
            <input
              type="text"
              placeholder="e.g. //product or /catalog/product[@id='001']"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEvaluate()}
              className="flex-1 bg-transparent text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleEvaluate}
              className="px-2.5 py-1 text-xs font-semibold bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded transition-colors"
            >
              Evaluate
            </button>
          </div>

          {/* Quick Preset Queries */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-500 text-[10px] mr-1">Quick:</span>
            {sampleQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-cyan-300 border border-white/[0.06] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {error ? (
            <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 font-mono">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-200">XPath Evaluation Error</div>
                <div className="mt-1">{error}</div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-mono">
              No matching nodes or values for this XPath expression.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1">
                <span>Matched Results: {results.length}</span>
                <span>Type: {results[0]?.type.toUpperCase()}</span>
              </div>

              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 border border-white/[0.07] rounded-lg p-3 text-xs font-mono group hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-cyan-400 font-bold">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{item.path}</span>
                      <button
                        onClick={() => handleCopy(item.rawXml || item.value, idx)}
                        className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                        title="Copy Node/Value"
                      >
                        {copiedIdx === idx ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-slate-300 bg-[#070A10] p-2 rounded border border-white/[0.04] text-[11px] whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                    {item.rawXml || item.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-10 px-4 bg-[#080B12] border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Evaluated in browser using native DOM XPath Evaluator</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
