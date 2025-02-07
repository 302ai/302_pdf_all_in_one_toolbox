import { useEffect, useRef, useState } from "react";
import * as PDFJS from "pdfjs-dist";

PDFJS.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFJS.version}/legacy/build/pdf.worker.min.js`;

interface Props {
  fileUrl: string;
  name?: string;
}

const FilePDF = ({ fileUrl, name }: Props) => {
  const pdfDoc = useRef<any>(); // 文档内容
  const pdfNumPages = useRef(0); // 页数
  const [, setPdfWidth] = useState("");
  const [pdfScale] = useState(1.0);
  const [, setForceUpdate] = useState({});
  let canvasArr: any[] = [];

  useEffect(() => {
    PDFJS.getDocument(fileUrl).promise.then((pdfDoc_) => {
      pdfDoc.current = pdfDoc_;
      pdfNumPages.current = pdfDoc_.numPages;
      renderPage(1);
    });
  }, []);

  // 依次渲染所有页面
  const renderPage = (num: any) => {
    pdfDoc.current!.getPage(num).then((page: any) => {
      const id_name = name ? name : `pdfCanvas`;
      let canvas: any = document.getElementById(id_name + num);
      if (!canvas) {
        setForceUpdate({});
        return;
      }
      let ctx = canvas.getContext("2d");
      let dpr = window.devicePixelRatio || 1;
      let bsr =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
      let ratio = dpr / bsr;
      let viewport = page.getViewport({ scale: pdfScale });
      canvas.width = viewport.width * ratio;
      canvas.height = viewport.height * ratio;
      // canvas.style.width = viewport.width + "px";
      // canvas.style.height = viewport.height + "px";
      setPdfWidth(viewport.width + "px");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      // 将 PDF 页面渲染到 canvas 上下文中
      let renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      page.render(renderContext).promise.then(() => {
        if (num < pdfNumPages.current) {
          renderPage(num + 1);
        }
      });
    });
  };

  for (let i = 0; i < pdfNumPages.current; i++) {
    const id_name = name ? `${name}${i + 1}` : `pdfCanvas${i + 1}`;
    canvasArr.push(<canvas id={id_name} key={id_name}></canvas>);
  }

  return (
    <div
      id="pdf-container"
      style={{
        overflowY: "scroll",
        maxHeight: 520,
      }}
      className="pdf-container flex flex-col items-center w-full h-full rounded-lg border-2 border-dashed border-slate-300"
    >
      {canvasArr}
    </div>
  );
};

export default FilePDF;
