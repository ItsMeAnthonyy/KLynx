import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate and download a prescription PDF
 * @param {Object} prescriptionData - The prescription record data
 * @param {Object} patientData - The patient information
 */
export const generatePrescriptionPDF = (prescriptionData, patientData) => {
  const doc = new jsPDF();
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 20;

  // Header - Clinic/Hospital Information
  doc.setFillColor(17, 18, 80); // Dark blue background
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('KLYNX HEALTH CENTER', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Karangalan Village, Cainta, Rizal', pageWidth / 2, 22, { align: 'center' });
  doc.text('Tel: (02) 8000-0000 | Email: info@klynxhealth.com', pageWidth / 2, 28, { align: 'center' });

  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  yPosition = 45;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESCRIPTION', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Prescription Date and Number
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${prescriptionData.datePresc || new Date().toISOString().split('T')[0]}`, margin, yPosition);
  doc.text(`Prescription No: ${prescriptionData.id || 'N/A'}`, pageWidth - margin - 50, yPosition);
  yPosition += 10;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Patient Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const patientInfo = [
    [`Name: ${patientData?.name || 'N/A'}`, `Age: ${patientData?.age || 'N/A'} years`],
    [`Gender: ${patientData?.gender || 'N/A'}`, `Blood Type: ${patientData?.bloodType || 'N/A'}`],
    [`Address: ${patientData?.address || 'N/A'}`, ''],
  ];

  patientInfo.forEach(([left, right]) => {
    doc.text(left, margin, yPosition);
    if (right) doc.text(right, pageWidth / 2 + 10, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // Divider line
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Diagnosis Section
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGNOSIS:', margin, yPosition);
  yPosition += 6;
  
  doc.setFont('helvetica', 'normal');
  const diagnosisText = prescriptionData.prescriptionDetails || 'Not specified';
  const splitDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * margin));
  doc.text(splitDiagnosis, margin, yPosition);
  yPosition += (splitDiagnosis.length * 6) + 8;

  // Medication Section
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(245, 247, 250);
  doc.rect(margin, yPosition, pageWidth - (2 * margin), 8, 'F');
  doc.text('MEDICATION PRESCRIBED', margin + 2, yPosition + 6);
  yPosition += 12;

  // Medication Table
  const medications = prescriptionData.medicationName 
    ? prescriptionData.medicationName.split(',').map(med => med.trim())
    : ['Not specified'];

  const dosages = prescriptionData.prescdosage 
    ? prescriptionData.prescdosage.split(',').map(d => d.trim())
    : [''];

  const frequencies = prescriptionData.prescfrequency 
    ? prescriptionData.prescfrequency.split(',').map(f => f.trim())
    : [''];

  const tableData = medications.map((med, index) => [
    index + 1,
    med,
    dosages[index] || 'As prescribed',
    frequencies[index] || 'As directed',
    prescriptionData.prescduration || 'As needed'
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['#', 'Medication', 'Dosage', 'Frequency', 'Duration']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [17, 18, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: 30 },
    },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Special Instructions
  if (prescriptionData.specialInstructions) {
    doc.setFont('helvetica', 'bold');
    doc.text('SPECIAL INSTRUCTIONS:', margin, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    const instructionsText = prescriptionData.specialInstructions;
    const splitInstructions = doc.splitTextToSize(instructionsText, pageWidth - (2 * margin));
    doc.text(splitInstructions, margin, yPosition);
    yPosition += (splitInstructions.length * 6) + 8;
  }

  // Follow-up Visit
  if (prescriptionData.followUpDate) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Follow-up Visit: ${prescriptionData.followUpDate}`, margin, yPosition);
    yPosition += 10;
  }

  // Signature Section
  yPosition = Math.max(yPosition + 10, doc.internal.pageSize.height - 60);
  
  doc.setDrawColor(0, 0, 0);
  doc.line(pageWidth - margin - 70, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(prescriptionData.prescribedBy || 'Dr. [Name]', pageWidth - margin - 35, yPosition, { align: 'center' });
  yPosition += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Physician Signature', pageWidth - margin - 35, yPosition, { align: 'center' });
  doc.text(`License No: _____________`, pageWidth - margin - 35, yPosition + 5, { align: 'center' });

  // Footer
  const footerY = doc.internal.pageSize.height - 15;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a computer-generated prescription. Valid only with physician signature.', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });

  // Save the PDF
  const fileName = `Prescription_${patientData?.name?.replace(/\s+/g, '_')}_${prescriptionData.datePresc || 'date'}.pdf`;
  doc.save(fileName);
};

export default generatePrescriptionPDF;
