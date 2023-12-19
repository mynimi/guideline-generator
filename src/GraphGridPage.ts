import { GridPage, GridPageBasicOtions, GridPageConfig, GridPageTechnicalOptions, GridPageExtendedOptions, RequiredFields } from "./GridPage";

export interface GraphGridPageBasicOptions extends GridPageBasicOtions {
  lineColor?: string;
  cellSize?:number;
}

export interface GraphGridPageExtendedOptions extends GridPageExtendedOptions {
  gridStrokeWidth?:number;
}

export interface GraphGridPageTechOptions extends GridPageTechnicalOptions {}

export type GraphGridPageConfig = GraphGridPageBasicOptions & GraphGridPageExtendedOptions & GraphGridPageTechOptions;

export class GraphGridPage extends GridPage {
  #defaults: RequiredFields<GraphGridPageConfig>;
  #config: RequiredFields<GraphGridPageConfig>;
  readonly #svg:SVGElement;
  readonly #maskId:string;

  constructor(options: Partial<GraphGridPageConfig> = {}) {
    super(options);
    const parentDefaults = this.defaultValues;
    this.#defaults = {
      ...parentDefaults,
      lineColor: parentDefaults.color,
      gridStrokeWidth: parentDefaults.stroke,
      cellSize: 5,
    }
    this.#svg = this.svgElement;
    this.#maskId = this.maskId;
    this.#config = { ...this.#defaults, ...options };
    if ('color' in options) {
      this.#config.lineColor = options.color;
    }
    if('stroke' in options){
      this.#config.gridStrokeWidth = options.stroke;
    }
    this.drawGraphGrid();
  }

  private drawGraphGrid(): void {
    const cellSize = this.#config.cellSize!;
    const xEnd = this.width - this.marginRight;
    const yEnd = this.height - this.marginBottom;
    const horizontalReps = this.gridHeight / cellSize;
    const horizontalRemainder = this.gridHeight % cellSize;
    const verticalReps = this.gridWidth / cellSize;
    const verticalRemainder = this.gridWidth % cellSize;

    const gridParent = this.createGroup("grid","calli-grid",this.#maskId ? this.#maskId : undefined);

    let yLineStart = this.marginTop + horizontalRemainder / 2;
    for (let i = 0; i <= horizontalReps; i++) {
      this.drawLine(gridParent, "horizontal", yLineStart, this.marginLeft, xEnd, this.#config.lineColor, this.#config.gridStrokeWidth);
      yLineStart += cellSize;
    }

    let xLineStart = this.marginLeft + verticalRemainder / 2;
    for (let i = 0; i <= verticalReps; i++) {
      this.drawLine(gridParent, "vertical", xLineStart, this.marginTop, yEnd, this.#config.lineColor, this.#config.gridStrokeWidth);
      xLineStart += cellSize;
    }

    this.#svg.appendChild(gridParent);
  }

  override generateGridName(type: 'pretty' | 'file'): string {
    const separator = type === 'pretty' ? ' ' : '_';
    const name = `graph${separator}grid${separator}page`;
    return `${name}`;
  }
}
