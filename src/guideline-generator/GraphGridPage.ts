import {
  GridPage,
  type GridPageBasicOptions,
  type GridPageTechnicalOptions,
  type GridPageExtendedOptions,
  type RequiredFields,
} from "./GridPage";

export interface GraphGridPageBasicOptions extends GridPageBasicOptions {
  lineColor?: string;
  cellSize?: number;
}

export interface GraphGridPageExtendedOptions extends GridPageExtendedOptions {
  gridStrokeWidth?: number;
}

export interface GraphGridPageTechOptions extends GridPageTechnicalOptions {}

export type GraphGridPageConfig = GraphGridPageBasicOptions & GraphGridPageExtendedOptions & GraphGridPageTechOptions;

export class GraphGridPage extends GridPage {
  #defaults: RequiredFields<GraphGridPageConfig>;
  #config: RequiredFields<GraphGridPageConfig>;
  #prettyName: string;
  #fileName: string;

  constructor(options: Partial<GraphGridPageConfig> = {}) {
    super(options);
    const parentDefaults = this.defaultValues;
    this.#defaults = {
      ...parentDefaults,
      lineColor: parentDefaults.color,
      gridStrokeWidth: parentDefaults.stroke,
      cellSize: 5,
    };
    if ("color" in options) {
      this.#defaults.lineColor = options.color || this.#defaults.lineColor;
    }
    if ("stroke" in options) {
      this.#defaults.gridStrokeWidth = options.stroke || this.#defaults.gridStrokeWidth;
    }
    this.#config = { ...this.#defaults, ...options };
    this.#prettyName = this.generateName("pretty");
    this.#fileName = this.generateName("file");

    super.fileName = this.#fileName;
    super.prettyName = this.#prettyName;
    super.init();
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

    const gridParent = this.createGroup("grid", "calli-grid", this.maskId ? this.maskId : undefined);

    let yLineStart = this.marginTop + horizontalRemainder / 2;
    for (let i = 0; i <= horizontalReps; i++) {
      this.drawSolidLine(
        gridParent,
        "horizontal",
        yLineStart,
        this.marginLeft,
        xEnd,
        this.#config.lineColor,
        this.#config.gridStrokeWidth
      );
      yLineStart += cellSize;
    }

    let xLineStart = this.marginLeft + verticalRemainder / 2;
    for (let i = 0; i <= verticalReps; i++) {
      this.drawSolidLine(
        gridParent,
        "vertical",
        xLineStart,
        this.marginTop,
        yEnd,
        this.#config.lineColor,
        this.#config.gridStrokeWidth
      );
      xLineStart += cellSize;
    }

    this.svgElement!.appendChild(gridParent);
  }

  private generateName(type: "pretty" | "file"): string {
    const separator = type === "pretty" ? " " : "_";
    const name = `graph${separator}${this.#config.cellSize!}mm`;
    return `${name}`;
  }
}
