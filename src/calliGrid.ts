export interface CalliGridOptions {
  documentWidth?: number;
  documentHeight?: number;
  documentMarginTop?: number;
  documentMarginBottom?: number;
  documentMarginLeft?: number;
  documentMarginRight?: number;
  lineColor?:string;
  addAreaBox?: boolean;
  areaBorderWidth?: number;
  areaBorderColor?: string;
  areaBorderRadius?: number;
  areaBlockBuffer?: number;
  gridLineRatioAscender?: number;
  gridLineRatioBase?: number;
  gridLineRatioDescender?: number;
  gridLineXHeight?: number;
  gridLineColor?: string;
  gridLineStrokeWidth?: number;
  gridBaseLineStrokeWidth?: number;
  addgridXHeightIndicator?: boolean;
  gridXHeightIndicatorStrokeWidth?: number;
  slantLineAngle?: number;
  slantLinesPerLine?: number;
  coordinateDecimalPlaceMax?:number;
  container?: Element;
  textFontSize?: number;
  textLineHeight?:number;
  addTitle?:boolean;
}

export class CalliGrid {
  public defaults: CalliGridOptions;
  public svg: SVGElement;
  private options: CalliGridOptions;
  private maskId: string;
  public width: number;
  public height: number;
  private marginTop:number;
  private marginBottom:number;
  private fontColor:string;

  constructor(options?: CalliGridOptions) {
    this.defaults = {
      documentWidth: 210,
      documentHeight: 297,
      documentMarginTop: 10,
      documentMarginBottom: 10,
      documentMarginLeft: 7,
      documentMarginRight: 7,
      addAreaBox: true,
      areaBorderWidth: 0.3,
      areaBorderColor: "black",
      areaBorderRadius: 2,
      areaBlockBuffer: 5,
      gridLineRatioAscender: 3,
      gridLineRatioBase: 2,
      gridLineRatioDescender: 3,
      gridLineXHeight: 5,
      gridLineColor: "black",
      gridLineStrokeWidth: 0.2,
      gridBaseLineStrokeWidth: 1,
      addgridXHeightIndicator: true,
      gridXHeightIndicatorStrokeWidth: 2,
      slantLineAngle: 55,
      slantLinesPerLine: 10,
      container: document.querySelector("[data-svg-preview]"),
      coordinateDecimalPlaceMax: 2,
      textFontSize: 4,
      textLineHeight: 1.2,
      addTitle: true,
    };

    this.options = options ? { ...this.defaults, ...options } : this.defaults;
    this.width = this.options.documentWidth; // these are accessible since the pdf accesses those.
    this.height = this.options.documentHeight; // these are accessible since the pdf accesses those.
    this.svg = this.createDocument(); // public svg so it can be grabbed by pdf
    this.fontColor = 'rgb(0 0 0 / 50%)';
    const textBuffer = 2;
    const copyrightSizeFactor = 0.7;
    const textHeight = this.options.textFontSize * this.options.textLineHeight + textBuffer;
    
    this.marginTop = this.options.addTitle ? this.options.documentMarginTop + textHeight : this.options.documentMarginTop;
    this.marginBottom = this.options.documentMarginBottom + (textHeight * copyrightSizeFactor);
    
    this.addCopyright("© grid halfapx.com · generated with guideline maker", copyrightSizeFactor);
    if(this.options.addTitle){
      this.addTitle(this.generateGridName('pretty'));
    }

    if (this.options.addAreaBox) {
      this.maskId = "grid-mask";
      this.drawMask();
      this.drawRectangle(this.svg, "transparent", this.options.areaBorderColor);
    }
    this.drawCalligraphyGrid();
    this.renderSVG();
  }

  generateGridName(type: "pretty" | "file"): string {
    const ratioSeparator = type == "pretty" ? ":" : "-";
    const angleLabel = type == 'pretty' ? '°' : 'deg';
    const separator = type == 'pretty' ? ' ' : '_';
    return `${this.options.slantLineAngle}${angleLabel}${separator}${this.options.gridLineRatioAscender}${ratioSeparator}${this.options.gridLineRatioBase}${ratioSeparator}${this.options.gridLineRatioDescender}${separator}${this.options.gridLineXHeight}mm`;
  }

  createDocument(): SVGElement {
    const width = this.options.documentWidth;
    const height = this.options.documentHeight;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const viewBox = `0 0 ${width} ${height}`;
    svg.setAttribute("viewBox", viewBox);

    return svg;
  }

  drawCalligraphyGrid() {
    const docWidth = this.options.documentWidth;
    const docHeight = this.options.documentHeight;
    const marginLeft = this.options.documentMarginLeft;
    const marginRight = this.options.documentMarginRight;
    const marginTop = this.marginTop;
    const marginBottom = this.marginBottom;
    const buffer = this.options.addAreaBox ? this.options.areaBlockBuffer : 0;
    const xEnd = docWidth - marginRight;
    const height = docHeight - marginTop - marginBottom - buffer * 2;
    const calliLineHeight = this.calculateCalligraphyLineHeight();
    const lineRepetitions = this.calculateCalliLineRepetitions(height, calliLineHeight);
    const gapBetweenCalliLines = this.calculateCalliLineGap(height, calliLineHeight, lineRepetitions);
    const gridParent = this.createGroup("grid", "calli-grid", this.maskId ? this.maskId : undefined);
    let calliLineStartY = marginTop + buffer;
    for (let i = 0; i < lineRepetitions; i++) {
      this.drawCalligraphyLine(gridParent, marginLeft, xEnd, calliLineStartY, calliLineHeight);
      calliLineStartY += calliLineHeight + gapBetweenCalliLines;
    }
    this.svg.appendChild(gridParent);
  }

  calculateCalligraphyLineHeight(): number {
    const height =
      this.options.gridLineXHeight *
      (this.options.gridLineRatioAscender + this.options.gridLineRatioBase + this.options.gridLineRatioDescender);
    return height;
  }

  calculateCalliLineRepetitions(areaHeight: number, lineHeight: number): number {
    return Math.floor(areaHeight / lineHeight);
  }

  calculateCalliLineGap(areaHeight: number, lineHeight: number, repetitions: number): number {
    return (areaHeight - repetitions * lineHeight) / (repetitions - 1);
  }

  drawRectangle(parentEl, fillColor, strokeColor) {
    const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const rectWidth = this.options.documentWidth - this.options.documentMarginLeft - this.options.documentMarginRight;
    const rectHeight = this.options.documentHeight - this.marginTop - this.marginBottom;
    rectangle.setAttribute("x", this.options.documentMarginLeft.toString());
    rectangle.setAttribute("y", this.marginTop.toString());
    rectangle.setAttribute("width", rectWidth.toString());
    rectangle.setAttribute("height", rectHeight.toString());
    rectangle.setAttribute("rx", this.options.areaBorderRadius.toString()); // Set rounding radius for corners
    rectangle.setAttribute("fill", fillColor); // Set fill color
    rectangle.setAttribute("stroke-width", this.options.areaBorderWidth.toString());
    rectangle.setAttribute("stroke", strokeColor);
    parentEl.appendChild(rectangle);
  }

  drawMask() {
    const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("id", this.maskId);
    this.drawRectangle(mask, "white", "black");
    this.svg.appendChild(mask);
  }

  drawCalligraphyLine(
    parentEl: SVGElement,
    xStart: number,
    xEnd: number,
    yStart: number,
    calliLineHeight: number
  ): void {
    const xHeight = this.options.gridLineXHeight;
    const ratioAscender = this.options.gridLineRatioAscender;
    const ratioBase = this.options.gridLineRatioBase;
    const ratioDescender = this.options.gridLineRatioDescender;
    const yStartAscenderLine = yStart;
    const yStartXHeightLine = yStartAscenderLine + xHeight * ratioAscender;
    const yStartBaseLine = yStartXHeightLine + xHeight * ratioBase;
    const yStartDescenderLine = yStartBaseLine + xHeight * ratioDescender;
    const lineGroup = this.createGroup("line");

    this.drawBase(lineGroup, xStart, xEnd, yStartBaseLine, yStartXHeightLine);
    this.drawAscender(lineGroup, xStart, xEnd, yStartXHeightLine, yStartAscenderLine);
    this.drawDescender(lineGroup, xStart, xEnd, yStartBaseLine, yStartDescenderLine);
    if(this.options.slantLineAngle > 0){
      this.drawSlantLines(lineGroup, xStart, yStartDescenderLine, calliLineHeight);
    }
    parentEl.appendChild(lineGroup);
  }

  drawBase(parentEl, xStart, xEnd, yBase, yXHeight) {
    const ratio = this.options.gridLineRatioBase;
    this.drawHorizontalLine(
      parentEl,
      xStart,
      xEnd,
      yBase,
      this.options.gridLineColor,
      this.options.gridBaseLineStrokeWidth
    );
    this.drawHorizontalLine(
      parentEl,
      xStart,
      xEnd,
      yXHeight,
      this.options.gridLineColor,
      this.options.gridLineStrokeWidth
    );
    this.drawExtraLines(parentEl, xStart, xEnd, yBase, yXHeight, ratio);
    if (this.options.addgridXHeightIndicator) {
      this.drawxHeightIndicator(parentEl, xStart, yBase, yXHeight);
    }
  }

  drawAscender(parentEl, xStart, xEnd, yXHeight, yAscender) {
    const ratio = this.options.gridLineRatioAscender;
    this.drawHorizontalLine(
      parentEl,
      xStart,
      xEnd,
      yXHeight,
      this.options.gridLineColor,
      this.options.gridLineStrokeWidth
    );
    this.drawHorizontalLine(
      parentEl,
      xStart,
      xEnd,
      yAscender,
      this.options.gridLineColor,
      this.options.gridLineStrokeWidth
    );
    this.drawExtraLines(parentEl, xStart, xEnd, yAscender, yXHeight, ratio);
  }

  drawDescender(parentEl, xStart, xEnd, yBase, yDescender) {
    const ratio = this.options.gridLineRatioDescender;
    this.drawHorizontalLine(
      parentEl,
      xStart,
      xEnd,
      yBase,
      this.options.gridLineColor,
      this.options.gridLineStrokeWidth
    );
    this.drawHorizontalLine(
      parentEl,
      xStart,
      xEnd,
      yDescender,
      this.options.gridLineColor,
      this.options.gridLineStrokeWidth
    );
    this.drawExtraLines(parentEl, xStart, xEnd, yDescender, yBase, ratio);
  }

  drawSlantLines(parentEl, xStart, yStart, lineHeight) {
    const repetitions = this.options.slantLinesPerLine;
    const x2Final = this.options.documentWidth - this.options.documentMarginLeft - this.options.documentMarginRight;
    const x1Final = x2Final - lineHeight / Math.tan((this.options.slantLineAngle * Math.PI) / 180);
    const totalRange = x1Final;
    let spaceBetweenRepetitions;
    spaceBetweenRepetitions = totalRange / (repetitions - 1);

    let x1 = xStart;

    for (let i = 0; i < repetitions; i++) {
      this.drawSlantLine(parentEl, lineHeight, x1, yStart);

      x1 += spaceBetweenRepetitions;
    }
  }

  drawExtraLines(parentEl, xStart, xEnd, yStart, yEnd, ratio) {
    const spaceBetweenLines = (yEnd - yStart) / ratio;

    for (let i = 1; i < ratio; i++) {
      this.drawDottedHorizontalLine(
        parentEl,
        xStart,
        xEnd,
        yStart + i * spaceBetweenLines,
        this.options.gridLineStrokeWidth * 0.5,
        this.options.gridLineStrokeWidth * 1,
        this.options.gridLineColor
      );
    }
  }

  createGroup(className?: string, idName?: string, maskId?: string): SVGElement {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    if (className) {
      group.setAttribute("class", className);
    }
    if (idName) {
      group.setAttribute("id", idName);
    }
    if (maskId) {
      group.setAttribute("mask", `url(#${maskId})`);
    }
    return group;
  }

  drawxHeightIndicator(parentEl: SVGElement, xStart: number, yStart: number, yEnd: number) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const x = xStart + this.options.gridXHeightIndicatorStrokeWidth * 0.5;
    line.setAttribute("x1", x.toString());
    line.setAttribute("x2", x.toString());
    line.setAttribute("y1", yStart.toString());
    line.setAttribute("y2", yEnd.toString());
    line.setAttribute("stroke", this.options.gridLineColor);
    line.setAttribute("stroke-width", this.options.gridXHeightIndicatorStrokeWidth.toString());

    parentEl.appendChild(line);
  }

  drawSlantLine(parentEl, lineHeight, xStart, yStart) {
    const angle = this.options.slantLineAngle;
    const xEnd = xStart + lineHeight / Math.tan((angle * Math.PI) / 180);
    const yEnd = yStart - lineHeight;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", this.formatCoordinate(xStart));
    line.setAttribute("y1", this.formatCoordinate(yStart));
    line.setAttribute("x2", this.formatCoordinate(xEnd));
    line.setAttribute("y2", this.formatCoordinate(yEnd));
    line.setAttribute("stroke", this.options.gridLineColor);
    line.setAttribute("stroke-width", this.options.gridLineStrokeWidth.toString());

    parentEl.appendChild(line);
  }

  drawHorizontalLine(
    parentEl: SVGElement,
    xStart: number,
    xEnd: number,
    yStart: number,
    strokeColor: string,
    strokeWidth: number
  ) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", this.formatCoordinate(xStart));
    line.setAttribute("x2", this.formatCoordinate(xEnd));
    line.setAttribute("y1", this.formatCoordinate(yStart));
    line.setAttribute("y2", this.formatCoordinate(yStart));
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("stroke-width", strokeWidth.toString());

    parentEl.appendChild(line);
  }

  drawDottedHorizontalLine(parentEl, x1, x2, y, dotRadius, gapBetweenDots, dotColor) {
    const lineGroup = this.createGroup("dotted-line");
    const dotSpacing = dotRadius * 2 + gapBetweenDots;
    let currentX = x1;
  
    while (currentX <= x2) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", this.formatCoordinate(currentX));
      circle.setAttribute("cy", this.formatCoordinate(y));
      circle.setAttribute("r", dotRadius);
      circle.setAttribute("fill", dotColor);
  
      lineGroup.appendChild(circle);
  
      currentX += dotSpacing;
    }
    parentEl.appendChild(lineGroup);
  }

  addTitle(titleText: string): void {
    const leftPos = this.options.documentWidth - this.options.documentMarginRight
    const lineHeight = this.options.textFontSize * this.options.textLineHeight;
    const topPos = lineHeight + this.options.documentMarginTop;
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.textContent = titleText;
    title.setAttribute("x", leftPos.toString()); // Adjust X position as needed
    title.setAttribute("y", topPos.toString()); // Adjust Y position as needed
    title.setAttribute("text-anchor", "end");
    title.setAttribute("font-size", this.options.textFontSize.toString());
    title.setAttribute("fill", this.fontColor);
    title.setAttribute("font-family", "Arial, sans-serif"); // Web-safe font

    this.svg.appendChild(title);
  }

  addCopyright(text: string, fontSizeFactor:number): void {
    const leftPos = this.options.documentMarginLeft;
    const topPos = this.height - this.options.documentMarginBottom;
    const copyright = document.createElementNS("http://www.w3.org/2000/svg", "text");
    copyright.textContent = text;
    copyright.setAttribute("x", leftPos.toString());
    copyright.setAttribute("y", topPos.toString()); // Adjust Y position as needed
    copyright.setAttribute("font-size", (this.options.textFontSize*fontSizeFactor).toString());
    copyright.setAttribute("fill", this.fontColor);
    copyright.setAttribute("font-family", "Arial, sans-serif"); // Web-safe font

    this.svg.appendChild(copyright);
  }

  renderSVG(): void {
    this.options.container.appendChild(this.svg);
  }

  removeSVG(): void {
    this.options.container.removeChild(this.svg);
  }

  formatCoordinate(n:number):string{
    return parseFloat(n.toFixed(this.options.coordinateDecimalPlaceMax)).toString();
  }
}
