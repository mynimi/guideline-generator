import {GridMaker, type GridPageBasicOptions, type GridPageExtendedOptions, type GridPageTechnicalOptions, type OutputType, type RequiredFields} from "./GridMaker";

export interface DotGridPageBasicOptions extends GridPageBasicOptions {
  lineColor?: string;
  cellSize?: number;
}

export interface DotGridPageExtendedOptions extends GridPageExtendedOptions {
  dotSize?: number;
}

export interface DotGridPageTechOptions extends GridPageTechnicalOptions {}

export type DotGridPageConfig = DotGridPageBasicOptions & DotGridPageExtendedOptions & DotGridPageTechOptions;

export class DotGridPage extends GridMaker {
  #defaults: RequiredFields<DotGridPageConfig>;
  #config: RequiredFields<DotGridPageConfig>;
  #prettyName: string;
  #fileName: string;

  constructor(options: Partial<DotGridPageConfig> = {}) {
    super(options);
    const parentDefaults = this.defaultValues;
    this.#defaults = {
      ...parentDefaults,
      lineColor: parentDefaults.color,
      dotSize: 0.4,
      cellSize: 5,
    };
    if ("color" in options) {
      this.#defaults.lineColor = options.color || this.#defaults.lineColor;
    }
    if ("stroke" in options) {
      this.#defaults.dotSize = options.stroke || this.#defaults.dotSize;
    }
    this.#config = { ...this.#defaults, ...options };
    this.#prettyName = this.generateName("pretty");
    this.#fileName = this.generateName("file");

    super.fileName = this.#fileName;
    super.prettyName = this.#prettyName;
  }

  makeSVG(): SVGElement {
    const svg = super.makeSVG();
    svg.appendChild(this.addDotGrid("dom") as Element);
    return svg;
  }

  makeSVGString(): string {
    let svgString = super.makeSVGString(false);
    svgString += this.addDotGrid("string");
    svgString += "</svg>";
    return svgString;
  }

  private addDotGrid(output: OutputType): Element | string {
    const cellSize = this.#config.cellSize!;
    const horizontalReps = this.gridHeight / cellSize;
    const horizontalRemainder = this.gridHeight % cellSize;
    const verticalReps = this.gridWidth / cellSize;
    const verticalRemainder = this.gridWidth % cellSize;
    const horizontalIntersections: number[] = [];
    const verticalIntersections: number[] = [];

    let yLineStart = this.marginTop + horizontalRemainder / 2;
    for (let i = 0; i <= horizontalReps; i++) {
      horizontalIntersections.push(yLineStart);
      yLineStart += cellSize;
    }
    
    let xLineStart = this.marginLeft + verticalRemainder / 2;
    for (let i = 0; i <= verticalReps; i++) {
      verticalIntersections.push(xLineStart);
      xLineStart += cellSize;
    }

    let gridParent = this.createGroup(output, "grid", "calli-grid", this.maskId ? this.maskId : undefined);
    
    for(const horizontalPoint of horizontalIntersections) {
      for(const verticalPoint of verticalIntersections) {
        if (output === "dom") {
          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", this.formatCoordinate(verticalPoint).toString());
          dot.setAttribute("cy", this.formatCoordinate(horizontalPoint).toString());
          dot.setAttribute("r", (this.#config.dotSize! / 2).toString());
          dot.setAttribute("fill", this.#config.lineColor!);
          (gridParent as Element).appendChild((dot as Element));
        } else {
          const dot = `<circle cx="${this.formatCoordinate(verticalPoint)}" cy="${this.formatCoordinate(horizontalPoint)}" r="${(this.#config.dotSize! / 2)}" fill="${this.#config.lineColor!}" />`;
          gridParent += dot;
        }
      }
    }
    if(output === "string") {
      gridParent += "</g>";
    }
    return gridParent;
  }

  private generateName(type: "pretty" | "file"): string {
    const separator = type === "pretty" ? " " : "_";
    const name = `dot${separator}grid${separator}${this.#config.cellSize!}mm`;
    return `${name}`;
  }
}
