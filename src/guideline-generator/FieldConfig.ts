export type InputTypes = "number" | "color" | "checkbox" | "numberArray";

export type fieldSetId = 'general'|'doc'|'areaBox'|'gridLine'|'slantLine';

export interface FieldSet {
  id:fieldSetId,
  label: string
}

export interface FieldConfig {
  fieldset:fieldSetId;
  label: string;
  initValue: string | number | boolean;
  inputType: InputTypes;
  configName: string;
  helperText?: string;
  max?: number;
  min?: number;
  step?: number;
  arraySeparator?:string;
}
