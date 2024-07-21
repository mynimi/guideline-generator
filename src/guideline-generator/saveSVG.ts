export function saveSVGAsFile(gridInstance:any) {
  const fileName = gridInstance.fileName;
  const svgContent = new XMLSerializer().serializeToString(gridInstance.svgElement as SVGSVGElement);
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}