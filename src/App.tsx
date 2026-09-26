/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { ValidationPanel } from './components/ValidationPanel';
import { StatusBar } from './components/StatusBar';
import { CommandPalette } from './components/CommandPalette';
import { XPathTesterModal } from './components/XPathTesterModal';
import { ExportModal } from './components/ExportModal';
import { DropZoneOverlay } from './components/DropZoneOverlay';
import { EmptyWorkspace } from './components/EmptyWorkspace';
import { PRESET_TEMPLATES } from './data/presets';
import { validateXml, validateXslt, transformXmlWithXslt, formatXml } from './services/xmlXsltService';
import { StudioFile, ValidationResult, TransformationResult, CommandItem } from './types';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Active preset
  const [activePresetId, setActivePresetId] = useState<string>('product-catalog');

  // Initial files seeded from the first preset
  const [files, setFiles] = useState<StudioFile[]>(() => {
    const initialPreset = PRESET_TEMPLATES[0];
    return [
      {
        id: 'file-xml-1',
        name: 'example.xml',
        type: 'xml',
        content: initialPreset.xml,
        isModified: false,
        size: new Blob([initialPreset.xml]).size,
        lastModified: Date.now(),
      },
      {
        id: 'file-xslt-1',
        name: 'transform.xsl',
        type: 'xslt',
        content: initialPreset.xslt,
        isModified: false,
        size: new Blob([initialPreset.xslt]).size,
        lastModified: Date.now(),
      },
    ];
  });

  // Active file pointers
  const [activeXmlId, setActiveXmlId] = useState<string>('file-xml-1');
  const [activeXsltId, setActiveXsltId] = useState<string>('file-xslt-1');
  const [activeFileId, setActiveFileId] = useState<string>('file-xml-1');

  // Layout and view states
  const [activeViewTab, setActiveViewTab] = useState<'split' | 'xml' | 'xslt' | 'preview'>('split');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [maximizedEditor, setMaximizedEditor] = useState<'xml' | 'xslt' | 'preview' | null>(null);

  // Status & transformation states
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformResult, setTransformResult] = useState<TransformationResult | null>(null);
  const [xmlValidation, setXmlValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });
  const [xsltValidation, setXsltValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });
  const [showValidationPanel, setShowValidationPanel] = useState<boolean>(false);

  // Jump to error line state
  const [jumpTarget, setJumpTarget] = useState<{ type: 'xml' | 'xslt'; line: number } | null>(null);

  // Modals & Overlays
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isXPathTesterOpen, setIsXPathTesterOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Cursor tracking
  const [cursorLine, setCursorLine] = useState<number>(1);
  const [cursorCol, setCursorCol] = useState<number>(1);

  // Active files resolution
  const activeXmlFile = useMemo(() => {
    return files.find((f) => f.id === activeXmlId) || files.find((f) => f.type === 'xml') || null;
  }, [files, activeXmlId]);

  const activeXsltFile = useMemo(() => {
    return files.find((f) => f.id === activeXsltId) || files.find((f) => f.type === 'xslt') || null;
  }, [files, activeXsltId]);

  const activeDocument = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || activeXmlFile || activeXsltFile || null;
  }, [files, activeFileId, activeXmlFile, activeXsltFile]);

  // Validation function
  const runValidation = useCallback((xmlCode: string, xsltCode: string) => {
    const xmlVal = validateXml(xmlCode);
    const xsltVal = validateXslt(xsltCode);
    setXmlValidation(xmlVal);
    setXsltValidation(xsltVal);
    return { xmlVal, xsltVal };
  }, []);

  // Transformation execution function
  const executeTransformation = useCallback(() => {
    if (!activeXmlFile || !activeXsltFile) return;

    setIsTransforming(true);
    // Subtle timeout to ensure UI animation frame updates cleanly
    setTimeout(() => {
      const { xmlVal, xsltVal } = runValidation(activeXmlFile.content, activeXsltFile.content);

      if (!xmlVal.isValid || !xsltVal.isValid) {
        setShowValidationPanel(true);
      }

      const result = transformXmlWithXslt(activeXmlFile.content, activeXsltFile.content);
      setTransformResult(result);
      setIsTransforming(false);
    }, 120);
  }, [activeXmlFile, activeXsltFile, runValidation]);

  // Initial transformation run on mount
  useEffect(() => {
    if (activeXmlFile && activeXsltFile) {
      runValidation(activeXmlFile.content, activeXsltFile.content);
      executeTransformation();
    }
  }, []);

  // Update XML content handler
  const handleXmlChange = (newContent: string) => {
    if (!activeXmlFile) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeXmlFile.id
          ? {
              ...f,
              content: newContent,
              isModified: true,
              size: new Blob([newContent]).size,
              lastModified: Date.now(),
            }
          : f
      )
    );
    // Fast validation update
    const v = validateXml(newContent);
    setXmlValidation(v);
  };

  // Update XSLT content handler
  const handleXsltChange = (newContent: string) => {
    if (!activeXsltFile) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeXsltFile.id
          ? {
              ...f,
              content: newContent,
              isModified: true,
              size: new Blob([newContent]).size,
              lastModified: Date.now(),
            }
          : f
      )
    );
    // Fast validation update
    const v = validateXslt(newContent);
    setXsltValidation(v);
  };

  // Format active files
  const handleFormatXml = () => {
    if (!activeXmlFile) return;
    const formatted = formatXml(activeXmlFile.content, 2);
    handleXmlChange(formatted);
  };

  const handleFormatXslt = () => {
    if (!activeXsltFile) return;
    const formatted = formatXml(activeXsltFile.content, 2);
    handleXsltChange(formatted);
  };

  // Switch preset template
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(presetId);

    const newXmlFile: StudioFile = {
      id: `file-xml-${Date.now()}`,
      name: `${preset.id}.xml`,
      type: 'xml',
      content: preset.xml,
      isModified: false,
      size: new Blob([preset.xml]).size,
      lastModified: Date.now(),
    };

    const newXsltFile: StudioFile = {
      id: `file-xslt-${Date.now()}`,
      name: `${preset.id}.xsl`,
      type: 'xslt',
      content: preset.xslt,
      isModified: false,
      size: new Blob([preset.xslt]).size,
      lastModified: Date.now(),
    };

    setFiles([newXmlFile, newXsltFile]);
    setActiveXmlId(newXmlFile.id);
    setActiveXsltId(newXsltFile.id);
    setActiveFileId(newXmlFile.id);

    // Validate and transform immediately
    runValidation(preset.xml, preset.xslt);
    setTimeout(() => {
      const res = transformXmlWithXslt(preset.xml, preset.xslt);
      setTransformResult(res);
    }, 60);
  };

  // Create new XML
  const handleNewXml = () => {
    const count = files.filter((f) => f.type === 'xml').length + 1;
    const newContent = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item id="1">\n    <name>New Item</name>\n  </item>\n</root>`;
    const newFile: StudioFile = {
      id: `file-xml-${Date.now()}`,
      name: `document_${count}.xml`,
      type: 'xml',
      content: newContent,
      isModified: false,
      size: new Blob([newContent]).size,
      lastModified: Date.now(),
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveXmlId(newFile.id);
    setActiveFileId(newFile.id);
    validateXml(newContent);
  };

  // Create new XSLT
  const handleNewXslt = () => {
    const count = files.filter((f) => f.type === 'xslt').length + 1;
    const newContent = `<?xml version="1.0" encoding="UTF-8"?>\n<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">\n  <xsl:output method="html" indent="yes" />\n\n  <xsl:template match="/">\n    <html>\n      <body>\n        <h1>Transformed Document</h1>\n      </body>\n    </html>\n  </xsl:template>\n</xsl:stylesheet>`;
    const newFile: StudioFile = {
      id: `file-xslt-${Date.now()}`,
      name: `style_${count}.xsl`,
      type: 'xslt',
      content: newContent,
      isModified: false,
      size: new Blob([newContent]).size,
      lastModified: Date.now(),
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveXsltId(newFile.id);
    setActiveFileId(newFile.id);
    validateXslt(newContent);
  };

  // Delete file
  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => {
      const remaining = prev.filter((f) => f.id !== fileId);
      if (activeXmlId === fileId) {
        const nextXml = remaining.find((f) => f.type === 'xml');
        if (nextXml) setActiveXmlId(nextXml.id);
      }
      if (activeXsltId === fileId) {
        const nextXslt = remaining.find((f) => f.type === 'xslt');
        if (nextXslt) setActiveXsltId(nextXslt.id);
      }
      if (activeFileId === fileId && remaining.length > 0) {
        setActiveFileId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Duplicate file
  const handleDuplicateFile = (fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    if (!target) return;
    const dup: StudioFile = {
      ...target,
      id: `file-${Date.now()}`,
      name: `copy_${target.name}`,
      isModified: true,
      lastModified: Date.now(),
    };
    setFiles((prev) => [...prev, dup]);
    setActiveFileId(dup.id);
    if (dup.type === 'xml') setActiveXmlId(dup.id);
    if (dup.type === 'xslt') setActiveXsltId(dup.id);
  };

  // Download single file
  const handleDownloadFile = (file: StudioFile) => {
    const mime = file.type === 'output' ? 'text/html' : 'application/xml';
    const blob = new Blob([file.content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import files from file input or drag-and-drop
  const handleImportFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) || '';
        const name = file.name;
        const isXslt = name.endsWith('.xsl') || name.endsWith('.xslt');
        const isXml = name.endsWith('.xml') || (!isXslt && !name.endsWith('.html'));

        const newFile: StudioFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name,
          type: isXslt ? 'xslt' : isXml ? 'xml' : 'output',
          content,
          isModified: false,
          size: file.size,
          lastModified: file.lastModified,
        };

        setFiles((prev) => [...prev, newFile]);

        if (isXslt) {
          setActiveXsltId(newFile.id);
          setActiveFileId(newFile.id);
          validateXslt(content);
        } else if (isXml) {
          setActiveXmlId(newFile.id);
          setActiveFileId(newFile.id);
          validateXml(content);
        }
      };
      reader.readAsText(file);
    });
  };

  // Drag and drop event listeners on window
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setIsDraggingOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleImportFiles(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘+Enter or Ctrl+Enter: Transform XML
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        executeTransformation();
      }
      // ⌘+K or Ctrl+K: Command Palette
      else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // ⌘+S or Ctrl+S: Save
      else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setFiles((prev) => prev.map((f) => ({ ...f, isModified: false })));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeTransformation]);

  // Jump to error handler
  const handleJumpToError = (type: 'xml' | 'xslt', line: number) => {
    setJumpTarget({ type, line });
    if (type === 'xml' && activeXmlFile) {
      setActiveFileId(activeXmlFile.id);
    } else if (type === 'xslt' && activeXsltFile) {
      setActiveFileId(activeXsltFile.id);
    }
  };

  // Commands list for Command Palette
  const commands: CommandItem[] = [
    {
      id: 'cmd-transform',
      label: 'Transform XML',
      description: 'Execute XSLT transformation on active XML data',
      shortcut: '⌘↵',
      category: 'Transformation',
      icon: 'Play',
      action: executeTransformation,
    },
    {
      id: 'cmd-validate-all',
      label: 'Validate Documents',
      description: 'Check XML and XSLT for syntax and schema issues',
      shortcut: '⌘⇧V',
      category: 'Transformation',
      icon: 'CheckCircle2',
      action: () => {
        if (activeXmlFile && activeXsltFile) {
          const res = runValidation(activeXmlFile.content, activeXsltFile.content);
          setShowValidationPanel(!res.xmlVal.isValid || !res.xsltVal.isValid);
        }
      },
    },
    {
      id: 'cmd-format-active',
      label: 'Format Document',
      description: 'Prettify indentation and tags in current editor',
      shortcut: '⌘⇧F',
      category: 'Document',
      icon: 'Code',
      action: () => {
        if (activeDocument?.type === 'xml') handleFormatXml();
        else if (activeDocument?.type === 'xslt') handleFormatXslt();
      },
    },
    {
      id: 'cmd-new-xml',
      label: 'New XML Document',
      description: 'Create a blank XML file in workspace',
      category: 'Document',
      icon: 'FileCode',
      action: handleNewXml,
    },
    {
      id: 'cmd-new-xslt',
      label: 'New XSLT Stylesheet',
      description: 'Create a new XSLT 1.0 transformation stylesheet',
      category: 'Document',
      icon: 'FileText',
      action: handleNewXslt,
    },
    {
      id: 'cmd-xpath-tester',
      label: 'Open XPath Query Inspector',
      description: 'Query active XML using live XPath expressions',
      category: 'Tools',
      icon: 'Terminal',
      action: () => setIsXPathTesterOpen(true),
    },
    {
      id: 'cmd-export-all',
      label: 'Export Complete Project (ZIP)',
      description: 'Download XML, XSLT, and output HTML bundled',
      category: 'Export',
      icon: 'Download',
      action: () => setIsExportModalOpen(true),
    },
    {
      id: 'cmd-toggle-sidebar',
      label: 'Toggle Project Explorer Sidebar',
      description: 'Collapse or expand the left file explorer',
      shortcut: '⌘B',
      category: 'View',
      icon: 'Layout',
      action: () => setSidebarCollapsed((prev) => !prev),
    },
    {
      id: 'cmd-reset-examples',
      label: 'Reset to Product Catalog Example',
      description: 'Restore initial product inventory example',
      category: 'Tools',
      icon: 'RotateCcw',
      action: () => handleSelectPreset('product-catalog'),
    },
  ];

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-[#07090E] text-slate-100 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Drag & Drop Full-screen Overlay */}
      <DropZoneOverlay isDragging={isDraggingOver} />

      {/* Top Application Navigation */}
      <Header
        currentXmlName={activeXmlFile?.name || 'document.xml'}
        currentXsltName={activeXsltFile?.name || 'transform.xsl'}
        isModified={files.some((f) => f.isModified)}
        isTransforming={isTransforming}
        theme={theme}
        onTransform={executeTransformation}
        onValidate={() => {
          if (activeXmlFile && activeXsltFile) {
            const res = runValidation(activeXmlFile.content, activeXsltFile.content);
            setShowValidationPanel(!res.xmlVal.isValid || !res.xsltVal.isValid);
          }
        }}
        onSave={() => setFiles((prev) => prev.map((f) => ({ ...f, isModified: false })))}
        onResetExamples={() => handleSelectPreset('product-catalog')}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenXPathTester={() => setIsXPathTesterOpen(true)}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        activeViewTab={activeViewTab}
        setActiveViewTab={setActiveViewTab}
      />

      {/* Transformation Pipeline Flow Ribbon */}
      <PipelineVisualizer
        xmlValidation={xmlValidation}
        xsltValidation={xsltValidation}
        transformResult={transformResult}
        isTransforming={isTransforming}
        onFocusXml={() => {
          if (activeXmlFile) setActiveFileId(activeXmlFile.id);
          setActiveViewTab('split');
        }}
        onFocusXslt={() => {
          if (activeXsltFile) setActiveFileId(activeXsltFile.id);
          setActiveViewTab('split');
        }}
        onFocusOutput={() => {
          setActiveViewTab('preview');
        }}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left: Collapsible Project Sidebar */}
        <Sidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={(id) => {
            setActiveFileId(id);
            const file = files.find((f) => f.id === id);
            if (file?.type === 'xml') setActiveXmlId(id);
            if (file?.type === 'xslt') setActiveXsltId(id);
          }}
          onNewXml={handleNewXml}
          onNewXslt={handleNewXslt}
          onImportFiles={handleImportFiles}
          onDeleteFile={handleDeleteFile}
          onDuplicateFile={handleDuplicateFile}
          onDownloadFile={handleDownloadFile}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          presets={PRESET_TEMPLATES}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Central Workspace: Editors & Live Preview */}
        {files.length === 0 ? (
          <EmptyWorkspace
            onCreateXml={handleNewXml}
            onOpenExample={() => handleSelectPreset('product-catalog')}
            onImportFiles={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = '.xml,.xsl,.xslt';
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files) handleImportFiles(target.files);
              };
              input.click();
            }}
          />
        ) : (
          <main className="flex-1 flex flex-col min-w-0 h-full p-2 sm:p-2.5 gap-2 bg-[#07090E] overflow-hidden">
            {/* Multi-Pane Workspace Layout */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 gap-2 overflow-hidden">
              {/* Editors Zone */}
              {(activeViewTab === 'split' || activeViewTab === 'xml' || activeViewTab === 'xslt') && (
                <div
                  className={`flex flex-col sm:flex-row min-h-0 gap-2 ${
                    activeViewTab === 'split' ? 'lg:w-[58%] xl:w-[60%]' : 'w-full'
                  }`}
                >
                  {/* XML Document Editor */}
                  {(activeViewTab === 'split' || activeViewTab === 'xml') &&
                    maximizedEditor !== 'xslt' && (
                      <CodeEditor
                        title="XML Document"
                        filename={activeXmlFile?.name || 'document.xml'}
                        fileType="xml"
                        value={activeXmlFile?.content || ''}
                        onChange={handleXmlChange}
                        onFormat={handleFormatXml}
                        errors={xmlValidation.errors}
                        isMaximized={maximizedEditor === 'xml'}
                        onToggleMaximize={() =>
                          setMaximizedEditor((prev) => (prev === 'xml' ? null : 'xml'))
                        }
                        onCursorChange={(line, col) => {
                          setCursorLine(line);
                          setCursorCol(col);
                        }}
                        highlightLine={jumpTarget?.type === 'xml' ? jumpTarget.line : null}
                      />
                    )}

                  {/* XSLT Transformation Editor */}
                  {(activeViewTab === 'split' || activeViewTab === 'xslt') &&
                    maximizedEditor !== 'xml' && (
                      <CodeEditor
                        title="XSLT Transformation"
                        filename={activeXsltFile?.name || 'transform.xsl'}
                        fileType="xslt"
                        value={activeXsltFile?.content || ''}
                        onChange={handleXsltChange}
                        onFormat={handleFormatXslt}
                        errors={xsltValidation.errors}
                        isMaximized={maximizedEditor === 'xslt'}
                        onToggleMaximize={() =>
                          setMaximizedEditor((prev) => (prev === 'xslt' ? null : 'xslt'))
                        }
                        onCursorChange={(line, col) => {
                          setCursorLine(line);
                          setCursorCol(col);
                        }}
                        highlightLine={jumpTarget?.type === 'xslt' ? jumpTarget.line : null}
                      />
                    )}
                </div>
              )}

              {/* Live Preview Zone */}
              {(activeViewTab === 'split' || activeViewTab === 'preview') &&
                maximizedEditor === null && (
                  <div
                    className={`flex-1 min-h-0 ${
                      activeViewTab === 'split' ? 'lg:w-[42%] xl:w-[40%]' : 'w-full'
                    }`}
                  >
                    <PreviewPanel
                      result={transformResult}
                      onRefresh={executeTransformation}
                      onDownloadHtml={() => {
                        if (transformResult?.output) {
                          handleDownloadFile({
                            id: 'output',
                            name: 'output.html',
                            type: 'output',
                            content: transformResult.output,
                            isModified: false,
                            size: new Blob([transformResult.output]).size,
                            lastModified: Date.now(),
                          });
                        }
                      }}
                      isMaximized={activeViewTab === 'preview'}
                      onToggleMaximize={() =>
                        setActiveViewTab((prev) => (prev === 'preview' ? 'split' : 'preview'))
                      }
                    />
                  </div>
                )}
            </div>

            {/* Inline Validation & Diagnostics Panel */}
            {showValidationPanel && (
              <ValidationPanel
                xmlErrors={xmlValidation.errors}
                xsltErrors={xsltValidation.errors}
                warnings={[...xmlValidation.warnings, ...xsltValidation.warnings]}
                onJumpToError={handleJumpToError}
                onClose={() => setShowValidationPanel(false)}
              />
            )}
          </main>
        )}
      </div>

      {/* Bottom Professional IDE Status Bar */}
      <StatusBar
        xmlValidation={xmlValidation}
        xsltValidation={xsltValidation}
        transformResult={transformResult}
        cursorLine={cursorLine}
        cursorCol={cursorCol}
        activeFileType={activeDocument?.type === 'xslt' ? 'xslt' : 'xml'}
        contentLength={activeDocument?.content.length || 0}
        onOpenXPathTester={() => setIsXPathTesterOpen(true)}
        onToggleValidationPanel={() => setShowValidationPanel((prev) => !prev)}
      />

      {/* Modals & Command Palettes */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />

      <XPathTesterModal
        isOpen={isXPathTesterOpen}
        onClose={() => setIsXPathTesterOpen(false)}
        xmlContent={activeXmlFile?.content || ''}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        xmlFileName={activeXmlFile?.name || 'document.xml'}
        xmlContent={activeXmlFile?.content || ''}
        xsltFileName={activeXsltFile?.name || 'transform.xsl'}
        xsltContent={activeXsltFile?.content || ''}
        outputHtml={transformResult?.output || ''}
      />
    </div>
  );
}
