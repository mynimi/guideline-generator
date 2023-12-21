import {GridPage, GridPageBasicOtions, GridPageTechnicalOptions, GridPageExtendedOptions, RequiredFields} from "./GridPage";

interface Point {
  x: number;
  y: number;
}

export interface CalligraphyAreaPageBasicOptions extends GridPageBasicOtions {
  lineColor?: string;
  xHeight?: number;
  slantAngle?: number;
}

export interface CalligraphyAreaPageExtendedOptions extends GridPageExtendedOptions {
  gridStrokeWidth?: number;
  slantAngleGap?: number;
  slantLineMinLength?: number;
  addDividerLines?: boolean;
}

export interface CalligraphyAreaPageTechOptions extends GridPageTechnicalOptions {}

export type CalligraphyAreaPageConfig = CalligraphyAreaPageBasicOptions &
  CalligraphyAreaPageExtendedOptions &
  CalligraphyAreaPageTechOptions;

export class CalligraphyAreaPage extends GridPage {
  #defaults: RequiredFields<CalligraphyAreaPageConfig>;
  #config: RequiredFields<CalligraphyAreaPageConfig>;
  #prettyName: string;
  #fileName: string;

  constructor(options: Partial<CalligraphyAreaPageConfig> = {}) {
    super(options);
    const parentDefaults = this.defaultValues;
    this.#defaults = {
      ...parentDefaults,
      lineColor: parentDefaults.color,
      gridStrokeWidth: parentDefaults.stroke,
      xHeight: 7,
      slantAngle: 55, // must be below 90
      slantAngleGap: 10,
      addDividerLines: true,
      slantLineMinLength: 10,
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
    this.drawCalligraphyArea();
  }

  private drawCalligraphyArea(): void {
    const xHeight = this.#config.xHeight;
    const horizontalReps = this.gridHeight / xHeight;
    const horizontalRemainder = this.gridHeight % xHeight;
    const lineStart = this.marginLeft;
    const lineEnd = this.width - this.marginLeft;
    const color = this.#config.lineColor;
    const stroke = this.#config.gridStrokeWidth;
    const dotSize = this.#config.gridStrokeWidth;
    const rectCenterX = this.marginLeft + this.gridWidth / 2;
    const rectCenterY = this.marginTop + this.gridHeight / 2;
    const rectDiagonal = Math.sqrt(Math.pow(this.gridWidth, 2) + Math.pow(this.gridHeight, 2));
    const lineAngle = 180 - this.#config.slantAngle;
    const slantSpacing = this.#config.slantAngleGap;
    // we're using the diagonal length as a basis to ensure we cover the entire area with our function
    const slantReps = rectDiagonal / slantSpacing;

    const gridParent = this.createGroup("grid", "calli-grid", this.maskId ? this.maskId : undefined);

    const horizontalLines = this.createGroup("horizontal-lines");

    let yLineStart = this.marginTop + horizontalRemainder / 2;
    for (let i = 0; i <= horizontalReps; i++) {
      this.drawSolidLine(horizontalLines, "horizontal", yLineStart, lineStart, lineEnd, color, stroke);
      if (this.#config.addDividerLines) {
        const gridPos = yLineStart + xHeight / 2;
        this.drawDashedLine(horizontalLines, "horizontal", gridPos, lineStart, lineEnd, dotSize, color);
      }
      yLineStart += xHeight;
    }
    gridParent.appendChild(horizontalLines);

    const slantLines = this.createGroup("slant-lines");
    const angleRad = (lineAngle * Math.PI) / 180;
    const centerLineLength = rectDiagonal / 2;
    let lineStartX = rectCenterX - centerLineLength * Math.cos(angleRad);
    let lineStartY = rectCenterY - centerLineLength * Math.sin(angleRad);
    let lineEndX = rectCenterX + centerLineLength * Math.cos(angleRad);
    let lineEndY = rectCenterY + centerLineLength * Math.sin(angleRad);

    this.drawLineWithinArea(
      slantLines,
      lineStartX,
      lineStartY,
      lineEndX,
      lineEndY,
      this.#config.lineColor,
      this.#config.gridStrokeWidth
    );

    let distance = slantSpacing;
    for (let i = 0; i < slantReps; i++) {
      // draw lines to the left and right of center line
      this.createParallelLine(
        gridParent,
        lineStartX,
        lineStartY,
        lineEndX,
        lineEndY,
        distance,
        this.#config.lineColor,
        this.#config.gridStrokeWidth,
        this.#config.slantLineMinLength
      );
      this.createParallelLine(
        gridParent,
        lineStartX,
        lineStartY,
        lineEndX,
        lineEndY,
        distance * -1,
        this.#config.lineColor,
        this.#config.gridStrokeWidth,
        this.#config.slantLineMinLength
      );
      distance += slantSpacing;
    }
    gridParent.appendChild(slantLines);

    this.svgElement.appendChild(gridParent);
  }

  generateParallelCoordinates(x1: number, y1: number, x2: number, y2: number, distance: number): { x1: number; y1: number; x2: number; y2: number } {
    // Calculate offsets for the new line based on the distance provided
    const xOffset = distance;

    // Calculate new coordinates for the parallel line along the X-axis
    const newX1 = x1 + xOffset;
    const newY1 = y1;
    const newX2 = x2 + xOffset;
    const newY2 = y2;

    return { x1: newX1, y1: newY1, x2: newX2, y2: newY2 };
  }

  drawLine(parentEl: SVGElement, x1: number, y1: number, x2: number, y2: number, color: string, stroke: number) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    line.setAttribute("stroke", color); // Change the line color as needed
    line.setAttribute("stroke-width", stroke.toString());
    parentEl.appendChild(line);
  }

  drawLineWithinArea(parentEl: SVGElement, x1: number, y1: number, x2: number, y2: number, color: string, stroke: number, maxLength?: number) {
    const intersectionPoints = this.calculateIntersectionPoints(x1, y1, x2, y2); // Corrected parameter order

    if (intersectionPoints.length > 0) {
      // Trim the line to start and end at the intersection points
      let trimmedX1 = x1;
      let trimmedY1 = y1;
      let trimmedX2 = x2;
      let trimmedY2 = y2;

      if (intersectionPoints.length >= 2) {
        trimmedX1 = intersectionPoints[0].x;
        trimmedY1 = intersectionPoints[0].y;
        trimmedX2 = intersectionPoints[1].x;
        trimmedY2 = intersectionPoints[1].y;
      }

      const trimmedLineLength = Math.sqrt((trimmedX2 - trimmedX1) ** 2 + (trimmedY2 - trimmedY1) ** 2);

      let lineColor = color;
      if (maxLength) {
        if (trimmedLineLength > maxLength) {
          this.drawLine(parentEl, trimmedX1, trimmedY1, trimmedX2, trimmedY2, lineColor, stroke);
        }
      } else {
        this.drawLine(parentEl, trimmedX1, trimmedY1, trimmedX2, trimmedY2, lineColor, stroke);
      }
    }
  }

  createParallelLine(parentEl, x1, y1, x2, y2, distance, color, stroke, maxLength) {
    const { x1: newX1, y1: newY1, x2: newX2, y2: newY2 } = this.generateParallelCoordinates(x1, y1, x2, y2, distance);
    this.drawLineWithinArea(parentEl, newX1, newY1, newX2, newY2, color, stroke, maxLength);
  }

  calculateIntersectionPoints(lineX1: number, lineY1: number, lineX2: number, lineY2: number): Point[] {
    const rectX = this.marginLeft;
    const rectY = this.marginTop;
    const rectWidth = this.gridWidth;
    const rectHeight = this.gridHeight;

    const slope = (lineY2 - lineY1) / (lineX2 - lineX1);
    const yIntercept = lineY1 - slope * lineX1;
    const isInsideRectangle = (x, y) => x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
    const topIntersectionX = (rectY - yIntercept) / slope;
    const bottomIntersectionX = (rectY + rectHeight - yIntercept) / slope;
    const leftIntersectionY = slope * rectX + yIntercept;
    const rightIntersectionY = slope * (rectX + rectWidth) + yIntercept;

    const intersectionPoints:Point[] = [];

    if (isInsideRectangle(topIntersectionX, rectY)) {
      intersectionPoints.push({ x: topIntersectionX, y: rectY });
    }
    if (isInsideRectangle(bottomIntersectionX, rectY + rectHeight)) {
      intersectionPoints.push({ x: bottomIntersectionX, y: rectY + rectHeight });
    }
    if (isInsideRectangle(rectX, leftIntersectionY)) {
      intersectionPoints.push({ x: rectX, y: leftIntersectionY });
    }
    if (isInsideRectangle(rectX + rectWidth, rightIntersectionY)) {
      intersectionPoints.push({ x: rectX + rectWidth, y: rightIntersectionY });
    }
    return intersectionPoints;
  }

  private generateName(type: "pretty" | "file"): string {
    const angleLabel = type === "pretty" ? "°" : "deg";
    const separator = type === "pretty" ? " " : "_";

    const angle = `${this.#config.slantAngle}${angleLabel}`;
    const xHeight = `${this.#config.xHeight}mm`;

    return `${angle}${separator}${xHeight}`;
  }
}
