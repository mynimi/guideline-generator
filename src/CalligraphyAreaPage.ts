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
      slantAngle:55,
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

    // draw a faux line from bottom left corner upwards
    const middleSlant = this.simulateSlantLine(this.gridHeight, this.#config.slantAngle, this.marginLeft, this.height - this.marginBottom);
    console.log(middleSlant);
    const topIntersectionPoint = middleSlant.x2;
    const leftSide = this.gridWidth - topIntersectionPoint;
    const rightSide = this.gridWidth - leftSide;
    console.log('left:', leftSide);
    console.log('right:',rightSide);
    
    console.log('total', leftSide + rightSide);
    console.log(this.gridWidth);
    console.log(topIntersectionPoint);
    
    const rightWidth = this.gridWidth - topIntersectionPoint;

    const slantGap = this.#config.slantAngleGap;
    const slantReps = this.gridWidth / slantGap;
    
    let posXRight = this.marginLeft;
    for(let i = 0; i <= slantReps; i++){
      this.drawSlantLine(slantLines, this.gridHeight, this.#config.slantAngle, posXRight, this.height - this.marginBottom, 'red', 1)
      posXRight += slantGap;
    }
    
    let posXLeft = this.marginLeft;
    for(let i = 0; i <= slantReps; i++){
      this.drawSlantLine(slantLines, this.gridHeight, this.#config.slantAngle, posXLeft, this.height - this.marginBottom, 'blue', 1)
      posXLeft -= slantGap;
    }
    
    this.drawSlantLine(slantLines, this.gridHeight, this.#config.slantAngle, this.marginLeft, this.height - this.marginBottom, 'green', 1)

    gridParent.appendChild(horizontalLines);
    gridParent.appendChild(slantLines);
    this.svgElement.appendChild(gridParent);
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