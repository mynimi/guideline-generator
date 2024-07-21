import {
  GridPage,
  type GridPageBasicOptions,
  type GridPageTechnicalOptions,
  type GridPageExtendedOptions,
  type RequiredFields,
} from "./GridPage";

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

export class CalligraphyLinePage extends GridPage {
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
      this.#defaults.lineColor = options.color;
    }
    if ("stroke" in options) {
      this.#defaults.gridStrokeWidth = options.stroke;
    }
    this.#config = { ...this.#defaults, ...options };
    this.#prettyName = this.generateName("pretty");
    this.#fileName = this.generateName("file");

    super.fileName = this.#fileName;
    super.prettyName = this.#prettyName;
    super.init();
    this.drawCalligraphyLines();
  }

  private drawCalligraphyLines(): void {
    const gridParent = this.createGroup("grid", "calli-grid", this.maskId ? this.maskId : undefined);
    const buffer = this.#config.addAreaBox ? this.#config.areaBlockBuffer : 0;
    const height = this.gridHeight - buffer * 2;
    const lineReps = Math.floor(height / this.lineHeight);
    const lineGap = (height - lineReps * this.lineHeight) / (lineReps - 1);
    let yLineStart = this.marginTop + buffer;

    for (let i = 0; i < lineReps; i++) {
      this.drawCalligraphyLine(gridParent, yLineStart, this.marginLeft, this.width - this.marginRight);
      yLineStart += this.lineHeight + lineGap;
    }
    this.svgElement.appendChild(gridParent);
  }

  private drawCalligraphyLine(parentEl: SVGElement, gridPos: number, lineStart: number, lineEnd: number) {
    const { ascender: normalizedAscender, base: normalizedBase, descender: normalizedDescender } = this.normalizedRatio;
    const gridPosAscenderLine = gridPos;
    const gridPosXHeightLine = gridPosAscenderLine + this.xHeight * normalizedAscender;
    const gridPosBaseLine = gridPosXHeightLine + this.xHeight * normalizedBase;
    const gridPosDescenderLine = gridPosBaseLine + this.xHeight * normalizedDescender;

    const lineGroup = this.createGroup("line");
    this.drawLineSection(lineGroup, "ascender", gridPosAscenderLine, lineStart, lineEnd, "down");
    this.drawLineSection(lineGroup, "base", gridPosBaseLine, lineStart, lineEnd, "up");
    this.drawLineSection(lineGroup, "descender", gridPosDescenderLine, lineStart, lineEnd, "up");
    if (this.#config.slantAngle > 0) {
      this.drawSlantLines(lineGroup, gridPosDescenderLine, lineStart);
    }
    parentEl.appendChild(lineGroup);
  }

  private drawLineSection(
    parentEl: SVGElement,
    section: "ascender" | "base" | "descender",
    gridPosLine: number,
    lineStart: number,
    lineEnd: number,
    dividerDrawingDirection: "down" | "up"
  ) {
    const ratios = this.ratio;
    const dividerGap = this.xHeight / ratios["base"];
    const ratio = ratios[section];
    const color = this.#config.lineColor;
    const stroke = this.#config.gridStrokeWidth;
    const group = this.createGroup(section);
    const gridPosXHeightLine = gridPosLine - this.xHeight;
    const gridPos = section !== "base" ? gridPosLine : gridPosXHeightLine;
    this.drawSolidLine(group, "horizontal", gridPos, lineStart, lineEnd, color, stroke);
    /**
     * the base section includes the x-Height Line (first solid line, and then additionally a thicker baseline)
     * and optionally a vertical xHeight Indicator
     */
    if (section === "base") {
      this.drawSolidLine(
        group,
        "horizontal",
        gridPosLine,
        lineStart,
        lineEnd,
        color,
        this.#config.gridBaseLineStrokeWidth
      );
      if (this.#config.showXHeightIndicator) {
        this.drawSolidLine(
          group,
          "vertical",
          lineStart + this.#config.xHeightIndicatorStrokeWidth * 0.5,
          gridPosXHeightLine,
          gridPosLine,
          color,
          this.#config.xHeightIndicatorStrokeWidth
        );
      }
    }
    if (this.#config.addDividerLines) {
      for (let i = 1; i < ratio; i++) {
        const gap = dividerDrawingDirection == "down" ? dividerGap : dividerGap * -1;
        const gridPos = gridPosLine + i * gap;
        const dotRadius = this.#config.gridStrokeWidth;
        this.drawDashedLine(group, "horizontal", gridPos, lineStart, lineEnd, dotRadius, color);
      }
    }
    parentEl.appendChild(group);
  }

  private drawSlantLines(parentEl: SVGElement, gridPos: number, lineStart: number) {
    const reps = this.#config.slantLinesPerLine;
    const endPosXFinalLine = this.gridWidth;
    const startPosXFinalLine = endPosXFinalLine - this.lineHeight / Math.tan((this.#config.slantAngle * Math.PI) / 180);
    const totalWidth = startPosXFinalLine;
    let spaceBetweenRepetitions = totalWidth / (reps - 1);
    let startPosX = lineStart;
    for (let i = 0; i < reps; i++) {
      this.drawSlantLine(
        parentEl,
        this.lineHeight,
        this.#config.slantAngle,
        startPosX,
        gridPos,
        this.#config.lineColor,
        this.#config.gridStrokeWidth
      );
      startPosX += spaceBetweenRepetitions;
    }
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
