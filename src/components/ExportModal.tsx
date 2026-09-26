import React, { useState } from 'react';
import { Download, FileCode, FileText, Globe, Archive, X, Check } from 'lucide-react';
import JSZip from 'jszip';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  xmlFileName: string;
  xmlContent: string;
  xsltFileName: string;
  xsltContent: string;
  outputHtml: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  xmlFileName,
  xmlContent,
  xsltFileName,
  xsltContent,
  outputHtml,
}) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadTextFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  const handleDownloadProjectZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();
      const folder = zip.folder('xml-studio-project');

      folder?.file(xmlFileName || 'data.xml', xmlContent);
      folder?.file(xsltFileName || 'transform.xsl', xsltContent);
      folder?.file('output.html', outputHtml || '<!-- No output generated yet -->');
      folder?.file(
        'README.md',
        `# XML Studio Project Export\n\nGenerated with XML Studio.\n\n- XML Source: ${xmlFileName}\n- XSLT Stylesheet: ${xsltFileName}\n- Rendered Output: output.html\n`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'xml-studio-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess('xml-studio-project.zip');
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (err) {
      console.error('Failed to export ZIP:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0B0F19] border border-white/[0.1] rounded-xl shadow-2xl shadow-black overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 border-b border-white/[0.08] px-4 flex items-center justify-between bg-[#0E1422]">
          <div className="flex items-center gap-2">
            <Download size={16} className="text-indigo-400" />
            <span className="font-semibold text-sm text-slate-100">Export Artifacts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 space-y-2.5">
          {downloadSuccess && (
            <div className="mb-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-mono">
              <Check size={14} className="text-emerald-400" />
              <span>Successfully downloaded {downloadSuccess}!</span>
            </div>
          )}

          {/* Download XML */}
          <button
            onClick={() => downloadTextFile(xmlFileName || 'data.xml', xmlContent, 'application/xml;charset=utf-8')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-black/40 hover:bg-white/[0.04] border border-white/[0.07] hover:border-indigo-500/30 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <FileCode size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  XML Document
                </div>
                <div className="text-[11px] font-mono text-slate-500">{xmlFileName}</div>
              </div>
            </div>
            <Download size={14} className="text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {/* Download XSLT */}
          <button
            onClick={() => downloadTextFile(xsltFileName || 'transform.xsl', xsltContent, 'application/xml;charset=utf-8')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-black/40 hover:bg-white/[0.04] border border-white/[0.07] hover:border-cyan-500/30 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                <FileText size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  XSLT Stylesheet
                </div>
                <div className="text-[11px] font-mono text-slate-500">{xsltFileName}</div>
              </div>
            </div>
            <Download size={14} className="text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {/* Download Transformed Output */}
          <button
            onClick={() => downloadTextFile('output.html', outputHtml || '', 'text/html;charset=utf-8')}
            disabled={!outputHtml}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-black/40 hover:bg-white/[0.04] border border-white/[0.07] hover:border-emerald-500/30 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <Globe size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                  Transformed Output (HTML)
                </div>
                <div className="text-[11px] font-mono text-slate-500">output.html</div>
              </div>
            </div>
            <Download size={14} className="text-slate-400 group-hover:text-white transition-colors" />
          </button>

          <div className="w-full h-px bg-white/[0.08] my-1" />

          {/* Complete Project Bundle (ZIP) */}
          <button
            onClick={handleDownloadProjectZip}
            disabled={downloadingZip}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 hover:border-indigo-400/50 transition-all text-left group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/40">
                <Archive size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors flex items-center gap-2">
                  <span>Complete Project Archive</span>
                  <span className="font-mono text-[9px] uppercase px-1 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                    ZIP
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  xml-studio-project.zip (XML + XSLT + HTML)
                </div>
              </div>
            </div>
            {downloadingZip ? (
              <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
            ) : (
              <Download size={14} className="text-indigo-300 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="h-10 px-4 bg-[#080B12] border-t border-white/[0.06] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
