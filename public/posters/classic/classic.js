async function savePoster() {
  // Select the poster div
  const poster = document.getElementById('poster');
  
  try {
    // Use html2canvas to capture the poster as an image
    const canvas = await html2canvas(poster, { allowTaint: true, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    // Create a new jsPDF instance for A3 size
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a3'); // 'a3' specifies A3 size

    // A3 size dimensions in mm
    const imgWidth = 297; // A3 width in mm
    const imgHeight = 420; // A3 height in mm

    // Calculate the width and height of the image to fit the A3 size
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const pdfWidth = imgWidth;
    const pdfHeight = imgHeight;

    // Adjust the image to fit the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save('poster.pdf');
  } catch (error) {
    console.error("Error generating the poster:", error);
  }
}
