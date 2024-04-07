// pages / test / index.tsx
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import ValidationPage from "@/pages/validation";
import { Component } from "@/components/_test/index";

import type { NextPage } from "next";

const PdfTestPage: NextPage = () => {
  const pdfDownloadHandler = () => {
    // 関数名をtypo修正しました
    console.log(1);
    const target = document.getElementById("pdf-id");
    if (target === null) return;

    html2canvas(target, { scale: 2, windowWidth: 210, windowHeight: 297 }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0); // SVGからJPEGへ変更
        let pdf = new jsPDF({
          orientation: "landscape", // 必要に応じて'portrait'に変更
          unit: "mm",
          format: "a4",
        });
        pdf.addImage(
          imgData,
          "JPEG", // SVGからJPEGへ変更
          5,
          10,
          canvas.width / 8, // これは画像サイズに応じて調整する必要があります
          canvas.height / 8 // これは画像サイズに応じて調整する必要があります
        );
        pdf.save("test.pdf");
      }
    );
  };

  return (
    <>
      {/* PDFに変換したいコンポーネントを含む部分 */}
      <div id="pdf-id">
        <ValidationPage /> {/* <Component /> */}
      </div>

      <button type="button" onClick={pdfDownloadHandler}>
        PDFファイルをダウンロードするボタン
      </button>
    </>
  );
};

export default PdfTestPage;
