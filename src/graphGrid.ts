export interface GraphGridOptions {
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
  gridLineXHeight?: number;
  gridLineStrokeWidth?: number;
  coordinateDecimalPlaceMax?:number;
  container?: Element;
  textFontSize?: number;
  textLineHeight?:number;
  addTitle?:boolean;
  gridType?:'graph'|'dot';
}

export class GraphGrid {
  public defaults: GraphGridOptions;
  public svg: SVGElement;
  private options: GraphGridOptions;
  private maskId: string;
  public width: number;
  public height: number;
  private marginTop:number;
  private marginBottom:number;
  private fontColor:string;

  constructor(options?: GraphGridOptions) {
    this.defaults = {
      documentWidth: 210,
      documentHeight: 297,
      documentMarginTop: 10,
      documentMarginBottom: 10,
      documentMarginLeft: 7,
      documentMarginRight: 7,
      addAreaBox: true,
      areaBorderWidth: 0.3,
      areaBorderColor: "#000000",
      areaBorderRadius: 2,
      gridLineXHeight: 5,
      gridLineStrokeWidth: 0.2,
      lineColor:'black',
      container: document.querySelector("[data-svg-preview]"),
      coordinateDecimalPlaceMax: 2,
      textFontSize: 4,
      textLineHeight: 1.2,
      addTitle: true,
      gridType: 'graph'
    };

    this.options = options ? { ...this.defaults, ...options } : this.defaults;
    this.width = this.options.documentWidth; // these are accessible since the pdf accesses those.
    this.height = this.options.documentHeight; // these are accessible since the pdf accesses those.
    this.svg = this.createDocument(); // public svg so it can be grabbed by pdf
    this.fontColor = '#808080';
    const textBuffer = 2;
    const copyrightSizeFactor = 0.7;
    const textHeight = this.options.textFontSize * this.options.textLineHeight + textBuffer;
    
    this.marginTop = this.options.addTitle ? this.options.documentMarginTop + textHeight : this.options.documentMarginTop;
    this.marginBottom = this.options.documentMarginBottom + (textHeight * copyrightSizeFactor);
    
    this.addCopyright("© grid code.halfapx.com/guideline-generator/", copyrightSizeFactor);
    if(this.options.addTitle){
      this.addTitle(this.generateGridName('pretty'));
    }

    if (this.options.addAreaBox) {
      this.maskId = "grid-mask";
      this.drawMask();
      this.drawRectangle(this.svg, "transparent", this.options.areaBorderColor);
    }
    this.drawGraphGrid();
    this.renderSVG();
  }

  generateGridName(type: "pretty" | "file"): string {
    const separator = type == 'pretty' ? ' ' : '_';
    const name = this.options.gridType == 'dot' ? 'dot grid' : 'graph';
    return `${name}${separator}${this.options.gridLineXHeight}mm`;
  }

  createDocument(): SVGElement {
    const width = this.options.documentWidth;
    const height = this.options.documentHeight;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const viewBox = `0 0 ${width} ${height}`;
    svg.setAttribute("viewBox", viewBox);

    return svg;
  }

  drawGraphGrid() {
    const docWidth = this.options.documentWidth;
    const docHeight = this.options.documentHeight;
    const marginLeft = this.options.documentMarginLeft;
    const marginRight = this.options.documentMarginRight;
    const marginTop = this.marginTop;
    const marginBottom = this.marginBottom;
    const xEnd = docWidth - marginRight;
    const yEnd = docHeight - marginBottom;
    const height = docHeight - marginTop - marginBottom;
    const width = docWidth - marginLeft - marginRight;
    const xHeight = this.options.gridLineXHeight;
    const horizontalReps = height / xHeight;
    const horizontalRemainder = height % xHeight;
    const verticalReps = width / xHeight;
    const verticalRemainder = width % xHeight;

    const gridParent = this.createGroup("grid", "calli-grid", this.maskId ? this.maskId : undefined);   
    let yLineStart = marginTop + horizontalRemainder / 2;
    const gridType = this.options.gridType;
    const horizontalIntersections = [];
    for (let i = 0; i <= horizontalReps; i++) {
      if(gridType == 'graph'){
        this.drawHorizontalLine(gridParent, marginLeft, xEnd, yLineStart, this.options.lineColor, this.options.gridLineStrokeWidth);
      }
      if(gridType == 'dot'){
        horizontalIntersections.push(yLineStart);
      }
      yLineStart += xHeight;
    }
    
    let xLineStart = marginLeft + verticalRemainder / 2;
    const verticalIntersections = [];
    for (let i = 0; i <= verticalReps; i++) {
      if(gridType == 'graph'){
        this.drawVerticalLine(gridParent, xLineStart, marginTop, yEnd);
      }
      if(gridType == 'dot'){
        verticalIntersections.push(xLineStart);
      }
      xLineStart += xHeight;
    }
  
    if(gridType == 'dot'){
      // Add dots at intersection points
      for (let i = 0; i < horizontalIntersections.length; i++) {
        for (let j = 0; j < verticalIntersections.length; j++) {
          const x = this.formatCoordinate(verticalIntersections[j]);
          const y = this.formatCoordinate(horizontalIntersections[i]);
    
          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", x.toString());
          dot.setAttribute("cy", y.toString());
          dot.setAttribute("r", this.options.gridLineStrokeWidth.toString()); // Adjust the dot size as needed
          dot.setAttribute("fill", this.options.lineColor); // Adjust the dot color as needed
          gridParent.appendChild(dot);
        }
      }
    }

    this.svg.appendChild(gridParent);
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

  drawVerticalLine(parentEl: SVGElement, xStart: number, yStart: number, yEnd: number) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const x = xStart;
    line.setAttribute("x1", x.toString());
    line.setAttribute("x2", x.toString());
    line.setAttribute("y1", yStart.toString());
    line.setAttribute("y2", yEnd.toString());
    line.setAttribute("stroke", this.options.lineColor);
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

  addTitle(titleText: string): void {
    const leftPos = this.options.documentWidth - this.options.documentMarginRight
    const lineHeight = this.options.textFontSize * this.options.textLineHeight;
    const topPos = lineHeight + this.options.documentMarginTop;
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.textContent = titleText;
    title.setAttribute("x", leftPos.toString());
    title.setAttribute("y", topPos.toString());
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
    copyright.setAttribute("y", topPos.toString());
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
