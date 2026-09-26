export type FileType = 'xml' | 'xslt' | 'output';

export interface StudioFile {
  id: string;
  name: string;
  type: FileType;
  content: string;
  isModified: boolean;
  size: number;
  lastModified: number;
}

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  sourceSnippet?: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface TransformationResult {
  success: boolean;
  output: string;
  outputType: 'html' | 'xml' | 'text';
  error?: string;
  durationMs: number;
  timestamp: number;
  nodeCount?: number;
}

export interface PresetTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Business' | 'Publishing' | 'Data & Graphics' | 'Developer';
  xml: string;
  xslt: string;
}

export interface XPathResultItem {
  type: 'element' | 'attribute' | 'text' | 'number' | 'boolean' | 'string';
  name: string;
  value: string;
  rawXml?: string;
  path: string;
}

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  category: 'Document' | 'Transformation' | 'View' | 'Export' | 'Tools';
  icon: string;
  action: () => void;
}
