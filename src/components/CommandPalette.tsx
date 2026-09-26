import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FileCode,
  FileText,
  Play,
  CheckCircle2,
  Download,
  Copy,
  Layout,
  Terminal,
  RotateCcw,
  Sparkles,
  X,
  Code,
  Globe,
  Sliders,
} from 'lucide-react';
import { CommandItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.label.toLowerCase().includes(q) ||
      (cmd.description && cmd.description.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        selected.action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0B0F19] border border-white/[0.1] rounded-xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[460px] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="h-12 border-b border-white/[0.08] px-4 flex items-center gap-3 shrink-0 bg-[#0E1422]">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
          >
            <kbd className="font-mono text-[10px] bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.1]">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-indigo-400 shrink-0 font-mono text-[13px]">
                      &gt;
                    </span>
                    <span className="font-medium truncate">{cmd.label}</span>
                    {cmd.description && (
                      <span className="text-slate-500 text-[11px] truncate hidden sm:inline">
                        — {cmd.description}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-white/[0.03]">
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="font-mono text-[10px] text-slate-400 bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="h-9 px-4 bg-[#080B12] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono select-none">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>XML Studio Command Center</span>
        </div>
      </div>
    </div>
  );
};
