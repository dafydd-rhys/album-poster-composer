async function savePoster() {
  // Select the poster div
  const poster = document.getElementById('poster');
  
  try {
    // Use html2canvas to capture the poster as an image with a higher scale factor
    const canvas = await html2canvas(poster, { 
      allowTaint: true, 
      useCORS: true, 
      scale: 2 // Increase the scale factor for better resolution
    });
    const imgData = canvas.toDataURL('image/png');

    // Create a new jsPDF instance with custom dimensions
    const { jsPDF } = window.jspdf;
    
    // Custom dimensions in mm
    const posterWidthPx = 840;
    const posterHeightPx = 1188;
    const pxToMm = (px) => px * 25.4 / 96;
    const posterWidthMm = pxToMm(posterWidthPx);
    const posterHeightMm = pxToMm(posterHeightPx);

    // Create the PDF with custom page size
    const pdf = new jsPDF('p', 'mm', [posterWidthMm, posterHeightMm]);

    // Add the image to the PDF at the dimensions of the poster
    pdf.addImage(imgData, 'PNG', 0, 0, posterWidthMm, posterHeightMm);

    // Save the PDF
    pdf.save('poster.pdf');
  } catch (error) {
    console.error("Error generating the poster:", error);
  }
}
