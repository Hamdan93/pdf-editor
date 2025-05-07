import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { Button } from "@/components/ui/button";

export default function PDFEditor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [editingText, setEditingText] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const pdfDoc = await PDFDocument.load(reader.result);
        setPdfFile(pdfDoc);
        const pdfBytes = await pdfDoc.save();
        setPdfUrl(URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" })));
      };
    }
  };

  const addText = () => {
    setEditingText([...editingText, { text: "Edit me", x: 50, y: 50 }]);
  };

  const savePDF = async () => {
    if (pdfFile) {
      const page = pdfFile.getPages()[0];
      editingText.forEach(({ text, x, y }) => {
        page.drawText(text, { x, y, size: 12, color: rgb(0, 0, 0) });
      });
      const pdfBytes = await pdfFile.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "edited.pdf";
      link.click();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Interactive PDF Editor</h2>
      <input type="file" onChange={handleFileUpload} accept="application/pdf" className="mb-4" />
      {pdfUrl && (
        <div className="relative mb-4">
          <iframe src={pdfUrl} className="w-full h-96 border" />
          {editingText.map((item, index) => (
            <input
              key={index}
              value={item.text}
              onChange={(e) => {
                const newText = [...editingText];
                newText[index].text = e.target.value;
                setEditingText(newText);
              }}
              style={{ position: "absolute", left: item.x, top: item.y }}
              className="border p-1 bg-white text-black"
            />
          ))}
        </div>
      )}
      <Button onClick={addText} className="mr-2">Add Text</Button>
      <Button onClick={savePDF} variant="default">Save PDF</Button>
    </div>
  );
}
