import { jsPDF } from 'jspdf';
import { nanoid } from 'nanoid';

export interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: Date;
  courseHours?: number;
  instructorName?: string;
}

export interface GeneratedCertificate {
  blob: Blob;
  certificateId: string;
  fileName: string;
}

/**
 * Generate a professional PDF certificate for course completion
 */
export function generateCertificate(data: CertificateData): GeneratedCertificate {
  const certificateId = `NF-${nanoid(8).toUpperCase()}`;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background gradient effect using rectangles
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.setLineWidth(1);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  // Inner decorative line
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Corner decorations
  const cornerSize = 15;
  doc.setFillColor(99, 102, 241); // indigo-500
  
  // Top-left corner
  doc.triangle(10, 10, 10 + cornerSize, 10, 10, 10 + cornerSize, 'F');
  // Top-right corner
  doc.triangle(pageWidth - 10, 10, pageWidth - 10 - cornerSize, 10, pageWidth - 10, 10 + cornerSize, 'F');
  // Bottom-left corner
  doc.triangle(10, pageHeight - 10, 10 + cornerSize, pageHeight - 10, 10, pageHeight - 10 - cornerSize, 'F');
  // Bottom-right corner
  doc.triangle(pageWidth - 10, pageHeight - 10, pageWidth - 10 - cornerSize, pageHeight - 10, pageWidth - 10, pageHeight - 10 - cornerSize, 'F');

  // NuFounders Logo/Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(99, 102, 241); // indigo-500
  doc.text('NUFOUNDERS', pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Empowering Entrepreneurs Through Education', pageWidth / 2, 42, { align: 'center' });

  // Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('CERTIFICATE', pageWidth / 2, 62, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('OF COMPLETION', pageWidth / 2, 72, { align: 'center' });

  // Decorative line under title
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 78, pageWidth / 2 + 40, 78);

  // "This is to certify that" text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('This is to certify that', pageWidth / 2, 92, { align: 'center' });

  // User Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(30, 41, 59);
  doc.text(data.userName, pageWidth / 2, 108, { align: 'center' });

  // Underline for name
  const nameWidth = doc.getTextWidth(data.userName);
  doc.setDrawColor(199, 210, 254);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - nameWidth / 2 - 10, 112, pageWidth / 2 + nameWidth / 2 + 10, 112);

  // "has successfully completed" text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('has successfully completed the course', pageWidth / 2, 125, { align: 'center' });

  // Course Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  
  // Handle long course names
  const maxCourseWidth = pageWidth - 60;
  const courseLines = doc.splitTextToSize(data.courseName, maxCourseWidth);
  doc.text(courseLines, pageWidth / 2, 140, { align: 'center' });

  // Course hours if provided
  const courseHoursY = 140 + (courseLines.length * 8);
  if (data.courseHours) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${data.courseHours} hours of instruction`, pageWidth / 2, courseHoursY, { align: 'center' });
  }

  // Date
  const formattedDate = data.completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`Awarded on ${formattedDate}`, pageWidth / 2, pageHeight - 50, { align: 'center' });

  // Signature line
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 35, pageHeight - 38, pageWidth / 2 + 35, pageHeight - 38);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Program Director', pageWidth / 2, pageHeight - 33, { align: 'center' });

  // Certificate ID (for verification)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Certificate ID: ${certificateId}`, pageWidth / 2, pageHeight - 18, { align: 'center' });
  doc.text('Verify at: nufounders.com/verify', pageWidth / 2, pageHeight - 13, { align: 'center' });

  // Generate blob
  const blob = doc.output('blob');
  const fileName = `NuFounders_Certificate_${data.courseName.replace(/[^a-zA-Z0-9]/g, '_')}_${certificateId}.pdf`;

  return {
    blob,
    certificateId,
    fileName,
  };
}

/**
 * Download a certificate as PDF
 */
export function downloadCertificate(data: CertificateData): void {
  const { blob, fileName } = generateCertificate(data);
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
