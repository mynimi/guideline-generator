import { jsPDF } from 'jspdf'
import 'svg2pdf.js'

import {CalliGrid} from './calliGrid';
import {jsPDFOptions} from 'jspdf';

function getOrientation(width:number, height:number):undefined|"p" | "portrait" | "l" | "landscape" {
  let orientation = 'portrait';
  if(width > height) {
    orientation = 'landscape'
  }
  return orientation;
}

export function generatePDF(gridInstance:CalliGrid){
  const svg = gridInstance.svg;
  const width = gridInstance.width;
  const height = gridInstance.height;
  const fileName = gridInstance.generateGridName('file');
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
      // save the created pdf
      doc.save(`${fileName}.pdf`)
    })
}