import {
  generateBasicConfig,
  generateBalancedConfig,
  generateMaximalConfig,
  generateMinimalConfigArea,
  generateBalancedConfigArea,
  generateMaximalConfigArea,
  generateMinimalConfigLine,
  generateBalancedConfigLine,
  generateMaximalConfigLine,
  generateMinimalConfigGraph,
  generateBalancedConfigGraph,
  generateMaximalConfigGraph,
  generateMinimalConfigDot,
  generateBalancedConfigDot,
  generateMaximalConfigDot,
  generateFieldsets,
} from "./configGenerator";

import { type FieldConfig, type FieldSet } from "./FieldConfig.ts";

export const allFieldSets: FieldSet[] = generateFieldsets();
const basicConfigShared: FieldConfig[] = generateBasicConfig();
const balancedConfigShared: FieldConfig[] = generateBalancedConfig();
const maximalConfigShared: FieldConfig[] = generateMaximalConfig();
const minimalConfigArea: FieldConfig[] = generateMinimalConfigArea();
const balancedConfigArea: FieldConfig[] = generateBalancedConfigArea();
const maximalConfigArea: FieldConfig[] = generateMaximalConfigArea();
const minimalConfigLine: FieldConfig[] = generateMinimalConfigLine();
const balancedConfigLine: FieldConfig[] = generateBalancedConfigLine();
const maximalConfigLine: FieldConfig[] = generateMaximalConfigLine();
const minimalConfigGraph: FieldConfig[] = generateMinimalConfigGraph();
const balancedConfigGraph: FieldConfig[] = generateBalancedConfigGraph();
const maximalConfigGraph: FieldConfig[] = generateMaximalConfigGraph();
const minimalConfigDot: FieldConfig[] = generateMinimalConfigDot();
const balancedConfigDot: FieldConfig[] = generateBalancedConfigDot();
const maximalConfigDot: FieldConfig[] = generateMaximalConfigDot();

export const minimalFormConfigLine: FieldConfig[] = [...minimalConfigLine, ...basicConfigShared];
export const balancedFormConfigLine: FieldConfig[] = [...balancedConfigLine, ...balancedConfigShared];
export const maximalFormConfigLine: FieldConfig[] = [...maximalConfigLine, ...maximalConfigShared];
export const minimalFormConfigArea: FieldConfig[] = [...minimalConfigArea, ...basicConfigShared];
export const balancedFormConfigArea: FieldConfig[] = [...balancedConfigArea, ...balancedConfigShared];
export const maximalFormConfigArea: FieldConfig[] = [...maximalConfigArea, ...maximalConfigShared];
export const minimalFormConfigDot: FieldConfig[] = [...minimalConfigDot, ...basicConfigShared];
export const balancedFormConfigDot: FieldConfig[] = [...balancedConfigDot, ...balancedConfigShared];
export const maximalFormConfigDot: FieldConfig[] = [...maximalConfigDot, ...maximalConfigShared];
export const minimalFormConfigGraph: FieldConfig[] = [...minimalConfigGraph, ...basicConfigShared];
export const balancedFormConfigGraph: FieldConfig[] = [...balancedConfigGraph, ...balancedConfigShared];
export const maximalFormConfigGraph: FieldConfig[] = [...maximalConfigGraph, ...maximalConfigShared];
