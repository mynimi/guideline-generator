type InputTypes = "number" | "color" | "checkbox";

export interface FieldConfig {
  label: string;
  initValue: string | boolean;
  inputType: InputTypes;
  configName: string;
  max?: number;
  min?: number;
  step?: number;
  options?: string[];
}
