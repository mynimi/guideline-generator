
export function  generateFieldConfig(label, initValue, inputType, configName, additionalProps = {}) {
  return {
    label,
    initValue,
    inputType,
    configName,
    ...additionalProps,
  };
}

export function  generateBasicConfig() {
  return [
    generateFieldConfig("Document Width", "210", "number", "documentWidth"),
    generateFieldConfig("Document Height", "297", "number", "documentHeight"),
    generateFieldConfig("Color", "#000000", "color", "color"),
    generateFieldConfig("Stroke", "1", "number", "stroke", { step: 0.1 }),
    generateFieldConfig("Add Area Box", true, "checkbox", "addAreaBox"),
  ];
}

export function  generateBalancedConfig() {
  const basicConfigs = generateBasicConfig();
  return [
    ...basicConfigs,
    generateFieldConfig("Document Margin Top", "10", "number", "documentMarginTop"),
    generateFieldConfig("Document Margin Bottom", "10", "number", "documentMarginBottom"),
    generateFieldConfig("Document Margin Left", "7", "number", "documentMarginLeft"),
    generateFieldConfig("Document Margin Right", "7", "number", "documentMarginRight"),
    generateFieldConfig("Area Border Radius", "5", "number", "areaBorderRadius"),
    generateFieldConfig("Area Stroke Width", "1", "number", "areaStrokeWidth", { step: 0.1 }),
    generateFieldConfig("Area Stroke Color", "#000000", "color", "areaStrokeColor"),
  ];
}

export function  generateMaximalConfig() {
  const balancedConfigs = generateBalancedConfig();
  return [...balancedConfigs, generateFieldConfig("Add Title", true, "checkbox", "addTitle")];
}

export function  generateMinimalConfigArea() {
  return [
    generateFieldConfig("Line Color", "#000000", "color", "lineColor"),
    generateFieldConfig("X Height", "7", "number", "xHeight", { min: 0 }),
    generateFieldConfig("Slant Angle", "55", "number", "slantAngle", { max: 90, min: 0, step: 1 }),
  ];
}

export function  generateBalancedConfigArea() {
  const minimalConfigs = generateMinimalConfigArea();
  return [
    ...minimalConfigs,
    generateFieldConfig("Grid Stroke Width", "parentDefaults.stroke", "number", "gridStrokeWidth", { min: 0 }),
    generateFieldConfig("Area Block Buffer", "7", "number", "areaBlockBuffer", { min: 0 }),
    generateFieldConfig("Slant Angle Gap", "10", "number", "slantAngleGap", { min: 0 }),
  ];
}

export function  generateMaximalConfigArea() {
  const balancedConfigs = generateBalancedConfigArea();
  return [
    ...balancedConfigs,
    generateFieldConfig("Slant Line Min Length", "10", "number", "slantLineMinLength", { min: 0 }),
    generateFieldConfig("Add Divider Lines", true, "checkbox", "addDividerLines"),
  ];
}

export function  generateMinimalConfigLine() {
  return [
    generateFieldConfig("Line Color", "#000000", "color", "lineColor"),
    generateFieldConfig("X Height", "7", "number", "xHeight", { min: 0 }),
    generateFieldConfig("Ratio Ascender", "3", "number", "ratioAscender", { min: 0 }),
    generateFieldConfig("Ratio Base", "2", "number", "ratioBase", { min: 0 }),
    generateFieldConfig("Ratio Descender", "3", "number", "ratioDescender", { min: 0 }),
    generateFieldConfig("Slant Angle", "55", "number", "slantAngle", { max: 90, min: 0, step: 1 }),
  ];
}

export function  generateBalancedConfigLine() {
  const minimalConfigs = generateMinimalConfigLine();
  return [
    ...minimalConfigs,
    generateFieldConfig("Grid Stroke Width", "parentDefaults.stroke", "number", "gridStrokeWidth", { min: 0 }),
    generateFieldConfig("Grid Base Line Stroke Width", "0.5", "number", "gridBaseLineStrokeWidth", { min: 0 }),
    generateFieldConfig("Area Block Buffer", "7", "number", "areaBlockBuffer", { min: 0 }),
    generateFieldConfig("Show X Height Indicator", true, "checkbox", "showXHeightIndicator"),
    generateFieldConfig("X Height Indicator Stroke Width", "2", "number", "xHeightIndicatorStrokeWidth", { min: 0 }),
  ];
}

export function  generateMaximalConfigLine() {
  const balancedConfigs = generateBalancedConfigLine();
  return [
    ...balancedConfigs,
    generateFieldConfig("Slant Lines Per Line", "10", "number", "slantLinesPerLine", { min: 0 }),
    generateFieldConfig("Add Divider Lines", true, "checkbox", "addDividerLines"),
  ];
}

export function  generateMinimalConfigGraph() {
  return [
    generateFieldConfig("Line Color", "#000000", "color", "lineColor"),
    generateFieldConfig("Cell Size", "5", "number", "cellSize", { min: 0 }),
  ];
}

export function  generateBalancedConfigGraph() {
  const minimalConfigs = generateMinimalConfigGraph();
  return [
    ...minimalConfigs,
    generateFieldConfig("Grid Stroke Width", "parentDefaults.stroke", "number", "gridStrokeWidth", { min: 0 }),
  ];
}

export function  generateMaximalConfigGraph() {
  const balancedConfigs = generateBalancedConfigGraph();
  return [...balancedConfigs];
}

export function  generateMinimalConfigDot() {
  return [
    generateFieldConfig("Line Color", "#000000", "color", "lineColor"),
    generateFieldConfig("Cell Size", "5", "number", "cellSize", { min: 0 }),
  ];
}

export function  generateBalancedConfigDot() {
  const minimalConfigs = generateMinimalConfigDot();
  return [...minimalConfigs, generateFieldConfig("Dot Size", "0.4", "number", "dotSize", { min: 0 })];
}

export function  generateMaximalConfigDot() {
  const balancedConfigs = generateBalancedConfigDot();
  return [...balancedConfigs];
}
