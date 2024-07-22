export interface GridPageBasicOptions {
  documentWidth?: number;
  documentHeight?: number;
  addAreaBox?: boolean;
  color?: string;
  stroke?: number;
}

export interface GridPageExtendedOptions {
  documentMarginTop?: number;
  documentMarginBottom?: number;
  documentMarginLeft?: number;
  documentMarginRight?: number;
  areaStrokeWidth?: number;
  areaStrokeColor?: string;
  areaBorderRadius?: number;
  addTitle?: boolean;
}

export interface GridPageTechnicalOptions {
  coordinateDecimalPlaceMax?: number;
  container: Element | null;
  textFontSize?: number;
  textLineHeight?: number;
}

export type OutputType = "dom" | "string";

export type RequiredFields<T> = { [K in keyof T]-?: T[K] };

export type GridPageConfig = GridPageBasicOptions & GridPageExtendedOptions & GridPageTechnicalOptions;

export class GridMaker {
  #defaults: RequiredFields<GridPageConfig>;
  #config: RequiredFields<GridPageConfig>;
  #svg!: SVGElement | string;
  #prettyName: string = this.generateGridName("pretty");
  #fileName: string = this.generateGridName("file");
  readonly #defaultStrokeSize: number = 0.2;
  readonly #defaultStrokeColor: string = "#000000";
  readonly #copyrightSizeFactor: number = 0.7;
  readonly #textBuffer: number = 2;
  readonly #fontColor: string = "#808080";
  readonly #copyRightText: string = "© grid code.halfapx.com/guideline-generator/";
  readonly #addCopyright: boolean = true;
  #maskId: string = '';

  get maskId(): string {
    return this.#maskId;
  }

  set maskId(id: string) {
    this.#maskId = id;
  }

  get defaultValues(): RequiredFields<GridPageConfig> {
    return this.#defaults;
  }

  get svgElement(): SVGElement | undefined | string {
    return this.#svg;
  }

  get width(): number {
    return this.#config.documentWidth;
  }

  get height(): number {
    return this.#config.documentHeight;
  }

  private get textHeight(): number {
    return this.#config.textFontSize * this.#config.textLineHeight + this.#textBuffer;
  }

  get marginTop(): number {
    return this.#config.addTitle ? this.#config.documentMarginTop + this.textHeight : this.#config.documentMarginTop;
  }

  get marginBottom(): number {
    return this.#addCopyright
      ? this.#config.documentMarginBottom + this.textHeight * this.#copyrightSizeFactor
      : this.#config.documentMarginBottom;
  }

  get marginLeft(): number {
    return this.#config.documentMarginLeft;
  }

  get marginRight(): number {
    return this.#config.documentMarginRight;
  }

  get gridWidth(): number {
    return this.width - this.#config.documentMarginLeft - this.#config.documentMarginRight;
  }

  get gridHeight(): number {
    return this.height - this.marginTop - this.marginBottom;
  }

  get prettyName(): string {
    return this.#prettyName;
  }

  get fileName(): string {
    return this.#fileName;
  }

  set prettyName(text: string) {
    this.#prettyName = text;
  }

  set fileName(text: string) {
    this.#fileName = text;
  }

  constructor(options: Partial<GridPageConfig> = {}) {
    this.#defaults = {
      documentWidth: 210,
      documentHeight: 297,
      documentMarginTop: 10,
      documentMarginBottom: 10,
      documentMarginLeft: 7,
      documentMarginRight: 7,
      color: this.#defaultStrokeColor,
      stroke: this.#defaultStrokeSize,
      addAreaBox: true,
      areaBorderRadius: 5,
      areaStrokeWidth: this.#defaultStrokeSize,
      areaStrokeColor: this.#defaultStrokeColor,
      container: null,
      coordinateDecimalPlaceMax: 2,
      textFontSize: 4,
      textLineHeight: 1.2,
      addTitle: true,
    };

    this.#defaults.areaStrokeColor = options.color || this.#defaultStrokeColor;
    this.#defaults.areaStrokeWidth = options.stroke || this.#defaultStrokeSize;
    this.#config = { ...this.#defaults, ...options };
  }

  init(): void {}

  makeSVG(): SVGElement {
    const svg = this.createDocument("dom") as SVGElement;
    if (this.#addCopyright) {
      svg.appendChild(this.addCopyright("dom") as Element);
    }
    if (this.#config.addTitle) {
      svg.appendChild(this.addTitle("dom") as Element);
    }
    if (this.#config.addAreaBox) {
      svg.appendChild(this.addMask("dom") as Element);
      svg.appendChild(this.addRectangle("dom", "transparent", this.#config.areaStrokeColor) as Element);
    }
    return svg;
  }

  makeSVGString(addCloseTag:boolean = true): string {
    let svgString = this.createDocument("string");
    if (this.#addCopyright) {
      svgString += this.addCopyright("string") as string;
    }
    if (this.#config.addTitle) {
      svgString += this.addTitle("string") as string;
    }
    if (this.#config.addAreaBox) {
      svgString += this.addMask("string") as string;
      svgString += this.addRectangle("string", "transparent", this.#config.areaStrokeColor) as string;
    }
    if(addCloseTag) {
      svgString += "</svg>";
    }
    return svgString as string;
  }

  createGroup(output: OutputType, className?: string, idName?: string, maskId?: string): Element | string {
    if (output === "dom") {
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
    } else {
      const groupString = /*html*/ `
        <g 
          ${className ? `class="${className}"` : ""} 
          ${idName ? `id="${idName}"` : ""} 
          ${maskId ? `mask="url(#${maskId})"` : ""}
        >`;
      return groupString;
    }
  }

  addLine(
    output: OutputType,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    stroke: number | string,
    strokeWidth?: string,
    srokeDashArray?: string,
    strokeLineCap?: "round" | "square" | "butt"
  ): Element | string {
    const formatX1 = this.formatCoordinate(x1).toString();
    const formatX2 = this.formatCoordinate(x2).toString();
    const formatY1 = this.formatCoordinate(y1).toString();
    const formatY2 = this.formatCoordinate(y2).toString();

    if (output === "dom") {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const strokeWidth = typeof stroke === "string" ? stroke : stroke.toString();
      line.setAttribute("x1", formatX1);
      line.setAttribute("y1", formatY1);
      line.setAttribute("x2", formatX2);
      line.setAttribute("y2", formatY2);
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", strokeWidth);
      if (srokeDashArray) {
        line.setAttribute("stroke-dasharray", srokeDashArray);
      }
      if (strokeLineCap) {
        line.setAttribute("stroke-linecap", strokeLineCap);
      }
      return line;
    } else {
      return /*html*/ `
        <line 
          x1="${formatX1}" 
          y1="${formatY1}" 
          x2="${formatX2}" 
          y2="${formatY2}" 
          stroke="${color}" 
          stroke-width="${stroke}"
          ${srokeDashArray ? `stroke-dasharray="${srokeDashArray}"` : ""}
          ${strokeLineCap ? `stroke-linecap="${strokeLineCap}"` : ""}
        />
      `;
    }
  }

  drawSolidLine(
    output: OutputType,
    orientation: "horizontal" | "vertical",
    gridPos: number,
    lineStart: number,
    lineEnd: number,
    color: string,
    stroke: number
  ): Element | string {
    let x1 = 0,
      x2 = 0,
      y1 = 0,
      y2 = 0;
    if (orientation === "horizontal") {
      x1 = lineStart;
      x2 = lineEnd;
      y1 = y2 = gridPos;
    }
    if (orientation === "vertical") {
      y1 = lineStart;
      y2 = lineEnd;
      x1 = x2 = gridPos;
    }

    const line = this.addLine(output, x1, y1, x2, y2, color, stroke);
    return line;
  }

  drawDashedLine(
    output: OutputType,
    orientation: "horizontal" | "vertical",
    gridPos: number,
    lineStart: number,
    lineEnd: number,
    dotRadius: number,
    dotColor: string
  ): Element | string {
    const dotSize = dotRadius * 2;
    const dotGap = dotRadius * 4;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    if(orientation === "horizontal") {
      x1 = lineStart;
      x2 = lineEnd;
      y1 = y2 = gridPos;
    }
    if(orientation === "vertical") {
      y1 = lineStart;
      y2 = lineEnd;
      x1 = x2 = gridPos;
    }

    return this.addLine(output, x1, y1, x2, y2, dotColor, dotSize, `0,${dotGap.toString}`, "round");
  }

  drawSlantLine(
    output: OutputType,
    lineHeight: number,
    angle: number,
    xStart: number,
    yStart: number,
    color: string,
    stroke: number
  ): Element | string {
    const xEnd = xStart + lineHeight / Math.tan((angle * Math.PI) / 180);
    const yEnd = yStart - lineHeight;

    const line = this.addLine(output, xStart, yStart, xEnd, yEnd, color, stroke);

    return line;
  }

  formatCoordinate(n: number): string {
    return parseFloat(n.toFixed(this.#config.coordinateDecimalPlaceMax)).toString();
  }

  private generateUniqueId(baseId: string): string {
    const uniqueIdSuffix = Math.random().toString(36).substr(2, 5); // Generating a random unique string
    return `${baseId}-${uniqueIdSuffix}`;
  }

  private addTitle(output: OutputType): Element | string {
    const titleFontSize = this.#config.textFontSize!;
    const titleTopPos = titleFontSize * this.#config.textLineHeight! + this.#config.documentMarginTop!;
    const titleLeftPos = this.#config.documentWidth! - this.#config.documentMarginRight!;

    return this.addText(output, this.prettyName, titleFontSize, "end", titleTopPos, titleLeftPos);
  }

  private addCopyright(output: OutputType): Element | string {
    const fontSize = this.#config.textFontSize! * this.#copyrightSizeFactor;
    const topPos = this.height - this.#config.documentMarginBottom!;
    const leftPos = this.#config.documentMarginLeft!;

    return this.addText(output, this.#copyRightText, fontSize, "start", topPos, leftPos);
  }

  protected generateGridName(type: "pretty" | "file"): string {
    const separator = type === "pretty" ? " " : "_";
    const name = `grid${separator}page`;
    return `${name}`;
  }

  private createDocument(output: OutputType): SVGElement | string {
    if (output === "dom") {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const viewBox = `0 0 ${this.width} ${this.height}`;
      svg.setAttribute("viewBox", viewBox);
      svg.setAttribute("id", this.generateUniqueId("grid-page"));
      return svg;
    } else {
      const svgString = `
        <svg 
          viewBox="0 0 ${this.width} ${this.height}" 
          id="${this.generateUniqueId("grid-page")}"
        >`;
      return svgString;
    }
  }

  private addMask(output: OutputType): Element | string {
    const maskId = this.generateUniqueId("mask");
    this.maskId = maskId;
    if (output === "dom") {
      const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
      mask.setAttribute("id", maskId);
      const rectangle = this.addRectangle("dom", "white", "black");
      mask.appendChild(rectangle as Element);
      return mask;
    } else {
      return /*html*/ `
        <mask id="${maskId}">
          ${this.addRectangle("string", "white", "black")}
        </mask>
      `;
    }
  }

  private addRectangle(output: OutputType, fillColor: string, strokeColor: string): Element | string {
    if (output === "dom") {
      const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rectangle.setAttribute("x", this.marginLeft.toString());
      rectangle.setAttribute("y", this.marginTop.toString());
      rectangle.setAttribute("width", this.gridWidth.toString());
      rectangle.setAttribute("height", this.gridHeight.toString());
      rectangle.setAttribute("rx", this.#config.areaBorderRadius!.toString());
      rectangle.setAttribute("fill", fillColor);
      rectangle.setAttribute("stroke-width", this.#config.areaStrokeWidth!.toString());
      rectangle.setAttribute("stroke", strokeColor);
      return rectangle;
    } else {
      return /*html*/ `
        <rect
          x="${this.marginLeft}"
          y="${this.marginTop}"
          width="${this.gridWidth}"
          height="${this.gridHeight}"
          rx="${this.#config.areaBorderRadius}"
          fill="${fillColor}"
          stroke-width="${this.#config.areaStrokeWidth}"
          stroke="${strokeColor}"
        />
      `;
    }
  }

  private addText(
    output: OutputType,
    text: string,
    fontSize: number,
    textAnchor: "start" | "end",
    topPos: number,
    leftPos: number
  ): Element | string {
    if (output === "dom") {
      const textString = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textString.textContent = text;
      textString.setAttribute("x", leftPos.toString());
      textString.setAttribute("y", topPos.toString());
      textString.setAttribute("text-anchor", textAnchor);
      textString.setAttribute("font-size", fontSize.toString());
      textString.setAttribute("fill", this.#fontColor);
      textString.setAttribute("font-family", "Arial, sans-serif");
      return textString;
    } else {
      return /*html*/ `
          <text
            x="${leftPos}"
            y="${topPos}"
            text-anchor="${textAnchor}"
            font-size="${fontSize}"
            fill="${this.#fontColor}"
            font-family="Arial, sans-serif"
          >
            ${text}
          </text>
        `;
    }
  }
}
