import {CalliGrid} from "./calliGrid";

export function saveSVGAsFile(gridInstance: CalliGrid) {
  const fileName = gridInstance.generateGridName('file');
  const svgContent = new XMLSerializer().serializeToString(gridInstance.svg as SVGSVGElement);
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}