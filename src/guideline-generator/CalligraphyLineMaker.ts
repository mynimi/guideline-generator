import {
  GridMaker,
  type GridPageBasicOptions,
  type GridPageExtendedOptions,
  type GridPageTechnicalOptions,
  type OutputType,
  type RequiredFields,
} from "./GridMaker";

export interface CalligraphyLinePageBasicOptions extends GridPageBasicOptions {
  lineColor?: string;
  xHeight?: number;
  ratioAscender?: number;
  ratioBase?: number;
  ratioDescender?: number;
  slantAngle?: number;
}

export interface CalligraphyLinePageExtendedOptions extends GridPageExtendedOptions {
  gridStrokeWidth?: number;
  gridBaseLineStrokeWidth?: number;
  areaBlockBuffer?: number;
  showXHeightIndicator?: boolean;
  xHeightIndicatorStrokeWidth?: number;
  slantLinesPerLine?: number;
  addDividerLines?: boolean;
}

export interface CalligraphyLinePageTechOptions extends GridPageTechnicalOptions {}

export type CalligraphyLinePageConfig = CalligraphyLinePageBasicOptions &
  CalligraphyLinePageExtendedOptions &
  CalligraphyLinePageTechOptions;

export class CalligraphyLinePage extends GridMaker {
  #defaults: RequiredFields<CalligraphyLinePageConfig>;
  #config: RequiredFields<CalligraphyLinePageConfig>;
  #prettyName: string;
  #fileName: string;

  get lineHeight(): number {
    const { ascender, base, descender } = this.normalizedRatio;
    return this.xHeight * (ascender + base + descender);
  }

  get xHeight(): number {
    return this.#config.xHeight;
  }

  get ratio(): { ascender: number; base: number; descender: number } {
    return {
      ascender: this.#config.ratioAscender,
      base: this.#config.ratioBase,
      descender: this.#config.ratioDescender,
    };
  }

  get normalizedRatio(): { ascender: number; base: number; descender: number } {
    const normalizationFactor = 1 / this.#config.ratioBase;
    return {
      ascender: this.#config.ratioAscender * normalizationFactor,
      base: 1,
      descender: this.#config.ratioDescender * normalizationFactor,
    };
  }

  constructor(options: Partial<CalligraphyLinePageConfig> = {}) {
    super(options);
    const parentDefaults = this.defaultValues;
    this.#defaults = {
      ...parentDefaults,
      lineColor: parentDefaults.color,
      gridStrokeWidth: parentDefaults.stroke,
      gridBaseLineStrokeWidth: 0.5,
      xHeight: 7,
      ratioAscender: 3,
      ratioBase: 2,
      ratioDescender: 3,
      slantAngle: 55,
      showXHeightIndicator: true,
      xHeightIndicatorStrokeWidth: 2,
      slantLinesPerLine: 10,
      areaBlockBuffer: 7,
      addDividerLines: true,
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
  }

  makeSVG(): SVGElement {
    const svg = super.makeSVG();
    svg.appendChild(this.addCalligraphyLines("dom") as Element);
    return svg;
  }

  makeSVGString(): string {
    let svgString = super.makeSVGString(false);
    svgString += this.addCalligraphyLines("string");
    svgString += "</svg>";
    return svgString;
  }

  private addCalligraphyLines(output: OutputType): Element | string {
    let gridParent = this.createGroup(output, "grid", "calli-grid", this.maskId ? this.maskId : undefined);
    const buffer = this.#config.addAreaBox ? this.#config.areaBlockBuffer : 0;
    const height = this.gridHeight - buffer * 2;
    const lineReps = Math.floor(height / this.lineHeight);
    const lineGap = (height - lineReps * this.lineHeight) / (lineReps - 1);
    let yLineStart = this.marginTop + buffer;

    for (let i = 0; i < lineReps; i++) {
      let line = this.addCalligraphyLine(output, yLineStart, this.marginLeft, this.width - this.marginRight);
      if (output === "dom") {
        (gridParent as Element).appendChild(line as Element);
      } else {
        (gridParent as string) += line as string;
      }
      yLineStart += this.lineHeight + lineGap;
    }

    if (output === "string") {
      gridParent += "</g>";
    }

    return gridParent;
  }

  private addCalligraphyLine(
    output: OutputType,
    gridPos: number,
    lineStart: number,
    lineEnd: number
  ): Element | string {
    const { ascender: normalizedAscender, base: normalizedBase, descender: normalizedDescender } = this.normalizedRatio;
    const gridPosAscenderLine = gridPos;
    const gridPosXHeightLine = gridPosAscenderLine + this.xHeight * normalizedAscender;
    const gridPosBaseLine = gridPosXHeightLine + this.xHeight * normalizedBase;
    const gridPosDescenderLine = gridPosBaseLine + this.xHeight * normalizedDescender;

    let lineGroup = this.createGroup(output, "line");
    const ascender = this.addLineSection(output, "ascender", gridPosAscenderLine, lineStart, lineEnd, "down");
    if (output === "dom") {
      (lineGroup as Element).appendChild(ascender as Element);
    } else {
      (lineGroup as string) += ascender as string;
    }
    const base = this.addLineSection(output, "base", gridPosBaseLine, lineStart, lineEnd, "up");
    if (output === "dom") {
      (lineGroup as Element).appendChild(base as Element);
    } else {
      (lineGroup as string) += base as string;
    }
    const descender = this.addLineSection(output, "descender", gridPosDescenderLine, lineStart, lineEnd, "up");
    if (output === "dom") {
      (lineGroup as Element).appendChild(descender as Element);
    } else {
      (lineGroup as string) += descender as string;
    }
    if (this.#config.slantAngle > 0) {
      const slantLines = this.addSlantLines(output, gridPosDescenderLine, lineStart);
      if (output === "dom") {
        (lineGroup as Element).appendChild(slantLines as Element);
      } else {
        (lineGroup as string) += slantLines as string;
      }
    }
    if (output === "string") {
      lineGroup += "</g>";
    }
    return lineGroup;
  }

  private addSlantLines(output: OutputType, gridPos: number, lineStart: number): Element | string {
    let slantGroup = this.createGroup(output, "slant-lines");
    const reps = this.#config.slantLinesPerLine;
    const endPosXFinalLine = this.gridWidth;
    const startPosXFinalLine = endPosXFinalLine - this.lineHeight / Math.tan((this.#config.slantAngle * Math.PI) / 180);
    const totalWidth = startPosXFinalLine;
    let spaceBetweenRepetitions = totalWidth / (reps - 1);
    let startPosX = lineStart;
    for (let i = 0; i < reps; i++) {
      const slantLine = this.drawSlantLine(
        output,
        this.lineHeight,
        this.#config.slantAngle,
        startPosX,
        gridPos,
        this.#config.lineColor,
        this.#config.gridStrokeWidth
      );
      if (output === "dom") {
        (slantGroup as Element).appendChild(slantLine as Element);
      } else {
        (slantGroup as string) += slantLine as string;
      }
      startPosX += spaceBetweenRepetitions;
    }
    if (output === "string") {
      slantGroup += "</g>";
    }
    return slantGroup;
  }

  private addLineSection(
    output: OutputType,
    section: "ascender" | "base" | "descender",
    gridPosLine: number,
    lineStart: number,
    lineEnd: number,
    dividerDrawingDirection: "down" | "up"
  ): Element | string {
    const ratios = this.ratio;
    const dividerGap = this.xHeight / ratios["base"];
    const ratio = ratios[section];
    const color = this.#config.lineColor;
    const stroke = this.#config.gridStrokeWidth;
    let group = this.createGroup(output, section);
    const gridPosXHeightLine = gridPosLine - this.xHeight;
    const gridPos = section !== "base" ? gridPosLine : gridPosXHeightLine;
    const line1 = this.drawSolidLine(output, "horizontal", gridPos, lineStart, lineEnd, color, stroke);
    if (output === "dom") {
      (group as Element).appendChild(line1 as Element);
    } else {
      (group as string) += line1 as string;
    }
    /**
     * the base section includes the x-Height Line (first solid line, and then additionally a thicker baseline)
     * and optionally a vertical xHeight Indicator
     */
    if (section === "base") {
      const baseLine = this.drawSolidLine(
        output,
        "horizontal",
        gridPosLine,
        lineStart,
        lineEnd,
        color,
        this.#config.gridBaseLineStrokeWidth
      );
      if (output === "dom") {
        (group as Element).appendChild(baseLine as Element);
      } else {
        (group as string) += baseLine as string;
      }
      if (this.#config.showXHeightIndicator) {
        const xHeightIndicator = this.drawSolidLine(
          output,
          "vertical",
          lineStart + this.#config.xHeightIndicatorStrokeWidth * 0.5,
          gridPosXHeightLine,
          gridPosLine,
          color,
          this.#config.xHeightIndicatorStrokeWidth
        );
        if (output === "dom") {
          (group as Element).appendChild(xHeightIndicator as Element);
        } else {
          (group as string) += xHeightIndicator as string;
        }
      }
    }
    if (this.#config.addDividerLines) {
      for (let i = 1; i < ratio; i++) {
        const gap = dividerDrawingDirection == "down" ? dividerGap : dividerGap * -1;
        const gridPos = gridPosLine + i * gap;
        const dotRadius = this.#config.gridStrokeWidth;
        const divider = this.drawDashedLine(output, "horizontal", gridPos, lineStart, lineEnd, dotRadius, color);
        if (output === "dom") {
          (group as Element).appendChild(divider as Element);
        } else {
          (group as string) += divider as string;
        }
      }
    }
    if (output === "string") {
      group += "</g>";
    }
    return group;
  }

  private generateName(type: "pretty" | "file"): string {
    const { ascender, base, descender } = this.ratio;
    const ratioSeparator = type === "pretty" ? ":" : "-";
    const angleLabel = type === "pretty" ? "°" : "deg";
    const separator = type === "pretty" ? " " : "_";

    const angle = `${this.#config.slantAngle}${angleLabel}`;
    const ratio = `${ascender}${ratioSeparator}${base}${ratioSeparator}${descender}`;
    const xHeight = `${this.xHeight}mm`;

    return `${angle}${separator}${ratio}${separator}${xHeight}`;
  }
}
