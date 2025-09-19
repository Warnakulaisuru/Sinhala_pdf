import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

function App() {
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");

  // Ref for the div to capture as PDF
  const pdfContentRef = useRef();

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/texts");
      setTexts(res.data);
    } catch (err) {
      console.error("Failed to fetch texts:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newText) return;

    try {
      await axios.post("http://localhost:5000/add", { content: newText });
      setNewText("");
      fetchTexts();
    } catch (err) {
      console.error("Failed to add text:", err);
    }
  };

  const downloadPDF = () => {
    const opt = {
      margin: 10,
      filename: "SinhalaText.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(pdfContentRef.current).save();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
      <h1>සිංහල MERN App</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="සිංහල පාඨය ඇතුලත් කරන්න"
          style={{ width: "300px", padding: "8px", fontFamily: "'Noto Sans Sinhala', sans-serif" }}
        />
        <button type="submit">Save</button>
      </form>

      <button onClick={downloadPDF} style={{ marginTop: "10px" }}>
        Download PDF
      </button>

      {/* PDF content */}
      <div ref={pdfContentRef} style={{ marginTop: "20px" }}>
        {texts.map((t) => (
          <p key={t._id} style={{ fontSize: "18px", lineHeight: "1.5" }}>
            {t.content}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;