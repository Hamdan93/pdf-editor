document.getElementById('pdfInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const pdfUrl = URL.createObjectURL(file);
        const pdfCanvas = document.getElementById('pdfCanvas');
        const context = pdfCanvas.getContext('2d');
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
    }
});

function downloadPDF() {
    const canvas = document.getElementById('pdfCanvas');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited-pdf.png';
    link.click();
}
