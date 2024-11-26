import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'react-toastify';

interface props {
  file: File | string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer: React.FC<props> = ({ file }) => {
  const [showPDF, setShowPDF] = useState<boolean>(false);
  
  useEffect(() => {
    setTimeout(() => {
      setShowPDF(true)
    }, 2000)
  }, []);
  
  return (
    <div className="flex flex-col w-full h-full justify-start items-start md:justify-center md:items-center pt-4 md:pt-0 bg-[#DCFCE4] relative">
      {
        showPDF ?
          <Document
            file={file}
            onError={(error: any) => {
              toast.error('Error while loading document!', error.message);
            }}
            className='md:hidden w-full h-auto md:w-[80%] flex justify-center items-center text-center'
          >
            {Array.from({ length: 1 }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                width={300}
              />
            ))}
          </Document>
          :
          <div className='w-full flex md:hidden justify-center items-center'>
            <div className="w-full flex justify-center items-center h-screen mt-8">
              <div className="h-[60px]">
                <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
              </div>
            </div>
          </div>
      }
      {
        showPDF ?
          <Document
            file={file}
            onError={(error: any) => {
              toast.error('Error while loading document!', error.message);
            }}
            className='hidden md:flex h-auto md:w-[80%] justify-center items-center text-center'
          >
            {Array.from({ length: 1 }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            ))}
          </Document>
          :
          <div className='hidden w-full md:flex justify-center items-center'>
            <div className="w-full flex justify-center items-center h-screen mt-8">
              <div className="h-[60px]">
                <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default PDFViewer;
