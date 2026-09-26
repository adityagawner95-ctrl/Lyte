import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Copy,
  Check,
  Search,
  Maximize2,
  Minimize2,
  Code,
  X,
  ChevronDown,
  ChevronUp,
  Replace,
  FileCode,
  AlertCircle,
} from 'lucide-react';
import { ValidationError } from '../types';

interface CodeEditorProps {
  title: string;
  filename: string;
  fileType: 'xml' | 'xslt';
  value: string;
  onChange: (val: string) => void;
  onFormat: () => void;
  errors?: ValidationError[];
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onCursorChange?: (line: number, col: number) => void;
  highlightLine?: number | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  filename,
  fileType,
  value,
  onChange,
  onFormat,
  errors = [],
  isMaximized = false,
  onToggleMaximize,
  onCursorChange,
  highlightLine,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLPreElement>(null);

  const [copied, setCopied] = useState(false);
  const [currentLine, setCurrentLine] = useState(1);
  const [currentCol, setCurrentCol] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);

  // Line count
  const lines = useMemo(() => value.split('\n'), [value]);
  const lineCount = lines.length;

  // Track cursor position
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = value.substring(0, pos);
    const lineArr = textBefore.split('\n');
    const line = lineArr.length;
    const col = (lineArr[lineArr.length - 1]?.length || 0) + 1;
    setCurrentLine(line);
    setCurrentCol(col);
    if (onCursorChange) {
      onCursorChange(line, col);
    }
  };

  // Sync scrolling between textarea, line numbers, and syntax overlay
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const top = textareaRef.current.scrollTop;
    const left = textareaRef.current.scrollLeft;

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = top;
    }
    if (overlayRef.current) {
      overlayRef.current.scrollTop = top;
      overlayRef.current.scrollLeft = left;
    }
  };

  // Handle jump to line when highlightLine changes
  useEffect(() => {
    if (highlightLine && textareaRef.current) {
      const lineHeights = 21; // approximate line height in px
      const targetScroll = Math.max(0, (highlightLine - 5) * lineHeights);
      textareaRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });

      // Calculate position
      let charIdx = 0;
      for (let i = 0; i < highlightLine - 1 && i < lines.length; i++) {
        charIdx += lines[i].length + 1;
      }
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(charIdx, charIdx + (lines[highlightLine - 1]?.length || 0));
      updateCursorPosition();
    }
  }, [highlightLine]);

  // Tab key & bracket handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Shift+Tab: Unindent
        const before = value.substring(0, start);
        const lastNewLine = before.lastIndexOf('\n');
        const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
        if (value.substring(lineStart, lineStart + 2) === '  ') {
          const newVal = value.substring(0, lineStart) + value.substring(lineStart + 2);
          onChange(newVal);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, start - 2);
            textarea.selectionEnd = Math.max(lineStart, end - 2);
          }, 0);
        }
      } else {
        // Tab: Insert 2 spaces
        const newVal = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newVal);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateCursorPosition();
        }, 0);
      }
    } else if (e.key === 'Enter') {
      // Auto-indentation
      const start = textarea.selectionStart;
      const before = value.substring(0, start);
      const currentLineText = before.split('\n').pop() || '';
      const indentMatch = currentLineText.match(/^(\s+)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';

      // Check if open tag needs extra indent
      const isOpeningTag = currentLineText.trim().match(/^<[a-zA-Z0-9_\-:]+[^>/]*>$/);
      const extraIndent = isOpeningTag ? '  ' : '';

      e.preventDefault();
      const insertion = '\n' + currentIndent + extraIndent;
      const newVal = value.substring(0, start) + insertion + value.substring(textarea.selectionEnd);
      onChange(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
        updateCursorPosition();
      }, 0);
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      setShowSearch(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchCount(0);
      setCurrentMatchIdx(0);
      return;
    }
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = value.match(regex);
    setMatchCount(matches ? matches.length : 0);
  }, [searchQuery, value]);

  const findNextMatch = (direction: 'next' | 'prev' = 'next') => {
    if (!searchQuery || !textareaRef.current) return;
    const lowerVal = value.toLowerCase();
    const query = searchQuery.toLowerCase();
    const currentPos = textareaRef.current.selectionStart;

    let targetIdx = -1;
    if (direction === 'next') {
      targetIdx = lowerVal.indexOf(query, currentPos + 1);
      if (targetIdx === -1) {
        targetIdx = lowerVal.indexOf(query, 0); // wrap
      }
    } else {
      targetIdx = lowerVal.lastIndexOf(query, Math.max(0, currentPos - 1));
      if (targetIdx === -1) {
        targetIdx = lowerVal.lastIndexOf(query); // wrap
      }
    }

    if (targetIdx !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(targetIdx, targetIdx + query.length);
      updateCursorPosition();
    }
  };

  const handleReplace = () => {
    if (!searchQuery || !textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = value.substring(start, end);

    if (selected.toLowerCase() === searchQuery.toLowerCase()) {
      const newVal = value.substring(0, start) + replaceQuery + value.substring(end);
      onChange(newVal);
      setTimeout(() => {
        findNextMatch('next');
      }, 10);
    } else {
      findNextMatch('next');
    }
  };

  const handleReplaceAll = () => {
    if (!searchQuery) return;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const newVal = value.replace(regex, replaceQuery);
    onChange(newVal);
  };

  // Syntax highlighting generator
  const highlightedTokens = useMemo(() => {
    // Generate safe highlighted HTML representation of the XML
    return lines.map((line, idx) => {
      const lineNum = idx + 1;
      const isErrorLine = errors.some((err) => err.line === lineNum);
      const isCurrentLine = lineNum === currentLine;

      // Tokenize XML line with regex
      const formatted = line
        // Comments
        .replace(/(<!--[\s\S]*?-->)/g, '<span class="text-slate-500 italic">$1</span>')
        // XML declaration
        .replace(/(<\?xml[\s\S]*?\?>)/g, '<span class="text-purple-400 font-medium">$1</span>')
        // CDATA
        .replace(/(<!\[CDATA\[[\s\S]*?\]\]>)/g, '<span class="text-sky-300 font-semibold">$1</span>')
        // Attribute values: "..."
        .replace(/(="[^"]*")/g, '<span class="text-emerald-400">$1</span>')
        // Attribute names: foo=
        .replace(/([a-zA-Z0-9_\-:]+)(?==)/g, '<span class="text-amber-300">$1</span>')
        // XSL tags
        .replace(/(<\/?xsl:[a-zA-Z0-9_\-]+)/g, '<span class="text-cyan-400 font-semibold">$1</span>')
        // Standard XML tags
        .replace(/(<\/?[a-zA-Z0-9_\-]+)/g, '<span class="text-indigo-400 font-medium">$1</span>')
        // Tag closing bracket
        .replace(/(\/?>)/g, '<span class="text-slate-400 font-medium">$1</span>');

      return (
        <div
          key={idx}
          className={`h-[21px] whitespace-pre px-4 leading-[21px] ${
            isErrorLine
              ? 'bg-rose-500/10 border-l-2 border-rose-500'
              : isCurrentLine
              ? 'bg-white/[0.03]'
              : ''
          }`}
          dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }}
        />
      );
    });
  }, [lines, errors, currentLine]);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#080C14] border border-white/[0.07] rounded-lg overflow-hidden shadow-lg shadow-black/40">
      {/* Editor Header Bar */}
      <div className="h-10 bg-[#0A0F1A] border-b border-white/[0.07] px-3 flex items-center justify-between gap-2 shrink-0 select-none">
        <div className="flex items-center gap-2">
          {fileType === 'xml' ? (
            <FileCode size={13} className="text-indigo-400" />
          ) : (
            <Code size={13} className="text-cyan-400" />
          )}
          <span className="font-mono text-xs font-semibold text-slate-200 tracking-tight uppercase">
            {title}
          </span>
          <span className="font-mono text-[11px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            {filename}
          </span>
          {errors.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              <AlertCircle size={10} />
              <span>{errors.length} error{errors.length > 1 ? 's' : ''}</span>
            </span>
          )}
        </div>

        {/* Editor Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded transition-colors text-slate-400 hover:text-slate-200 ${
              showSearch ? 'bg-indigo-600/30 text-indigo-300' : 'hover:bg-white/[0.06]'
            }`}
            title="Search & Replace (Ctrl+F)"
          >
            <Search size={13} />
          </button>
          <button
            onClick={onFormat}
            className="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded text-xs font-mono transition-colors flex items-center gap-1"
            title="Format XML / Prettify Indentation"
          >
            <Code size={12} />
            <span className="hidden sm:inline">Format</span>
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
            title="Copy Code"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          {onToggleMaximize && (
            <button
              onClick={onToggleMaximize}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
              title={isMaximized ? 'Restore View' : 'Maximize Editor'}
            >
              {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* In-Editor Search & Replace Toolbar */}
      {showSearch && (
        <div className="bg-[#0C1220] border-b border-white/[0.08] p-2 flex flex-wrap items-center gap-2 text-xs select-none animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-1 bg-black/40 border border-white/[0.1] rounded px-2 py-1 flex-1 min-w-[180px]">
            <Search size={12} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  findNextMatch(e.shiftKey ? 'prev' : 'next');
                }
                if (e.key === 'Escape') {
                  setShowSearch(false);
                }
              }}
              autoFocus
              className="bg-transparent text-slate-100 text-xs focus:outline-none w-full font-mono placeholder:text-slate-600"
            />
            {searchQuery && (
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {matchCount} match{matchCount === 1 ? '' : 'es'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-black/40 border border-white/[0.1] rounded px-2 py-1 flex-1 min-w-[180px]">
            <Replace size={12} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleReplace();
                }
              }}
              className="bg-transparent text-slate-100 text-xs focus:outline-none w-full font-mono placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => findNextMatch('prev')}
              disabled={matchCount === 0}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded disabled:opacity-30"
              title="Previous Match (Shift+Enter)"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => findNextMatch('next')}
              disabled={matchCount === 0}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded disabled:opacity-30"
              title="Next Match (Enter)"
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={handleReplace}
              disabled={matchCount === 0}
              className="px-2 py-1 text-[11px] font-mono bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded disabled:opacity-30"
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={matchCount === 0}
              className="px-2 py-1 text-[11px] font-mono bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded disabled:opacity-30"
            >
              All
            </button>
            <button
              onClick={() => setShowSearch(false)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className="relative flex-1 min-h-0 flex overflow-hidden font-mono text-[13px] leading-[21px]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="w-12 bg-[#060910] border-r border-white/[0.06] py-3 text-right pr-3 select-none overflow-hidden shrink-0 text-slate-600 text-xs"
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const lineNum = i + 1;
            const isError = errors.some((e) => e.line === lineNum);
            const isCurrent = lineNum === currentLine;
            return (
              <div
                key={i}
                className={`h-[21px] leading-[21px] flex items-center justify-end gap-1 ${
                  isError
                    ? 'text-rose-400 font-bold'
                    : isCurrent
                    ? 'text-slate-300 font-medium'
                    : 'text-slate-600'
                }`}
              >
                {isError && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea + Syntax Highlight Layer Container */}
        <div className="relative flex-1 min-w-0 h-full overflow-hidden bg-[#080C14]">
          {/* Syntax Highlight Overlay (Pointer events none) */}
          <pre
            ref={overlayRef}
            aria-hidden="true"
            className="absolute inset-0 m-0 py-3 overflow-hidden pointer-events-none select-none font-mono text-[13px] leading-[21px] tab-size-2"
          >
            {highlightedTokens}
          </pre>

          {/* Interactive Textarea with transparent text */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full p-0 py-3 px-4 bg-transparent text-transparent caret-indigo-400 selection:bg-indigo-500/30 selection:text-transparent resize-none border-none outline-none font-mono text-[13px] leading-[21px] overflow-auto whitespace-pre scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent z-10"
          />
        </div>
      </div>
    </div>
  );
};
