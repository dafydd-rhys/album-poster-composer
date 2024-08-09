async function savePoster() {
  // Select the poster div
  const poster = document.getElementById('poster');
  
  try {
    // Use html2canvas to capture the poster as an image
    const canvas = await html2canvas(poster, { allowTaint: true, useCORS: true });
    const imgData = canvas.toDataURL('image/png'); // Use 'image/png' for better compatibility

    // Create a new jsPDF instance with custom dimensions
    const { jsPDF } = window.jspdf;
    
    // Custom dimensions in mm (840 x 1188 pixels converted to mm)
    const posterWidthPx = 840;
    const posterHeightPx = 1188;
    const pxToMm = (px) => px * 25.4 / 96;
    const posterWidthMm = pxToMm(posterWidthPx);
    const posterHeightMm = pxToMm(posterHeightPx);

    const pdf = new jsPDF('p', 'mm', [posterWidthPx, posterHeightPx]);

    // Add the image to the PDF at the dimensions of the poster
    pdf.addImage(imgData, 'PNG', 0, 0, posterWidthPx, posterHeightPx);

    // Save the PDF
    pdf.save('poster.pdf');
  } catch (error) {
    console.error("Error generating the poster:", error);
  }
}

