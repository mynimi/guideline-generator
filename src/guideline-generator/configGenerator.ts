import type {Input} from "postcss";
import { type FieldConfig, type FieldSet, type fieldSetId, type InputTypes } from "./FieldConfig";

export function generateFieldsets(): FieldSet[] {
  return [
    generateFieldset("general", "General (color and stroke override all other defaults, unless specifically overwritten)"),
    generateFieldset("doc", "Document Setup (in mm)"),
    generateFieldset("areaBox", "Area Box"),
    generateFieldset("gridLine", "Grid Line"),
    generateFieldset("slantLine", "Slant Line"),
  ];
}
export function generateFieldset(id: fieldSetId, label: string): FieldSet {
  return {
    id,
    label,
  };
}

export function generateFieldConfig(
  fieldset: fieldSetId,
  label: string,
  initValue: string|number|boolean,
  inputType: InputTypes,
  configName: string,
  additionalProps = {}
): FieldConfig {
  return {
    fieldset,
    label,
    initValue,
    inputType,
    configName,
    ...additionalProps,
  };
}

export function generateBasicOnly(): FieldConfig[] {
  return [
    generateFieldConfig("general", "Color", "#000000", "color", "color",),
    generateFieldConfig("general", "Stroke", "0.2", "number", "stroke", { step: 0.1 }),
  ];
}

export function generateBasicShared(): FieldConfig[] {
  return [
    generateFieldConfig("doc", "Document Width (in mm)", 210, "number", "documentWidth"),
    generateFieldConfig("doc", "Document Height (in mm)", 297, "number", "documentHeight"),
  ];
}

export function generateBasicConfig(): FieldConfig[] {
  const basicOnly = generateBasicOnly();
  const basicShared = generateBasicShared();
  return [...basicShared, ...basicOnly];
}

export function generateBalancedConfig(): FieldConfig[] {
  const basicConfigs = generateBasicShared();
  return [
    ...basicConfigs,
    generateFieldConfig("areaBox", "Add Area Box", true, "checkbox", "addAreaBox"),
    generateFieldConfig("areaBox", "Area Border Radius", 5, "number", "areaBorderRadius"),
    generateFieldConfig("areaBox", "Area Stroke Width", 0.2, "number", "areaStrokeWidth", { step: 0.1 }),
    generateFieldConfig("areaBox", "Area Stroke Color", "#000000", "color", "areaStrokeColor"),
    generateFieldConfig("doc", "Document Margin Top", 10, "number", "documentMarginTop"),
    generateFieldConfig("doc", "Document Margin Top", 10, "number", "documentMarginBottom"),
    generateFieldConfig("doc", "Document Margin Left", 7, "number", "documentMarginLeft"),
    generateFieldConfig("doc", "Document Margin Right", 7, "number", "documentMarginRight"),
  ];
}

export function generateMaximalConfig(): FieldConfig[] {
  const balancedConfigs = generateBalancedConfig();
  return [...balancedConfigs, generateFieldConfig("general", "Add Title", true, "checkbox", "addTitle")];
}

export function generateMinimalConfigArea(): FieldConfig[] {
  return [
    generateFieldConfig("gridLine", "X Height (in mm)", 7, "number", "xHeight", { min: 0 }),
    generateFieldConfig("slantLine", "Slant Angle (in °)", 55, "number", "slantAngle", { max: 89, min: 0, step: 1 }),
  ];
}

export function generateBalancedConfigArea(): FieldConfig[] {
  const minimalConfigs = generateMinimalConfigArea();
  return [
    ...minimalConfigs,
    generateFieldConfig("gridLine", "Line Color", "#000000", "color", "lineColor"),
    generateFieldConfig("gridLine", "Grid Stroke Width", 0.2, "number", "gridStrokeWidth", { min: 0, step: 0.1 }),
    generateFieldConfig("slantLine", "Slant Angle Gap", 10, "number", "slantAngleGap", { min: 0 }),
  ];
}

export function generateMaximalConfigArea(): FieldConfig[] {
  const balancedConfigs = generateBalancedConfigArea();
  return [
    ...balancedConfigs,
    generateFieldConfig("slantLine", "Slant Line Min Length", 10, "number", "slantLineMinLength", { min: 0 }),
    generateFieldConfig("gridLine", "Add Divider Lines", true, "checkbox", "addDividerLines"),
  ];
}

export function generateMinimalConfigLine(): FieldConfig[] {
  return [
    generateFieldConfig("gridLine", "X Height", 7, "number", "xHeight", { min: 0 }),
    generateFieldConfig("gridLine", "Ratio Ascender", 3, "number", "ratioAscender", { min: 0 }),
    generateFieldConfig("gridLine", "Ratio Base", 2, "number", "ratioBase", { min: 0 }),
    generateFieldConfig("gridLine", "Ratio Descender", 3, "number", "ratioDescender", { min: 0 }),
    generateFieldConfig("slantLine", "Slant Angle", 55, "number", "slantAngle", { max: 90, min: 0, step: 1 }),
  ];
}

export function generateBalancedConfigLine(): FieldConfig[] {
  const minimalConfigs = generateMinimalConfigLine();
  return [
    ...minimalConfigs,
    generateFieldConfig("gridLine", "Line Color", "#000000", "color", "lineColor"),
    generateFieldConfig("gridLine", "Grid Stroke Width", 0.2, "number", "gridStrokeWidth", { min: 0, step: 0.1 }),
    generateFieldConfig("gridLine", "Grid Base Line Stroke Width", 0.5, "number", "gridBaseLineStrokeWidth", {
      min: 0,
      step: 0.1,
    }),
    generateFieldConfig("areaBox", "Area Block Buffer", 7, "number", "areaBlockBuffer", { min: 0 }),
    generateFieldConfig("gridLine", "Show X Height Indicator", true, "checkbox", "showXHeightIndicator"),
    generateFieldConfig("gridLine", "X Height Indicator Stroke Width", 2, "number", "xHeightIndicatorStrokeWidth", {
      min: 0,
      step: 0.1,
    }),
    generateFieldConfig("gridLine", "Add Divider Lines", true, "checkbox", "addDividerLines"),
  ];
}

export function generateMaximalConfigLine(): FieldConfig[] {
  const balancedConfigs = generateBalancedConfigLine();
  return [
    ...balancedConfigs,
    generateFieldConfig("slantLine", "Slant Lines Per Line", 10, "number", "slantLinesPerLine", { min: 0 }),
  ];
}

export function generateMinimalConfigGraph(): FieldConfig[] {
  return [generateFieldConfig("gridLine", "Cell Size", "5", "number", "cellSize", { min: 0 })];
}

export function generateBalancedConfigGraph(): FieldConfig[] {
  const minimalConfigs = generateMinimalConfigGraph();
  return [
    ...minimalConfigs,
    generateFieldConfig("gridLine", "Grid Stroke Width", 0.2, "number", "gridStrokeWidth", { min: 0, step: 0.1 }),
    generateFieldConfig("gridLine", "Line Color", "#000000", "color", "lineColor"),
  ];
}

export function generateMaximalConfigGraph(): FieldConfig[] {
  const balancedConfigs = generateBalancedConfigGraph();
  return [...balancedConfigs];
}

export function generateMinimalConfigDot(): FieldConfig[] {
  return [generateFieldConfig("gridLine", "Cell Size", 5, "number", "cellSize", { min: 0 })];
}

export function generateBalancedConfigDot(): FieldConfig[] {
  const minimalConfigs = generateMinimalConfigDot();
  return [
    ...minimalConfigs,
    generateFieldConfig("general", "Dot Size", 0.4, "number", "dotSize", { min: 0, step: 0.1 }),
    generateFieldConfig("gridLine", "Line Color", "#000000", "color", "lineColor"),
  ];
}

export function generateMaximalConfigDot(): FieldConfig[] {
  const balancedConfigs = generateBalancedConfigDot();
  return [...balancedConfigs];
}
