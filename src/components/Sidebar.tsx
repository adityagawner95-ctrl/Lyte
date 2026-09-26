import React, { useRef, useState } from 'react';
import {
  FileCode,
  FileText,
  Globe,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Copy,
  Download,
  BookOpen,
  FolderTree,
  MoreVertical,
} from 'lucide-react';
import { StudioFile, PresetTemplate } from '../types';

interface SidebarProps {
  files: StudioFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onNewXml: () => void;
  onNewXslt: () => void;
  onImportFiles: (fileList: FileList) => void;
  onDeleteFile: (fileId: string) => void;
  onDuplicateFile: (fileId: string) => void;
  onDownloadFile: (file: StudioFile) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  presets: PresetTemplate[];
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onNewXml,
  onNewXslt,
  onImportFiles,
  onDeleteFile,
  onDuplicateFile,
  onDownloadFile,
  isCollapsed,
  onToggleCollapse,
  presets,
  activePresetId,
  onSelectPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportFiles(e.target.files);
      e.target.value = '';
    }
  };

  const getFileIcon = (type: StudioFile['type']) => {
    switch (type) {
      case 'xml':
        return <FileCode size={13} className="text-indigo-400 shrink-0" />;
      case 'xslt':
        return <FileText size={13} className="text-cyan-400 shrink-0" />;
      case 'output':
        return <Globe size={13} className="text-emerald-400 shrink-0" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  if (isCollapsed) {
    return (
      <aside className="w-12 bg-[#090D15] border-r border-white/[0.06] flex flex-col items-center py-3 gap-4 shrink-0 select-none z-10 transition-all duration-200">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-md transition-colors"
          title="Expand Project Explorer"
        >
          <ChevronRight size={16} />
        </button>

        <div className="w-5 h-px bg-white/[0.08]" />

        <div className="flex flex-col gap-2">
          {files.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelectFile(f.id)}
              className={`p-2 rounded-md transition-all relative ${
                activeFileId === f.id
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
              title={`${f.name} (${f.type.toUpperCase()})`}
            >
              {getFileIcon(f.type)}
              {f.isModified && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-md transition-colors"
            title="Import Files"
          >
            <Upload size={14} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xml,.xsl,.xslt,.html,.txt"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-[#090D15] border-r border-white/[0.06] flex flex-col shrink-0 select-none z-10">
      {/* Header */}
      <div className="h-10 px-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderTree size={13} className="text-slate-400" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
            Project
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNewXml}
            className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-white/[0.06] rounded transition-colors"
            title="New XML Document"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
            title="Import XML/XSL File"
          >
            <Upload size={13} />
          </button>
          <button
            onClick={onToggleCollapse}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors ml-0.5"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".xml,.xsl,.xslt,.html,.txt"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <div className="px-2 pb-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <span>Files</span>
          <span>{files.length}</span>
        </div>

        {files.map((file) => {
          const isActive = activeFileId === file.id;
          return (
            <div
              key={file.id}
              className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-950/40 text-white border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
              onClick={() => onSelectFile(file.id)}
            >
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(file.type)}
                <span className="font-mono text-xs truncate">{file.name}</span>
                {file.isModified && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                    title="Modified"
                  />
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline mr-1">
                  {formatFileSize(file.size)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadFile(file);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.1] rounded"
                  title="Download File"
                >
                  <Download size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateFile(file.id);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/[0.1] rounded"
                  title="Duplicate File"
                >
                  <Copy size={11} />
                </button>
                {files.length > 2 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded"
                    title="Delete File"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Templates Quick Switcher */}
      <div className="p-3 border-t border-white/[0.06] bg-[#070A10]">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
          <BookOpen size={11} />
          <span>Preset Library</span>
        </div>

        <div className="space-y-1">
          {presets.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
                title={p.description}
              >
                <span className="truncate">{p.name}</span>
                <span className="text-[10px] font-mono text-slate-500">{p.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Add Buttons Footer */}
      <div className="p-2 border-t border-white/[0.06] flex items-center gap-1.5 text-xs">
        <button
          onClick={onNewXml}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-300 transition-colors text-[11px] font-mono"
        >
          <Plus size={11} className="text-indigo-400" />
          <span>+ XML</span>
        </button>
        <button
          onClick={onNewXslt}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-300 transition-colors text-[11px] font-mono"
        >
          <Plus size={11} className="text-cyan-400" />
          <span>+ XSLT</span>
        </button>
      </div>
    </aside>
  );
};
