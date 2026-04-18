// import { useEffect, useRef, useState } from "react";
// import { pdfjs, Document, Page } from "react-pdf";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// export default function PdfRow({
//   index,
//   fileUrl,
// }: {
//   index: number;
//   fileUrl: string;
// }) {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [containerDimensions, setContainerDimensions] = useState({
//     width: 900,
//     height: 600,
//   });
//   const [numPages, setNumPages] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const obs = new ResizeObserver((entries) => {
//       for (const entry of entries) {
//         const w = Math.floor(entry.contentRect.width);
//         const h = Math.floor(entry.contentRect.height);
//         setContainerDimensions({ width: w, height: h });
//       }
//     });
//     obs.observe(containerRef.current);
//     return () => obs.disconnect();
//   }, []);

//   function onDocumentLoadSuccess(doc: any) {
//     setNumPages(doc.numPages);
//   }

//   // Calculate scale to fit the page within the container
//   const pageWidth = containerDimensions.width - 48; // padding
//   const pageHeight = containerDimensions.height - 48;

//   return (
//     <div className="flex items-center gap-4 py-2">
//       <p className="text-sm font-medium text-muted-foreground w-6 text-center">
//         {index + 1}
//       </p>

//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="outline" size="sm">
//             Open PDF
//           </Button>
//         </DialogTrigger>

//         <DialogContent className="h-[90vh] max-w-full w-screen p-0 overflow-auto">
//           <DialogHeader className="flex flex-col items-center justify-between border-b px-6 py-3 shrink-0">
//             <DialogTitle className="text-lg font-semibold">
//               PDF Preview - Page {currentPage} of {numPages || 1}
//             </DialogTitle>
//             <div className="flex flex-col items-center gap-4">
//               <div className="flex  items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(numPages, p + 1))
//                   }
//                   disabled={currentPage >= numPages}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage <= 1}
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//               </div>
//               <a
//                 href={fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-primary hover:underline"
//               >
//                 Open full PDF ↗
//               </a>
//             </div>
//           </DialogHeader>

//           <div
//             ref={containerRef}
//             className="flex-1 flex items-center justify-center bg-muted/30 p-6 overflow-hidden"
//           >
//             <Document
//               file={fileUrl}
//               onLoadSuccess={onDocumentLoadSuccess}
//               loading={
//                 <p className="text-sm text-muted-foreground">Loading PDF…</p>
//               }
//             >
//               <Page
//                 pageNumber={currentPage}
//                 width={pageWidth}
//                 height={pageHeight}
//                 renderTextLayer={false}
//                 renderAnnotationLayer={true}
//                 className="shadow-lg rounded-md bg-white"
//               />
//             </Document>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// import { useRef, useState } from "react";
// import { pdfjs, Document, Page } from "react-pdf";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// export default function PdfRow({
//   index,
//   fileUrl,
// }: {
//   index: number;
//   fileUrl: string;
// }) {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const [numPages, setNumPages] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   function onDocumentLoadSuccess(doc: any) {
//     setNumPages(doc.numPages);
//   }

//   return (
//     <div className="flex items-center gap-4 py-2">
//       <p className="text-sm font-medium text-muted-foreground w-6 text-center">
//         {index + 1}
//       </p>

//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="outline" size="sm">
//             Open PDF
//           </Button>
//         </DialogTrigger>

//         <DialogContent className="h-[90vh] max-w-full w-screen p-0 overflow-auto">
//           <DialogHeader className="flex flex-col items-center justify-between border-b px-6 py-3 shrink-0">
//             <DialogTitle className="text-lg font-semibold">
//               PDF Preview - Page {currentPage} of {numPages || 1}
//             </DialogTitle>
//             <div className="flex flex-col items-center gap-4">
//               <div className="flex  items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(numPages, p + 1))
//                   }
//                   disabled={currentPage >= numPages}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage <= 1}
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//               </div>
//               <a
//                 href={fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-primary hover:underline"
//               >
//                 Open full PDF ↗
//               </a>
//             </div>
//           </DialogHeader>

//           <div
//             ref={containerRef}
//             className="flex-1 flex items-center justify-center bg-muted/30 p-6 overflow-auto w-full h-full"
//           >
//             <Document
//               file={fileUrl}
//               onLoadSuccess={onDocumentLoadSuccess}
//               loading={
//                 <p className="text-sm text-muted-foreground">Loading PDF…</p>
//               }
//             >
//               <Page
//                 height={200}
//                 pageNumber={currentPage}
//                 renderTextLayer={false}
//                 renderAnnotationLayer={true}
//                 className="shadow-lg rounded-md bg-white w-full h-full"
//               />
//             </Document>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  DocumentCallback,
  PageCallback,
} from "react-pdf/dist/shared/types.js";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfRow({
  index,
  fileUrl,
}: {
  index: number;
  fileUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageScale, setPageScale] = useState<number>(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w > 0 && h > 0) {
          setContainerDimensions({ width: w, height: h });
        }
      }
    };

    // Delay initial measurement to ensure DOM is ready
    setTimeout(updateDimensions, 100);

    const obs = new ResizeObserver(() => {
      updateDimensions();
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  function onDocumentLoadSuccess(doc: DocumentCallback) {
    setNumPages(doc.numPages);
  }

  function onPageLoadSuccess(page: PageCallback) {
    const viewport = page.getViewport({ scale: 1 });
    const pdfWidth = viewport.width;
    const pdfHeight = viewport.height;

    const containerWidth = containerDimensions.width - 48;
    const containerHeight = containerDimensions.height - 48;

    // Calculate scale to fit entire page without cropping
    const scaleX = containerWidth / pdfWidth;
    const scaleY = containerHeight / pdfHeight;
    const scale = Math.min(scaleX, scaleY, 2.5); // Max scale to avoid huge PDFs

    setPageScale(scale);
  }

  return (
    <div className="flex flex-row-reverse items-center justify-start gap-4 py-2">
      <p className="text-2xl text-muted-foreground w-6 text-center font-extrabold">
        {index + 1}
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Open PDF
          </Button>
        </DialogTrigger>

        <DialogContent className="h-[97vh] max-w-full w-screen p-0 overflow-hidden flex flex-col gap-0">
          <DialogHeader className="flex flex-col items-center justify-between border-b px-6 py-3 shrink-0">
            <DialogTitle className="text-lg font-semibold">
              PDF Preview - Page {currentPage} of {numPages || 1}
            </DialogTitle>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(numPages, p + 1))
                  }
                  disabled={currentPage >= numPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Open full PDF ↗
              </a>
            </div>
          </DialogHeader>

          <Document
            file={fileUrl}
            className={""}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <p className="text-sm text-muted-foreground">Loading PDF…</p>
            }
          >
            <Page
              key={`page_${currentPage}_${containerDimensions.width}_${containerDimensions.height}`}
              pageNumber={currentPage}
              scale={pageScale}
              onLoadSuccess={onPageLoadSuccess}
              renderTextLayer={false}
              renderAnnotationLayer={true}
            />
          </Document>
        </DialogContent>
      </Dialog>
    </div>
  );
}
