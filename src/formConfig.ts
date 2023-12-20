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
} from "./configGenerator";

import { FieldConfig } from "./FieldConfig.ts";

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

export const minimalFormConfigLine: FieldConfig[] = [...basicConfigShared, ...minimalConfigLine];
export const balancedFormConfigLine: FieldConfig[] = [...balancedConfigShared, ...balancedConfigLine];
export const maximalFormConfigLine: FieldConfig[] = [...maximalConfigShared, ...maximalConfigLine];
export const minimalFormConfigArea: FieldConfig[] = [...basicConfigShared, ...minimalConfigArea];
export const balancedFormConfigArea: FieldConfig[] = [...balancedConfigShared, ...balancedConfigArea];
export const maximalFormConfigArea: FieldConfig[] = [...maximalConfigShared, ...maximalConfigArea];
export const minimalFormConfigDot: FieldConfig[] = [...basicConfigShared, ...minimalConfigDot];
export const balancedFormConfigDot: FieldConfig[] = [...balancedConfigShared, ...balancedConfigDot];
export const maximalFormConfigDot: FieldConfig[] = [...maximalConfigShared, ...maximalConfigDot];
export const minimalFormConfigGraph: FieldConfig[] = [...basicConfigShared, ...minimalConfigGraph];
export const balancedFormConfigGraph: FieldConfig[] = [...balancedConfigShared, ...balancedConfigGraph];
export const maximalFormConfigGraph: FieldConfig[] = [...maximalConfigShared, ...maximalConfigGraph];
