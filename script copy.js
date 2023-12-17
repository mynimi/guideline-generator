const a4Width = 210;
const a4Height = 297;
const marginTop = 20;
const marginBottom = 20;
const marginLeft = 30;
const marginRight = 30;
const roundingRadius = 5;
const width = a4Width - marginLeft - marginRight;
const height = a4Height - marginTop - marginBottom;
const newSVG = createSVG(a4Width, a4Height);
const area = drawRectangle(newSVG, marginLeft, marginTop, width, height, roundingRadius);
const maskGroup = createMaskGroup(newSVG);
const calliHeight = getCalliLineHeight(xHeight, ratioAscender, ratioBase, ratioDescender);
const repetitions = calculateRepetitions(height, calliHeight);
const gapBetweenElements = calculateGap(height, calliHeight, repetitions - 2);
console.log("Number of repetitions:", repetitions);
console.log("Gap between elements:", gapBetweenElements);

let offset = marginTop;
for (let i = 0; i < repetitions; i++) {
  console.log(offset);
  drawCalliLines(maskGroup, marginLeft, width + marginRight, offset);
  offset += calliHeight + gapBetweenElements;
}

document.body.appendChild(newSVG);

class calliGrid{
  constructor(){}
}

function createSVG(width, height) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const viewBox = `0 0 ${width} ${height}`;
  svg.setAttribute("viewBox", viewBox);

  return svg;
}


function getCalliLineHeight(xHeight, ratioAscender, ratioBase, ratioDescender) {
  const height = xHeight * (ratioAscender + ratioBase + ratioDescender);
  console.log(height);
  return height;
}

function drawCalliLines(svg, xStart = 0, xEnd = width, YTop = 0) {
  const calliHeight = getCalliLineHeight(xHeight, ratioAscender, ratioBase, ratioDescender);
  const ascenderLineY = YTop;
  const xHeightLineY = ascenderLineY + xHeight * ratioAscender;
  const baseLineY = xHeightLineY + xHeight * ratioBase;
  const descenderLineY = baseLineY + xHeight * ratioDescender;
  const ascenderLine = createHorizontalLine(svg, xStart, xEnd, ascenderLineY);
  const xHeightLine = createHorizontalLine(svg, xStart, xEnd, xHeightLineY);
  const baseLine = createHorizontalLine(svg, xStart, xEnd, baseLineY);
  const descenderLine = createHorizontalLine(svg, xStart, xEnd, descenderLineY);

  // Draw additional lines between ascenderLine and xHeightLine based on ratioAscender
  drawAdditionalLines(svg, xStart, xEnd, ascenderLineY, xHeightLineY, ratioAscender);
  drawAdditionalLines(svg, xStart, xEnd, xHeightLineY, baseLineY, ratioBase);
  drawAdditionalLines(svg, xStart, xEnd, baseLineY, descenderLineY, ratioDescender);

  // const test = drawSlantedLine(svg, 0, descenderLineY, calliHeight, 55, 'green', 1);
  const slant = drawRepeatedSlantedLines(svg, xStart, descenderLineY, width, calliHeight, 55, "red", 1, 8);
}

function drawAdditionalLines(svg, xStart, xEnd, startY, endY, ratio) {
  const spaceBetweenLines = (endY - startY) / ratio;

  for (let i = 1; i < ratio; i++) {
    drawDottedHorizontalLine(svg, xStart, xEnd, startY + i * spaceBetweenLines, 0.3, 1, "black");
  }
}

function createMask(svg, width, height, maskId) {
  const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.setAttribute("id", maskId);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", "white"); // Set fill color for the mask

  mask.appendChild(rect);
  svg.appendChild(mask);
  return `url(#${maskId})`; // Return the mask reference
}

function createMaskGroup(svg) {
  const maskGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  maskGroup.setAttribute("mask", "url(#myMask)");
  maskGroup.setAttribute("id", "maskGroup");
  svg.appendChild(maskGroup);
  return maskGroup;
}

function drawRectangle(svg, marginLeft, marginTop, rectWidth, rectHeight, roundingRadius) {
  const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rectangle.setAttribute("x", marginLeft);
  rectangle.setAttribute("y", marginTop);
  rectangle.setAttribute("width", rectWidth);
  rectangle.setAttribute("height", rectHeight);
  rectangle.setAttribute("rx", roundingRadius); // Set rounding radius for corners
  rectangle.setAttribute("fill", "white"); // Set fill color
  rectangle.setAttribute("stroke-width", "1");
  rectangle.setAttribute("stroke", "black");

  const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.setAttribute("id", "myMask");

  // Create a clone of the rectangle
  const clonedRect = rectangle.cloneNode(true);

  // Append the original rectangle to the mask
  mask.appendChild(rectangle);

  // Append the cloned rectangle to the SVG
  svg.appendChild(mask);
  svg.appendChild(clonedRect);
}

function drawRepeatedSlantedLines(svg, xStart, y1, width, height, angle, strokeColor, strokeWidth, repetitions) {
  const x2Final = width;
  const x1Final = x2Final - height / Math.tan((angle * Math.PI) / 180);
  const totalRange = x1Final;
  console.log(totalRange);
  let spaceBetweenRepetitions;
  if (repetitions == "auto") {
    spaceBetweenRepetitions = totalRange / (xHeight - 1);
  } else {
    spaceBetweenRepetitions = totalRange / (repetitions - 1);
  }

  let x1 = xStart;

  for (let i = 0; i < repetitions; i++) {
    drawSlantedLine(svg, x1, y1, height, angle, strokeColor, strokeWidth);

    x1 += spaceBetweenRepetitions;
  }
}

function drawSlantedLine(svg, x1, y1, height, angle, strokeColor, strokeWidth) {
  const length = height / Math.cos((angle * Math.PI) / 180);
  const x2 = x1 + height / Math.tan((angle * Math.PI) / 180);
  const y2 = y1 - height;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", strokeColor);
  line.setAttribute("stroke-width", strokeWidth);

  svg.appendChild(line);
}

function drawDottedHorizontalLine(svg, x1, x2, y, dotRadius, gapBetweenDots, dotColor) {
  const dotSpacing = dotRadius * 2 + gapBetweenDots;
  let currentX = x1;

  while (currentX <= x2) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", currentX);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", dotRadius);
    circle.setAttribute("fill", dotColor);

    svg.appendChild(circle);

    currentX += dotSpacing;
  }
}

function createHorizontalLine(svg, x1, width, y) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("x2", width);
  line.setAttribute("y1", y);
  line.setAttribute("y2", y);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");

  svg.appendChild(line);
}

function calculateRepetitions(totalHeight, smallerElementHeight) {
  return Math.floor(totalHeight / smallerElementHeight);
}

function calculateGap(totalHeight, smallerElementHeight, repetitions) {
  return (totalHeight - repetitions * smallerElementHeight) / (repetitions - 1);
}