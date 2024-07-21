import { jsPDF } from 'jspdf'
import 'svg2pdf.js'

import {type jsPDFOptions} from 'jspdf';

type orientationConfig = "p" | "portrait" | "l" | "landscape"
function getOrientation(width:number, height:number): orientationConfig{
  let orientation:orientationConfig = 'portrait';
  if(width > height) {
    orientation = 'landscape'
  }
  return orientation;
}

export function generatePDF(gridInstance){
  const svg = gridInstance.svgElement;
  const width = gridInstance.width;
  const height = gridInstance.height;
  const fileName = gridInstance.fileName;
  const orientation:undefined|"p" | "portrait" | "l" | "landscape" = getOrientation(width, height);
  const docOptions: jsPDFOptions = {
    unit: 'mm',
    orientation: orientation,
    format: [width, height]
  };
  const doc = new jsPDF(docOptions)  
  doc.svg(svg as Element, {
      width: width,
      height: height
    })
    .then(() => {
      doc.save(`${fileName}.pdf`)
    })
}