import React from 'react';
import { BrandLogo } from './BrandLogo';
import {
  Play,
  CheckCircle2,
  Download,
  Command,
  Sun,
  Moon,
  Save,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface HeaderProps {
  currentXmlName: string;
  currentXsltName: string;
  isModified: boolean;
  isTransforming: boolean;
  theme: 'dark' | 'light';
  onTransform: () => void;
  onValidate: () => void;
  onSave: () => void;
  onResetExamples: () => void;
  onOpenExport: () => void;
  onOpenCommandPalette: () => void;
  onOpenXPathTester: () => void;
  onToggleTheme: () => void;
  activeViewTab: 'split' | 'xml' | 'xslt' | 'preview';
  setActiveViewTab: (tab: 'split' | 'xml' | 'xslt' | 'preview') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentXmlName,
  currentXsltName,
  isModified,
  isTransforming,
  theme,
  onTransform,
  onValidate,
  onSave,
  onResetExamples,
  onOpenExport,
  onOpenCommandPalette,
  onOpenXPathTester,
  onToggleTheme,
  activeViewTab,
  setActiveViewTab,
}) => {
  return (
    <header className="h-13 bg-[#090D15]/95 dark:bg-[#070A10]/95 backdrop-blur-md border-b border-white/[0.07] px-4 flex items-center justify-between gap-3 shrink-0 z-30 select-none">
      {/* Zone 1: Brand & Logo */}
      <div className="flex items-center gap-3">
        <BrandLogo size={28} />
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[14px] text-white tracking-tight flex items-center gap-1.5">
            XML Studio
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-indigo-400/80 tracking-wider font-medium">
            XML / XSLT WORKBENCH
          </span>
          <span className="hidden md:inline-block text-[10px] text-slate-500 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
            v1.0
          </span>
        </div>
      </div>

      {/* Zone 2: Contextual Document Status & View Layout Switcher */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Document breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.03] border border-white/[0.06] rounded-md px-2.5 py-1">
          <span className="text-slate-300 font-mono text-[11px]">{currentXmlName}</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-300 font-mono text-[11px]">{currentXsltName}</span>
          {isModified && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-1 animate-pulse"
              title="Unsaved changes in workspace"
            />
          )}
        </div>

        {/* Layout Tabs */}
        <div className="flex items-center p-0.5 bg-black/40 border border-white/[0.06] rounded-lg text-xs">
          <button
            onClick={() => setActiveViewTab('split')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeViewTab === 'split'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
            title="Split View (XML + XSLT + Preview)"
          >
            Split View
          </button>
          <button
            onClick={() => setActiveViewTab('xml')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeViewTab === 'xml'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            XML Only
          </button>
          <button
            onClick={() => setActiveViewTab('xslt')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeViewTab === 'xslt'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            XSLT Only
          </button>
          <button
            onClick={() => setActiveViewTab('preview')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeViewTab === 'preview'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {/* Zone 3: Primary Actions & Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* XPath Quick Tool */}
        <button
          onClick={onOpenXPathTester}
          className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-md transition-colors"
          title="Evaluate XPath expression against current XML"
        >
          <Terminal size={13} className="text-cyan-400" />
          <span>XPath Query</span>
        </button>

        {/* Validate button */}
        <button
          onClick={onValidate}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-md transition-colors"
          title="Validate XML and XSLT stylesheets"
        >
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span className="hidden sm:inline">Validate</span>
        </button>

        {/* Save button */}
        <button
          onClick={onSave}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-md transition-colors"
          title="Save files to local browser memory"
        >
          <Save size={13} className="text-slate-400" />
          <span>Save</span>
        </button>

        {/* Primary CTA: Transform XML */}
        <button
          onClick={onTransform}
          disabled={isTransforming}
          className="relative group overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 active:scale-[0.98] rounded-md transition-all shadow-md shadow-indigo-900/30 border border-indigo-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Execute XSLT transformation on XML data (Ctrl/Cmd + Enter)"
        >
          {isTransforming ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Play size={13} className="fill-white" />
          )}
          <span className="tracking-wide">
            {isTransforming ? 'Transforming...' : 'Transform XML'}
          </span>
          <span className="hidden md:inline-block font-mono text-[10px] text-indigo-200/70 ml-0.5 bg-black/20 px-1 py-0.2 rounded">
            ⌘↵
          </span>
        </button>

        {/* Export Dropdown Trigger */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-md transition-colors"
          title="Export XML, XSLT, or HTML Project"
        >
          <Download size={13} className="text-slate-400" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Reset Examples */}
        <button
          onClick={onResetExamples}
          className="hidden xl:flex items-center gap-1 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-md transition-colors"
          title="Reset to default examples"
        >
          <RotateCcw size={13} />
        </button>

        {/* Command palette button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] rounded-md transition-colors"
          title="Open Command Center (⌘K / Ctrl+K)"
        >
          <Command size={13} />
          <span className="hidden md:inline font-mono text-[10px]">K</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-md transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
};
