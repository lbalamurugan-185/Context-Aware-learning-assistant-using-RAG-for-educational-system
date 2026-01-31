import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, UnderlineType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generate export metadata
 */
const getMetadata = (question, answer, confidence, processingTime, sourcesCount) => {
  return {
    question,
    answer,
    confidence,
    processingTime,
    sourcesCount,
    exportDate: new Date().toLocaleString(),
  };
};

/**
 * Export as TXT format
 */
export const exportAsTxt = (question, answer, confidence, processingTime, sourcesCount) => {
  const metadata = getMetadata(question, answer, confidence, processingTime, sourcesCount);
  const cleanAnswer = cleanTextForTxt(answer);
  
  const content = `Learning Assistant
Academic Answer Report | Generated: ${metadata.exportDate}

QUESTION
${'-'.repeat(80)}
${question}

GENERATED ANSWER
${'-'.repeat(80)}
${cleanAnswer}
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'answer-report.txt');
};

/**
 * Clean text for TXT - remove all markdown including hashtags
 */
const cleanTextForTxt = (text) => {
  return text
    .replace(/^#+\s+/gm, '') // Remove all # at start of lines
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italics
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // code blocks
    .replace(/[_>-]/g, ' ') // misc markdown chars
    .trim();
};

/**
 * Clean text for PDF/DOCX rendering - remove all markdown including hashtags
 */
const cleanTextForDocument = (text) => {
  return text
    .replace(/^#+\s+/gm, '') // Remove all # at start of lines
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italics
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // code blocks
    .replace(/[_>-]/g, ' ') // misc markdown chars
    .trim();
};

/**
 * Export as PDF format
 */
export const exportAsPdf = (question, answer, confidence, processingTime, sourcesCount) => {
  const metadata = getMetadata(question, answer, confidence, processingTime, sourcesCount);
  const cleanAnswer = cleanTextForDocument(answer);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Learning Assistant', margin, yPosition);
  yPosition += 10;

  // Subtitle
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Academic Answer Report | Generated: ${metadata.exportDate}`, margin, yPosition);
  yPosition += 15;

  // Question Section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('QUESTION', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const questionLines = doc.splitTextToSize(question, maxWidth);
  doc.text(questionLines, margin, yPosition);
  yPosition += questionLines.length * 5 + 8;

  // Check if we need new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  // Answer Section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('GENERATED ANSWER', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  const answerLines = doc.splitTextToSize(cleanAnswer, maxWidth);
  doc.text(answerLines, margin, yPosition);
  yPosition += answerLines.length * 5;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Context-Aware Learning Assistant | RAG-Powered Academic System', margin, pageHeight - 10);

  doc.save('answer-report.pdf');
};

/**
 * Export as DOCX format
 */
export const exportAsDocx = (question, answer, confidence, processingTime, sourcesCount) => {
  const metadata = getMetadata(question, answer, confidence, processingTime, sourcesCount);
  const cleanAnswer = cleanTextForDocument(answer);

  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            text: 'Learning Assistant',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.LEFT,
            spacing: { after: 50 },
            run: new TextRun({
              size: 32,
              bold: true,
              color: '000000',
            }),
          }),

          // Subtitle
          new Paragraph({
            text: `Academic Answer Report | Generated: ${metadata.exportDate}`,
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
            run: new TextRun({
              size: 20,
              color: '666666',
            }),
          }),

          // Question Heading
          new Paragraph({
            text: 'QUESTION',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 150 },
            run: new TextRun({
              size: 24,
              bold: true,
              color: '000000',
            }),
          }),

          // Question Content
          new Paragraph({
            text: question,
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
            run: new TextRun({
              size: 20,
              color: '000000',
            }),
          }),

          // Answer Heading
          new Paragraph({
            text: 'GENERATED ANSWER',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 150 },
            run: new TextRun({
              size: 24,
              bold: true,
              color: '000000',
            }),
          }),

          // Answer Content
          new Paragraph({
            text: cleanAnswer,
            alignment: AlignmentType.LEFT,
            spacing: { after: 300 },
            run: new TextRun({
              size: 20,
              color: '000000',
            }),
          }),

          // Footer
          new Paragraph({
            text: 'Context-Aware Learning Assistant | RAG-Powered Academic System',
            alignment: AlignmentType.LEFT,
            spacing: { before: 200 },
            run: new TextRun({
              size: 16,
              color: '999999',
              italic: true,
            }),
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, 'answer-report.docx');
  });
};