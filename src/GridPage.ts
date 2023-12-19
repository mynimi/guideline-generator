export interface GridPageBasicOtions {
  documentWidth?: number;
  documentHeight?: number;
  addAreaBox?: boolean;
  color?:string;
  stroke?:number;
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
  container?: Element;
  textFontSize?: number;
  textLineHeight?: number;
}

export type RequiredFields<T> = {[K in keyof T]-?: T[K];};

export type GridPageConfig = GridPageBasicOtions & GridPageExtendedOptions & GridPageTechnicalOptions;

export class GridPage {
  #defaults: RequiredFields<GridPageConfig>;
  #config: RequiredFields<GridPageConfig>;
  #svg:SVGElement;
  #maskId:string;
  readonly #defaultStrokeSize: number = 0.2;
  readonly #defaultStrokeColor: string = "#000000";
  readonly #copyrightSizeFactor: number = 0.7;
  readonly #textBuffer: number = 2;
  readonly #fontColor: string = "#808080";
  readonly #copyRightText: string = "© grid code.halfapx.com/guideline-generator/";

  get maskId():string {
    return this.#maskId;
  }

  get defaultValues(): RequiredFields<GridPageConfig> {
    return this.#defaults;
  }

  get svgElement(): SVGElement {
    return this.#svg;
  }

  get width(): number {
    return this.#config.documentWidth!;
  }

  get height(): number {
    return this.#config.documentHeight!;
  }

  private get textHeight(): number {
    return (
      (this.#config.textFontSize! * this.#config.textLineHeight!) +
      this.#textBuffer
    );
  }

  get marginTop(): number {
    return this.#config.addTitle!
      ? this.#config.documentMarginTop! + this.textHeight
      : this.#config.documentMarginTop!;
  }

  get marginBottom(): number {
    return (
      this.#config.documentMarginBottom! +
      this.textHeight * this.#copyrightSizeFactor
    );
  }

  get marginLeft(): number {
    return this.#config.documentMarginLeft!;
  }

  get marginRight(): number {
    return this.#config.documentMarginRight!;
  }

  get gridWidth(): number {
    return (
      this.width - this.#config.documentMarginLeft! - this.#config.documentMarginRight!
    );
  }

  get gridHeight(): number {
    return this.height - this.marginTop - this.marginBottom;
  }

  get prettyName(): string {
    return this.generateGridName("pretty");
  }

  get fileName(): string {
    return this.generateGridName("file");
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
      container: document.querySelector("[data-svg-preview]")!,
      coordinateDecimalPlaceMax: 2,
      textFontSize: 4,
      textLineHeight: 1.2,
      addTitle: true,
    };

    this.#config = {...this.#defaults, ...options};
    if ('color' in options) {
      this.#config.areaStrokeColor = options.color;
    }
    if('stroke' in options){
      this.#config.areaStrokeWidth = options.stroke;
    }
    this.init();
  }

  private init(): void {
    this.#svg = this.createDocument();
    this.addTitleAndCopyright();

    if (this.#config.addAreaBox) {
      this.#maskId = "grid-mask";
      this.drawMask();
      this.drawRectangle(this.#svg,"transparent",this.#config.areaStrokeColor!);
    }
    this.renderSVG();
  }

  renderSVG(): void {
    this.#config.container!.appendChild(this.#svg);
  }

  removeSVG(): void {
    this.#config.container!.removeChild(this.#svg);
  }

  createGroup(className?: string,idName?: string,maskId?: string): SVGElement {
    const group = document.createElementNS("http://www.w3.org/2000/svg","g");
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

  drawLine(parentEl: SVGElement,orientation: "horizontal" | "vertical",gridPos: number,lineStart: number,lineEnd: number, color:string, stroke:number): void {
    let x1, x2, y1, y2;
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
    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", this.formatCoordinate(x1).toString());
    line.setAttribute("x2", this.formatCoordinate(x2).toString());
    line.setAttribute("y1", this.formatCoordinate(y1).toString());
    line.setAttribute("y2", this.formatCoordinate(y2).toString());
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width",stroke.toString());
    parentEl.appendChild(line);
  }

  formatCoordinate(n: number): string {
    return parseFloat(n.toFixed(this.#config.coordinateDecimalPlaceMax!)).toString();
  }

  private addTitleAndCopyright(): void {
    const copyrightFontSize = this.#config.textFontSize! * this.#copyrightSizeFactor;
    const copyrightTopPos = this.height - this.#config.documentMarginBottom!;
    const copyrightLeftPos = this.#config.documentMarginLeft!;

    this.addTextString(
      this.#svg,
      this.#copyRightText,
      copyrightFontSize,
      "start",
      copyrightTopPos,
      copyrightLeftPos
    );

    if (this.#config.addTitle) {
      const titleFontSize = this.#config.textFontSize!;
      const titleTopPos = titleFontSize * this.#config.textLineHeight! + this.#config.documentMarginTop!;
      const titleLeftPos = this.#config.documentWidth! - this.#config.documentMarginRight!;

      this.addTextString(
        this.#svg,
        this.prettyName,
        titleFontSize,
        "end",
        titleTopPos,
        titleLeftPos
      );
    }
  }

  generateGridName(type: "pretty" | "file"): string {
    const separator = type === "pretty" ? " " : "_";
    const name = `grid${separator}page`;
    return `${name}`;
  }

  private createDocument(): SVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    const viewBox = `0 0 ${this.width} ${this.height}`;
    svg.setAttribute("viewBox", viewBox);
    return svg;
  }

  private drawRectangle(parentEl: SVGElement,fillColor: string,strokeColor: string): void {
    const rectangle = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rectangle.setAttribute("x", this.marginLeft.toString());
    rectangle.setAttribute("y", this.marginTop.toString());
    rectangle.setAttribute("width", this.gridWidth.toString());
    rectangle.setAttribute("height", this.gridHeight.toString());
    rectangle.setAttribute("rx",this.#config.areaBorderRadius!.toString());
    rectangle.setAttribute("fill",fillColor);
    rectangle.setAttribute("stroke-width",this.#config.areaStrokeWidth!.toString());
    rectangle.setAttribute("stroke",strokeColor);
    parentEl.appendChild(rectangle);
  }

  private drawMask(): void {
    const mask = document.createElementNS("http://www.w3.org/2000/svg","mask");
    mask.setAttribute("id", this.#maskId!);
    this.drawRectangle(mask, "white", "black");
    this.#svg.appendChild(mask);
  }

  private addTextString(parentEl: SVGElement,text: string,fontSize: number,textAnchor: "start" | "end",topPos: number,leftPos: number): void {
    const textString = document.createElementNS("http://www.w3.org/2000/svg","text");
    textString.textContent = text;
    textString.setAttribute("x", leftPos.toString());
    textString.setAttribute("y", topPos.toString());
    textString.setAttribute("text-anchor", textAnchor);
    textString.setAttribute("font-size", fontSize.toString());
    textString.setAttribute("fill", this.#fontColor);
    textString.setAttribute("font-family", "Arial, sans-serif");
    parentEl.appendChild(textString);
  }

}