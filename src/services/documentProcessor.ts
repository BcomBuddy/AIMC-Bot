import { loadPDFFromURL } from './pdfLoader';
import { Document } from '@langchain/core/documents';

export interface ProcessedDocument {
  filename: string;
  content: string;
  type: 'pdf';
}

export class DocumentProcessor {
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    // Check file type
    if (!file.type.includes('pdf')) {
      return {
        valid: false,
        error: 'Only PDF files are supported'
      };
    }

    return { valid: true };
  }

  static async processFile(file: File): Promise<ProcessedDocument> {
    try {
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Load and process the PDF
      const documents: Document[] = await loadPDFFromURL(fileUrl);
      
      // Combine all document contents
      const combinedContent = documents
        .map(doc => doc.pageContent)
        .join('\n\n');

      // Clean up the URL
      URL.revokeObjectURL(fileUrl);

      return {
        filename: file.name,
        content: combinedContent,
        type: 'pdf'
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Failed to process document');
    }
  }
}