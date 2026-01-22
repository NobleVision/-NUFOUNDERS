import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFParseResult {
  text: string;
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

export interface PDFParseError {
  error: string;
  details?: string;
}

/**
 * Parse a PDF file and extract its text content
 * Runs entirely client-side using PDF.js
 */
export async function parsePDF(file: File): Promise<PDFParseResult | PDFParseError> {
  try {
    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { error: 'Invalid file type', details: 'Please upload a PDF file' };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { error: 'File too large', details: 'Maximum file size is 10MB' };
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Extract metadata
    const metadata = await pdf.getMetadata().catch(() => null);
    const info = metadata?.info as Record<string, string> | undefined;

    // Extract text from all pages
    const textParts: string[] = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (pageText) {
        textParts.push(`--- Page ${pageNum} ---\n${pageText}`);
      }
    }

    const fullText = textParts.join('\n\n');

    if (!fullText.trim()) {
      return { 
        error: 'No text found', 
        details: 'The PDF appears to be empty or contains only images/scanned content' 
      };
    }

    return {
      text: fullText,
      pageCount: pdf.numPages,
      metadata: info ? {
        title: info.Title,
        author: info.Author,
        subject: info.Subject,
        creator: info.Creator,
      } : undefined,
    };
  } catch (err) {
    console.error('PDF parsing error:', err);
    return { 
      error: 'Failed to parse PDF', 
      details: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Check if a result is an error
 */
export function isPDFError(result: PDFParseResult | PDFParseError): result is PDFParseError {
  return 'error' in result;
}
