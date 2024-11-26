import Modal from '@/components/ui/modal/Modal';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

interface props {
  file: File | string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer: React.FC<props> = ({ file }) => {
  const [docModal, setDocModal]: any = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: any): void {
    setNumPages(nextNumPages);
  }

  return (
    <div className="flex">
      <div className="w-fit h-fit bg-black px-2">
        <div className="bg-black max-w-full px-2 py-2">
          <h1 className="text-white font-poppins text-xs">
            {numPages} {numPages > 1 ? 'Pages' : 'Page'}
          </h1>
        </div>
        <div className="flex justify-center h-full w-full">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onError={(error: any) => {
              console.info('Error while loading document!', error.message);
            }}
          >
            <div className="flex max-w-[200px] overflow-auto no-scroll">
              {Array.from({ length: numPages }, (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  height={100}
                  width={200}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              ))}
            </div>
          </Document>
        </div>
        <div className="flex justify-between bg-black max-w-full py-2">
          <h1 className="text-white font-poppins text-xs">PDF</h1>
          <button
            className="z-50"
            onClick={() => {
              setDocModal(true);
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 22 21"
              fill="none"
            >
              <path
                d="M7.81506 2.80322H5.24946C4.79583 2.80322 4.36079 2.98342 4.04003 3.30419C3.71926 3.62495 3.53906 4.06 3.53906 4.51362V7.07922M18.9326 7.07922V4.51362C18.9326 4.06 18.7524 3.62495 18.4317 3.30419C18.1109 2.98342 17.6759 2.80322 17.2222 2.80322H14.6567M14.6567 18.1968H17.2222C17.6759 18.1968 18.1109 18.0166 18.4317 17.6958C18.7524 17.3751 18.9326 16.94 18.9326 16.4864V13.9208M3.53906 13.9208V16.4864C3.53906 16.94 3.71926 17.3751 4.04003 17.6958C4.36079 18.0166 4.79583 18.1968 5.24946 18.1968H7.81506"
                stroke="white"
                strokeWidth="1.02624"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {docModal === true && (
            <Modal
              onClose={() => {
                setDocModal(false);
              }}
              modalClasses="z-[10000] animate-slide-down fixed left-[100px] widthPDF h-fit text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-transparent"
            >
              <embed
                src={
                  typeof file === 'string' ? file : URL.createObjectURL(file)
                }
                type="application/pdf"
                className="widthPDF h-screen"
              />
              <button
                className="z-50 fixed text-white top-3 -right-14"
                onClick={() => {
                  setDocModal(false);
                }}
              >
                <svg
                  className="h-8 w-8 text-white bg-black/20 rounded-full"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {' '}
                  <circle cx="12" cy="12" r="10" />{' '}
                  <line x1="15" y1="9" x2="9" y2="15" />{' '}
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
