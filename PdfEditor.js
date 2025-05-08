import React, { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Button, Card, CardContent, Input } from '@/components/ui';

export default function PDFEditor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [editedPdf, setEditedPdf] = useState(null);
  const canvasRef = useRef(null);

  const loadPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const page = pdfDoc.getPage(0);

    const { width, height } = page.getSize();
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    loadPdf(file);
  };

  const savePdf = async () => {
    if (!pdfFile) return;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const page = pdfDoc.getPage(0);
    page.drawText('Edited with PDF Editor!', {
      x: 50,
      y: 500,
      size: 24,
      color: rgb(0, 0, 0),
    });

    const editedBytes = await pdfDoc.save();
    const blob = new Blob([editedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setEditedPdf(url);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent>
          <Input type="file" accept="application/pdf" onChange={handlePdfUpload} />
          <Button className="mt-4" onClick={savePdf}>Save PDF</Button>
          {editedPdf && <a href={editedPdf} download="edited.pdf" className="mt-4">Download Edited PDF</a>}
        </CardContent>
      </Card>
      <canvas ref={canvasRef} className="border rounded-lg mt-4"></canvas>
    </div>
  );
}
