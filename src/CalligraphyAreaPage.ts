import { GridPage, GridPageBasicOtions, GridPageTechnicalOptions, GridPageExtendedOptions, RequiredFields } from "./GridPage";

export interface CalligraphyAreaPageBasicOptions extends GridPageBasicOtions {
  lineColor?: string;
  xHeight?:number;
  slantAngle?:number;
}

export interface CalligraphyAreaPageExtendedOptions extends GridPageExtendedOptions {
  gridStrokeWidth?:number;
  areaBlockBuffer?:number;
  slantAngleGap?:number;
  addDividerLines?:boolean;
}

export interface CalligraphyAreaPageTechOptions extends GridPageTechnicalOptions {}

export type CalligraphyAreaPageConfig = CalligraphyAreaPageBasicOptions & CalligraphyAreaPageExtendedOptions & CalligraphyAreaPageTechOptions;

export class CalligraphyAreaPage extends GridPage {
  #defaults: RequiredFields<CalligraphyAreaPageConfig>;
  #config: RequiredFields<CalligraphyAreaPageConfig>;
  #prettyName:string;
  #fileName:string;

  constructor(options: Partial<CalligraphyAreaPageConfig> = {}) {
    super(options);
    const parentDefaults = this.defaultValues;
    this.#defaults = {
      ...parentDefaults,
      lineColor: parentDefaults.color,
      gridStrokeWidth: parentDefaults.stroke,
      xHeight:7,
      slantAngle:45,
      slantAngleGap:10,    
      areaBlockBuffer: 7,
      addDividerLines:true,
    }
    this.#config = { ...this.#defaults, ...options };
    if ('color' in options) {
      this.#config.lineColor = options.color;
    }
    if('stroke' in options){
      this.#config.gridStrokeWidth = options.stroke;
    }
    this.#prettyName = this.generateName("pretty");
    this.#fileName = this.generateName('file');

    super.fileName = this.#fileName;
    super.prettyName = this.#prettyName;
    super.init();
    this.drawCalligraphyArea();
    this.removeLinesOutsideMask(this.maskId);
  }

  private drawCalligraphyArea():void {
    const xHeight = this.#config.xHeight;
    const horizontalReps = this.gridHeight / xHeight;
    const horizontalRemainder = this.gridHeight % xHeight;
    const lineStart = this.marginLeft;
    const lineEnd = this.width - this.marginLeft;
    const color = this.#config.lineColor;
    const stroke = this.#config.gridStrokeWidth;
    const dotSize = this.#config.gridStrokeWidth * 1.3;
    const dotGap = this.#config.gridStrokeWidth * 2;

    const gridParent = this.createGroup("grid","calli-grid",this.maskId ? this.maskId : undefined);

    const horizontalLines = this.createGroup("horizontal-lines");
    
    let yLineStart = this.marginTop + horizontalRemainder / 2;
    for (let i = 0; i <= horizontalReps; i++) {
      this.drawSolidLine(horizontalLines, "horizontal", yLineStart, lineStart, lineEnd, color, stroke);
      if(this.#config.addDividerLines){
        const gridPos = yLineStart + xHeight / 2;
        this.drawDottedLine(horizontalLines, 'horizontal',  gridPos, lineStart, lineEnd, dotSize, dotGap, color);
      }
      yLineStart += xHeight;
    }
    const slantLines = this.createGroup("slant-lines");
    const slantGap = this.#config.slantAngleGap;
    const slantReps = this.gridWidth / slantGap;

    // were currently just drawing the lines left and right in the width of the width and then cleanup later.
    let posXRight = this.marginLeft;
    for(let i = 0; i <= slantReps; i++){
      this.drawSlantLine(slantLines, this.gridHeight, this.#config.slantAngle, posXRight, this.height - this.marginBottom, color, stroke)
      posXRight += slantGap;
    }
    
    let posXLeft = this.marginLeft;
    for(let i = 0; i <= slantReps; i++){
      this.drawSlantLine(slantLines, this.gridHeight, this.#config.slantAngle, posXLeft, this.height - this.marginBottom, color, stroke);
      posXLeft -= slantGap;
    }

    gridParent.appendChild(horizontalLines);
    gridParent.appendChild(slantLines);
    this.svgElement.appendChild(gridParent);
  }

  removeLinesOutsideMask(maskId: string): void {
    const svg = document.querySelector('svg'); // Replace this with your actual SVG element selection method
    const maskRect = svg.querySelector(`#${maskId} > rect`) as SVGRectElement; // Assuming the mask is a rect element
  
    // Get mask dimensions
    const maskX = parseFloat(maskRect.getAttribute('x') || '0');
    const maskY = parseFloat(maskRect.getAttribute('y') || '0');
    const maskWidth = parseFloat(maskRect.getAttribute('width') || '0');
    const maskHeight = parseFloat(maskRect.getAttribute('height') || '0');
  
    // Find lines to check against the mask
    const linesToCheck = Array.from(svg.querySelectorAll('line')); // Selecting only line elements
  
    // Remove lines that are entirely outside the mask
    linesToCheck.forEach((line: SVGLineElement) => {
      const x1 = parseFloat(line.getAttribute('x1') || '0');
      const y1 = parseFloat(line.getAttribute('y1') || '0');
      const x2 = parseFloat(line.getAttribute('x2') || '0');
      const y2 = parseFloat(line.getAttribute('y2') || '0');
  
      // Check if both line endpoints are entirely outside the mask boundaries
      const bothPointsOutside = (
        (x1 < maskX && x2 < maskX) ||
        (x1 > maskX + maskWidth && x2 > maskX + maskWidth) ||
        (y1 < maskY && y2 < maskY) ||
        (y1 > maskY + maskHeight && y2 > maskY + maskHeight)
      );
  
      if (bothPointsOutside) {
        line.remove(); // Remove the line if both points are outside the mask boundaries
      }
    });
  }
  
  simulateSlantLine(height:number, angle:number, startPosX:number, startPosY:number){
    const xEnd = startPosX + height / Math.tan((angle * Math.PI) / 180);
    const yEnd = startPosY - height;

    return {      
      x1: this.formatCoordinate(startPosX),
      y1: this.formatCoordinate(startPosY),
      x2: this.formatCoordinate(xEnd),
      y2: this.formatCoordinate(yEnd),
    }
  }

  private generateName(type: 'pretty' | 'file'): string {
    const angleLabel = type === 'pretty' ? '°' : 'deg';
    const separator = type === 'pretty' ? ' ' : '_';
  
    const angle = `${this.#config.slantAngle}${angleLabel}`;
    const xHeight = `${this.#config.xHeight}mm`;
  
    return `${angle}${separator}${xHeight}`;
  }
}