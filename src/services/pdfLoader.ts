import { Document } from "@langchain/core/documents";
import * as PDFJS from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

// The worker will be loaded automatically by importing 'pdfjs-dist/build/pdf.worker.entry'

export async function loadPDFFromURL(url: string): Promise<Document[]> {
  try {
    console.log(`Attempting to load PDF from URL: ${url}`);
    
    // Ensure URL starts with forward slash for Vite's public directory
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    // Create a full URL using the current origin
    const fullUrl = `${window.location.origin}${normalizedUrl}`;
    console.log(`Full URL: ${fullUrl}`);
    
    // Fetch the PDF first to check if it exists
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const pdfData = await response.arrayBuffer();
    console.log(`PDF data fetched, size: ${pdfData.byteLength} bytes`);
    
    // Load the PDF document
    const loadingTask = PDFJS.getDocument({ data: pdfData });
    
    // Add error handler to the loading task
    loadingTask.onPassword = (updatePassword, reason) => {
      console.error("PDF is password protected:", reason);
      throw new Error("PDF is password protected");
    };

    const pdf = await loadingTask.promise;
    const documents: Document[] = [];

    // Extract text from each page
    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        console.log(`Processing page ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ")
          .trim();

        if (pageText) {
          documents.push(
            new Document({
              pageContent: pageText,
              metadata: {
                page: i,
                source: url,
              },
            })
          );
          console.log(`Page ${i} processed successfully`);
        } else {
          console.warn(`Page ${i} is empty or contains no extractable text`);
        }
      } catch (error) {
        console.error(`Error processing page ${i}:`, error);
        // Continue with next page instead of failing completely
      }
    }

    if (documents.length === 0) {
      throw new Error("No text content could be extracted from the PDF");
    }

    console.log(`Successfully extracted ${documents.length} pages of content`);
    return documents;
  } catch (error) {
    console.error("Error loading PDF:", error);
    throw error;
  }
}
