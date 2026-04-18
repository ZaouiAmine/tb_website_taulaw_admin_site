import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface FilePreviewProps {
  fileUrl: string;
  showmodal: (showModal: boolean) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileUrl, showmodal }) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const isPdf = (url: string) => {
    console.log({ isPdf });
    const cleanUrl = url.split("?")[0];
    return /\.pdf$/i.test(cleanUrl);
  };

  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
        showmodal(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showModal, showmodal]);

  return (
    <div className="mb-6 w-full">
      <div
        className="cursor-pointer flex items-center justify-center group hover:opacity-90"
        onClick={() => {
          setShowModal(true);
          showmodal(true);
        }}
      >
        {isPdf(fileUrl) ? (
          <FaFilePdf className="text-7xl h-[100px] text-red-600 transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <span>{t("files.unsupportedFileFormat")}</span>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            showmodal(false);
            setShowModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white/95 border border-gray-200 shadow-2xl rounded-2xl w-[92vw] max-w-5xl max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-[#f7f9ff] to-white">
              <h3 className="text-[#1f2a44] text-lg font-semibold">
                {isPdf(fileUrl) ? t("files.previewPdf") : t("files.preview")}
              </h3>
              <button
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700 rounded-md p-1.5 hover:bg-gray-100"
                onClick={() => {
                  showmodal(false);
                  setShowModal(false);
                }}
              >
                ×
              </button>
            </div>

            <div className="p-4 md:p-5 bg-white">
              <div className="flex items-center justify-center">
                {isPdf(fileUrl) ? (
                  <iframe
                    src={fileUrl}
                    className="w-[90vw] h-[70vh] md:w-[70vw] md:h-[70vh] rounded-lg border"
                    title="PDF Preview"
                  />
                ) : (
                  <span>{t("files.unsupportedFileFormat")}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t bg-white">
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                download={"pdf_preview"}
                className="inline-flex items-center gap-x-2 text-sm text-white bg-primary hover:bg-[#1f3c7d] py-2 px-4 rounded-lg shadow-sm transition-colors"
              >
                <span>{t("files.viewFile")}</span>
              </a>
              <button
                className="inline-flex items-center text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg border border-gray-200"
                onClick={() => {
                  showmodal(false);
                  setShowModal(false);
                }}
              >
                {t("files.close")}
              </button>
            </div>
          </div>
        </div>
      )}
      <a
        href={fileUrl}
        target="_blank"
        download={"pdf_preview"}
        className="mt-3 w-full flex gap-x-2 text-[12px] text-white bg-primary justify-center items-center py-2 px-4 rounded-lg shadow-sm transition-colors hover:bg-[#1f3c7d]"
      >
        <span>{t("files.viewFile")}</span>
      </a>
    </div>
  );
};

export default FilePreview;
