import * as pdfjsLib from 'pdfjs-dist';

export const extractTextFromBase64Pdf = async (base64Content: string): Promise<string> => {
  try {
    // Clean the base64 string by removing any whitespace and potential data URL prefix
    const cleanBase64 = base64Content.replace(/^data:.*,/, '').replace(/\s/g, '');

    // Convert base64 to Uint8Array with error handling
    let pdfData: Uint8Array;
    try {
      pdfData = Uint8Array.from(atob(cleanBase64), c => c.charCodeAt(0));
    } catch (error) {
      throw new Error('Invalid base64 PDF content');
    }

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let fullText = '';

    // Iterate through all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};
