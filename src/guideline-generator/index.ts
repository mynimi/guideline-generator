import { DotGridPage } from "./DotGridPage";
import { CalligraphyLinePage } from "./CalligraphyLinePage";
import { CalligraphyAreaPage } from "./CalligraphyAreaPage";
import { GraphGridPage } from "./GraphGridPage";
import { type GridPageConfig } from "./GridPage";
import type {FieldConfig} from "./FieldConfig";
import {allFieldSets,minimalFormConfigLine,minimalFormConfigArea,minimalFormConfigDot,minimalFormConfigGraph,balancedFormConfigLine,balancedFormConfigArea,balancedFormConfigDot,balancedFormConfigGraph,maximalFormConfigLine,maximalFormConfigArea,maximalFormConfigDot,maximalFormConfigGraph} from "./formConfig";
import {saveSVGAsFile} from './saveSVG';
import {generatePDF} from "./savePDF";

type GridType = "line" | "area" | "dot" | "graph";
type ConfigPersonality = "minimal" | "balanced" | "maximal";

const colorOptions = [
  {
    label: "non-photo blue",
    value: "#A4DDED",
  },
  {
    label: "30% Black",
    value: "#b3b3b3",
  },
  {
    label: "50% Black",
    value: "#808080",
  },
  {
    label: "Black",
    value: "#000000",
  },
  {
    label: "Custom (Enter Hexcode)",
    value: "#ff0000",
    isTextInput: true,
  },
];

const gridContainer = document.querySelector("[data-svg-preview]");
const gridPicker = document.querySelectorAll('input[name="grid-type"]');
const viewSwitch = document.querySelectorAll('input[name="config-type"]');
const fieldContainer = document.querySelector("[data-field-container]");
const downloadButton = document.getElementById('downloadButton');
const dlBtn = document.querySelector('[data-download-pdf]');

const gridConfig: GridPageConfig = {
  container: gridContainer,
};

// these will be changing
let currentGridConfig: { [key: string]: any } = {};
let gridType!: GridType;
let gridInstance: CalligraphyLinePage|CalligraphyAreaPage|DotGridPage|GraphGridPage|undefined;
let viewType!: ConfigPersonality;


viewSwitch.forEach((input) => {
  handleViewChange(input);
  input.addEventListener("change", () => {
    handleViewChange(input);
  });
});

gridPicker.forEach((input) => {
  handleGridChange(input);
  input.addEventListener("change", () => {
    handleGridChange(input);
  });
});

downloadButton?.addEventListener('click', function() {
  return saveSVGAsFile(gridInstance);
});

dlBtn?.addEventListener('click', () => {
  generatePDF(gridInstance)
});


function initGrid(type: string) {
  let newGrid;
  const newGridConfig = {
    ...gridConfig,
    ...currentGridConfig,
  };

  if (gridInstance) {
    killGrid();
  }

  switch (type) {
    case "line":
      gridInstance = new CalligraphyLinePage(newGridConfig);
      break;
    case "area":
      gridInstance = new CalligraphyAreaPage(newGridConfig);
      break;
    case "dot":
      gridInstance = new DotGridPage(newGridConfig);
      break;
    case "graph":
      gridInstance = new GraphGridPage(newGridConfig);
      break;
    default:
      console.error("Invalid grid type");
      break;
  }
  return newGrid;
}

function killGrid() {
  gridInstance = undefined;
  if (gridContainer) {
    gridContainer.innerHTML = "";
  }
}

function handleGridChange(input: any) {
  if (input.checked) {
    gridType = input.value;
    initGrid(gridType);
    renderFields(viewType);
  }
}

function handleViewChange(input: any) {
  if (input.checked) {
    viewType = input.value;
    renderFields(viewType);
  }
}

function renderFields(configPersonality: ConfigPersonality) {
  if (!fieldContainer) {
    console.error("Field container not found.");
    return;
  } else {
    fieldContainer.innerHTML = "";
  }

  const getConfig = (configType: ConfigPersonality, gridType: GridType): FieldConfig[] | null => {
    const configMap: Record<ConfigPersonality, Record<GridType, FieldConfig[]>> = {
      minimal: {
        line: minimalFormConfigLine,
        area: minimalFormConfigArea,
        dot: minimalFormConfigDot,
        graph: minimalFormConfigGraph,
      },
      balanced: {
        line: balancedFormConfigLine,
        area: balancedFormConfigArea,
        dot: balancedFormConfigDot,
        graph: balancedFormConfigGraph,
      },
      maximal: {
        line: maximalFormConfigLine,
        area: maximalFormConfigArea,
        dot: maximalFormConfigDot,
        graph: maximalFormConfigGraph,
      },
    };

    const selectedConfig = configMap[configType]?.[gridType];

    if (selectedConfig) {
      return selectedConfig;
    } else {
      // Return null or handle the case when configuration is not found
      return null;
    }
  };

  const currentConfig = getConfig(configPersonality, gridType);

  if(currentConfig){
    createFieldSets(currentConfig, fieldContainer);
  }
}

function createColorField(field: {initValue: any; label: string; configName: string;}) {
  const colorFieldWrapper = document.createElement("fieldset");
  const legend = document.createElement("legend");
  const initValue = field.initValue;
  colorFieldWrapper.classList.add("color-group");
  legend.innerHTML = field.label;

  colorFieldWrapper.appendChild(legend);

  colorOptions.forEach((color) => {
    const inputElement = document.createElement("input");
    const labelEl = document.createElement("label");
    const labelText = document.createElement("span");
    labelText.style.setProperty("--_c", color.value);
    labelText.innerText = color.label;

    inputElement.setAttribute("type", "radio");
    inputElement.setAttribute("name", field.configName);
    inputElement.setAttribute("value", color.value);

    if (color.value == initValue) {
      inputElement.checked = true;
    }

    if (color.isTextInput) {
      const customColorText = document.createElement("input");
      customColorText.setAttribute("type", "text");
      customColorText.setAttribute("name", `${field.configName}-custom`);
      customColorText.setAttribute("aria-label", "Add Custom Color (in Hex Format)");
      customColorText.setAttribute("pattern", "^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$");
      customColorText.setAttribute("maxlength", "7");
      customColorText.value = color.value;
      labelText.appendChild(customColorText);

      customColorText.addEventListener("change", () => {
        const newValue = customColorText.value;
        inputElement.value = newValue;
        labelText.style.setProperty("--_c", newValue);
        if (inputElement.checked) {
          updateGridAndConfigBasedOnValue(newValue, initValue, field.configName, 'color', undefined);
        }
      });
    }

    labelEl.appendChild(inputElement);
    labelEl.appendChild(labelText);
    colorFieldWrapper.appendChild(labelEl);

    inputElement.addEventListener("change", () => {
      updateGridAndConfigBasedOnValue(inputElement.value, initValue, field.configName, 'color', undefined);
    });
  });

  return colorFieldWrapper;
}

function groupFields(currentConfig: FieldConfig[]){
  const groupedFields: { [key: string]: { fieldsetInfo: any, fields: any[] } } = {};
  currentConfig.forEach((item) => {
    const { fieldset, ...rest } = item;
    if (!groupedFields[fieldset]) {
      groupedFields[fieldset] = {
        fieldsetInfo: allFieldSets.find(group => group.id === fieldset),
        fields: [],
      };
    }
    groupedFields[fieldset].fields.push(rest);
  });
  return groupedFields;
}

function createFieldSets(currentConfig: FieldConfig[], parentEl: Element){
  const groupedFields = groupFields(currentConfig);
  Object.keys(groupedFields).forEach(fieldsetId => {
    const group = groupedFields[fieldsetId];
    const fieldSetEl = document.createElement('fieldset');
    const legendEl = document.createElement('legend');
    legendEl.innerHTML = group.fieldsetInfo.label;
    fieldSetEl.appendChild(legendEl);
    parentEl.appendChild(fieldSetEl);    

    group.fields.forEach((field: any) => {
      createField(field, fieldSetEl);
    });
  });
}

function createField(field: {inputType?: any; label: any; configName: any; initValue: any; helperText?: any; max?: any; min?: any; step?: any; arraySeparator?: any;}, parentEl: HTMLFieldSetElement) {
  const fieldWrapper = document.createElement('div');
  const label = document.createElement("label");
  const labelText = document.createElement("span");
  const helperTextEl = document.createElement('p');
  label.classList.add("field");
  label.classList.add(`field--${field.inputType}`);
  labelText.innerText = field.label;

  if (field.inputType === "color") {
    const colorField = createColorField(field);
    label.appendChild(colorField);
  } else {    
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", field.inputType);
    inputElement.setAttribute("name", field.configName);
    inputElement.setAttribute("value", field.initValue || "");
    
    if(field.helperText){
      const helperTextId = field.configName+'HelperText';
      inputElement.setAttribute("aria-describedby", helperTextId);
      helperTextEl.id = helperTextId;
      helperTextEl.innerHTML = field.helperText
    }

    if (field.inputType === "checkbox") {
      if (field.initValue === true) {
        inputElement.checked = true;
      }
      label.appendChild(inputElement);
      label.appendChild(labelText);
    } else {
      if(field.max){
        inputElement.setAttribute("max", field.max);
      }
      if(field.min){
        inputElement.setAttribute("min", field.min);
      }
      if(field.step){
        inputElement.setAttribute("step", field.step);
      }
      label.appendChild(labelText);
      label.appendChild(inputElement);
    }

    inputElement.addEventListener("change", () => {
      const fieldValue = field.inputType == "checkbox" ? inputElement.checked : inputElement.value;
      updateGridAndConfigBasedOnValue(fieldValue, field.initValue, field.configName, field.inputType, field.arraySeparator);
    });
  }

  fieldWrapper.appendChild(label);
  if(field.helperText){
    fieldWrapper.appendChild(helperTextEl);
  }
  parentEl.appendChild(fieldWrapper);
}

function updateGridAndConfigBasedOnValue(value: string|boolean, initValue: any, configName: string, inputType: string, separator: undefined) {
  let val: string | boolean | number[] | number = value;
  if (inputType === 'number' && typeof value === 'string') {
    val = parseFloat(value);
  }
  if(separator && inputType === 'numberArray' && typeof value === 'string'){
    val = value.split(separator).map(Number);
  }
  if (val !== initValue) {
    currentGridConfig[configName] = val;
  } else {
    delete currentGridConfig[configName];
  }
  initGrid(gridType);
}
