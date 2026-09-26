import { ValidationError, ValidationResult, TransformationResult, XPathResultItem } from '../types';

/**
 * Parses XML/XSL string and extracts any parser errors.
 */
export function validateXml(xmlString: string): ValidationResult {
  if (!xmlString.trim()) {
    return {
      isValid: false,
      errors: [
        {
          line: 1,
          column: 1,
          message: 'Document is empty. Please enter valid XML.',
          severity: 'error',
        },
      ],
      warnings: [],
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const parserErrorNode = doc.querySelector('parsererror');

  if (parserErrorNode) {
    const rawErrorText = parserErrorNode.textContent || 'Unknown XML parsing error';
    const parsedError = parseBrowserError(rawErrorText, xmlString);
    return {
      isValid: false,
      errors: [parsedError],
      warnings: [],
    };
  }

  // Basic logical checks
  const warnings: ValidationResult['warnings'] = [];
  if (!xmlString.trim().startsWith('<?xml')) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Recommended: Include <?xml version="1.0" encoding="UTF-8"?> declaration at the top.',
      severity: 'warning',
    });
  }

  return {
    isValid: true,
    errors: [],
    warnings,
  };
}

/**
 * Validates XSL/XSLT stylesheet.
 */
export function validateXslt(xsltString: string): ValidationResult {
  // First, check basic XML validity
  const baseValidation = validateXml(xsltString);
  if (!baseValidation.isValid) {
    return baseValidation;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xsltString, 'application/xml');
  const root = doc.documentElement;
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [...baseValidation.warnings];

  if (!root) {
    return {
      isValid: false,
      errors: [
        {
          line: 1,
          column: 1,
          message: 'Root element is missing in XSLT stylesheet.',
          severity: 'error',
        },
      ],
      warnings,
    };
  }

  const rootLocalName = root.localName;
  if (rootLocalName !== 'stylesheet' && rootLocalName !== 'transform') {
    errors.push({
      line: 1,
      column: 1,
      message: `Invalid XSLT root element: <${root.nodeName}>. Must be <xsl:stylesheet> or <xsl:transform>.`,
      sourceSnippet: xsltString.split('\n')[0],
      severity: 'error',
    });
  }

  // Check XSL namespace
  const xslNamespace = root.namespaceURI;
  const standardXslNs = 'http://www.w3.org/1999/XSL/Transform';
  if (xslNamespace !== standardXslNs && !root.getAttribute('xmlns:xsl')) {
    errors.push({
      line: 1,
      column: 1,
      message: `Missing or incorrect XSLT namespace. Must declare xmlns:xsl="${standardXslNs}".`,
      severity: 'error',
    });
  }

  // Check version attribute
  const version = root.getAttribute('version');
  if (!version) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Recommended: Specify version="1.0" attribute on <xsl:stylesheet>.',
      severity: 'warning',
    });
  }

  // Check for at least one template
  const templates = doc.getElementsByTagNameNS(standardXslNs, 'template');
  const localTemplates = doc.querySelectorAll('template, xsl\\:template');
  if (templates.length === 0 && localTemplates.length === 0) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'No <xsl:template> definitions found in this stylesheet.',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Executes XSLT transformation on XML data using the browser's native XSLTProcessor.
 */
export function transformXmlWithXslt(xmlContent: string, xsltContent: string): TransformationResult {
  const startTime = performance.now();

  try {
    // 1. Validate XML
    const xmlValidation = validateXml(xmlContent);
    if (!xmlValidation.isValid) {
      return {
        success: false,
        output: '',
        outputType: 'html',
        error: `XML Validation Failed: ${xmlValidation.errors[0]?.message || 'Invalid XML'} (Line ${xmlValidation.errors[0]?.line || 1})`,
        durationMs: performance.now() - startTime,
        timestamp: Date.now(),
      };
    }

    // 2. Validate XSLT
    const xsltValidation = validateXslt(xsltContent);
    if (!xsltValidation.isValid) {
      return {
        success: false,
        output: '',
        outputType: 'html',
        error: `XSLT Validation Failed: ${xsltValidation.errors[0]?.message || 'Invalid XSLT'} (Line ${xsltValidation.errors[0]?.line || 1})`,
        durationMs: performance.now() - startTime,
        timestamp: Date.now(),
      };
    }

    // 3. Check browser XSLTProcessor availability
    if (typeof window === 'undefined' || typeof window.XSLTProcessor === 'undefined') {
      return {
        success: false,
        output: '',
        outputType: 'html',
        error: 'Browser does not support native XSLTProcessor API.',
        durationMs: performance.now() - startTime,
        timestamp: Date.now(),
      };
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
    const xslDoc = parser.parseFromString(xsltContent, 'application/xml');

    const xsltProcessor = new window.XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);

    // Determine output method from <xsl:output method="..." />
    let outputMethod = 'html';
    const outputElement = xslDoc.getElementsByTagNameNS('http://www.w3.org/1999/XSL/Transform', 'output')[0];
    if (outputElement && outputElement.getAttribute('method')) {
      outputMethod = outputElement.getAttribute('method')?.toLowerCase() || 'html';
    }

    // Perform transformation
    let resultString = '';
    let nodeCount = 0;

    if (outputMethod === 'text') {
      const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      resultString = resultDoc.documentElement?.textContent || '';
      return {
        success: true,
        output: resultString,
        outputType: 'text',
        durationMs: Math.max(0.1, Math.round((performance.now() - startTime) * 10) / 10),
        timestamp: Date.now(),
        nodeCount: 1,
      };
    }

    // For HTML or XML, transform to document or fragment
    try {
      const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      if (resultDoc) {
        nodeCount = resultDoc.getElementsByTagName('*').length;
        const serializer = new XMLSerializer();

        if (outputMethod === 'xml') {
          resultString = serializer.serializeToString(resultDoc);
        } else {
          // If it has standard HTML structure:
          if (resultDoc.documentElement && resultDoc.documentElement.nodeName.toLowerCase() === 'html') {
            const hasDoctype = resultDoc.doctype ? `<!DOCTYPE html>\n` : `<!DOCTYPE html>\n`;
            resultString = hasDoctype + resultDoc.documentElement.outerHTML;
          } else {
            resultString = serializer.serializeToString(resultDoc);
          }
        }
      }
    } catch {
      // Fallback: transform to fragment
      const ownerDocument = document.implementation.createHTMLDocument('Preview');
      const fragment = xsltProcessor.transformToFragment(xmlDoc, ownerDocument);
      if (fragment) {
        nodeCount = fragment.querySelectorAll('*').length;
        const div = document.createElement('div');
        div.appendChild(fragment.cloneNode(true));
        resultString = div.innerHTML;
      }
    }

    if (!resultString && !nodeCount) {
      // If result is empty, check if processor produced an empty document
      resultString = '<!-- XSLT transformation produced an empty result. Check your template match patterns and XPath selectors. -->';
    }

    const duration = Math.max(0.1, Math.round((performance.now() - startTime) * 10) / 10);

    return {
      success: true,
      output: resultString,
      outputType: outputMethod === 'xml' ? 'xml' : outputMethod === 'text' ? 'text' : 'html',
      durationMs: duration,
      timestamp: Date.now(),
      nodeCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      output: '',
      outputType: 'html',
      error: `Transformation error: ${errorMsg}`,
      durationMs: performance.now() - startTime,
      timestamp: Date.now(),
    };
  }
}

/**
 * Parses browser's native DOMParser parsererror element to extract line, column, and clean message.
 */
function parseBrowserError(errorText: string, originalCode: string): ValidationError {
  let line = 1;
  let column = 1;
  let cleanMessage = errorText;

  // Pattern 1: Chromium / WebKit: "error on line X at column Y: ..."
  const chromeMatch = errorText.match(/error on line (\d+)(?: at column (\d+))?:\s*(.*)/i);
  if (chromeMatch) {
    line = parseInt(chromeMatch[1], 10);
    column = chromeMatch[2] ? parseInt(chromeMatch[2], 10) : 1;
    cleanMessage = chromeMatch[3] || errorText;
  } else {
    // Pattern 2: Firefox: "XML Parsing Error: ...\nLocation: ...\nLine Number X, Column Y:"
    const ffMatch = errorText.match(/Line Number (\d+), Column (\d+):/i);
    if (ffMatch) {
      line = parseInt(ffMatch[1], 10);
      column = parseInt(ffMatch[2], 10);
      const firstLine = errorText.split('\n')[0] || '';
      cleanMessage = firstLine.replace('XML Parsing Error: ', '');
    } else {
      // Pattern 3: Safari / Generic "line X: ..."
      const genericMatch = errorText.match(/line\s+(\d+)/i);
      if (genericMatch) {
        line = parseInt(genericMatch[1], 10);
      }
    }
  }

  // Extract snippet around the error
  const lines = originalCode.split('\n');
  const lineIdx = line - 1;
  let sourceSnippet = '';

  if (lineIdx >= 0 && lineIdx < lines.length) {
    sourceSnippet = lines[lineIdx];
  }

  // Clean message of internal file paths or XML junk
  cleanMessage = cleanMessage
    .replace(/^This page contains the following errors:\s*/i, '')
    .replace(/Below is a rendering of the page up to the first error\.\s*/i, '')
    .trim();

  return {
    line: Math.max(1, line),
    column: Math.max(1, column),
    message: cleanMessage || 'Syntax error encountered during XML parsing.',
    sourceSnippet,
    severity: 'error',
  };
}

/**
 * Professional XML & XSLT formatter / prettifier.
 */
export function formatXml(xml: string, indentSpaces: number = 2): string {
  if (!xml.trim()) return '';

  const PADDING = ' '.repeat(indentSpaces);
  const reg = /(>)(<)(\/*)/g;
  let formatted = '';
  let pad = 0;

  // Normalize lines around tags while preserving CDATA and comments
  const formattedXml = xml.replace(reg, '$1\r\n$2$3');
  const lines = formattedXml.split('\r\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    let indent = 0;
    if (rawLine.match(/.+<\/\w[^>]*>$/)) {
      // Start and end on same line: e.g. <title>Hello</title>
      indent = 0;
    } else if (rawLine.match(/^<\/\w/)) {
      // Closing tag: </tag>
      if (pad > 0) {
        pad -= 1;
      }
    } else if (rawLine.match(/^<\w[^>]*[^\/]>.*$/) && !rawLine.startsWith('<?') && !rawLine.startsWith('<!')) {
      // Opening tag: <tag> (not self-closing or declaration)
      indent = 1;
    } else {
      indent = 0;
    }

    formatted += PADDING.repeat(pad) + rawLine + '\n';
    pad += indent;
  }

  return formatted.trimEnd();
}

/**
 * Evaluates an XPath expression against an XML string.
 */
export function evaluateXPath(xmlContent: string, xpathQuery: string): { results: XPathResultItem[]; error?: string } {
  try {
    if (!xmlContent.trim()) {
      return { results: [], error: 'XML document is empty' };
    }
    if (!xpathQuery.trim()) {
      return { results: [], error: 'XPath query is empty' };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'application/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return { results: [], error: 'Cannot evaluate XPath: XML has syntax errors' };
    }

    // Simple NS resolver
    const nsResolver: XPathNSResolver = (prefix) => {
      if (prefix === 'xsl') return 'http://www.w3.org/1999/XSL/Transform';
      return doc.documentElement?.lookupNamespaceURI(prefix) || null;
    };

    const evaluated = doc.evaluate(
      xpathQuery,
      doc,
      nsResolver,
      XPathResult.ANY_TYPE,
      null
    );

    const items: XPathResultItem[] = [];
    const serializer = new XMLSerializer();

    switch (evaluated.resultType) {
      case XPathResult.NUMBER_TYPE:
        items.push({
          type: 'number',
          name: 'Number Result',
          value: String(evaluated.numberValue),
          path: xpathQuery,
        });
        break;

      case XPathResult.STRING_TYPE:
        items.push({
          type: 'string',
          name: 'String Result',
          value: evaluated.stringValue,
          path: xpathQuery,
        });
        break;

      case XPathResult.BOOLEAN_TYPE:
        items.push({
          type: 'boolean',
          name: 'Boolean Result',
          value: evaluated.booleanValue ? 'true' : 'false',
          path: xpathQuery,
        });
        break;

      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
      case XPathResult.ORDERED_NODE_ITERATOR_TYPE: {
        let node = evaluated.iterateNext();
        let idx = 1;
        while (node && idx <= 50) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            items.push({
              type: 'element',
              name: `<${el.tagName}>`,
              value: el.textContent?.trim().slice(0, 120) || '(empty element)',
              rawXml: serializer.serializeToString(el),
              path: `${xpathQuery}[${idx}]`,
            });
          } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
            const attr = node as Attr;
            items.push({
              type: 'attribute',
              name: `@${attr.name}`,
              value: attr.value,
              path: `${xpathQuery}/@${attr.name}`,
            });
          } else if (node.nodeType === Node.TEXT_NODE) {
            items.push({
              type: 'text',
              name: 'text()',
              value: node.textContent?.trim() || '',
              path: `${xpathQuery}/text()[${idx}]`,
            });
          }
          node = evaluated.iterateNext();
          idx++;
        }
        break;
      }

      default:
        break;
    }

    return { results: items };
  } catch (err: unknown) {
    return {
      results: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
