/** @format */

import "./style.scss";

import { DotGridPage } from "./DotGridPage";
import { CalligraphyLinePage } from "./CalligraphyLinePage";
import { CalligraphyAreaPage } from "./CalligraphyAreaPage";
import { GraphGridPage } from "./GraphGridPage";
import { GridPageConfig } from "./GridPage";
import {setupGridPreviews} from "./gridPreviewSetup";
import {FieldConfig} from "./calliGridForm";
import {minimalFormConfigLine,minimalFormConfigArea,minimalFormConfigDot,minimalFormConfigGraph,balancedFormConfigLine,balancedFormConfigArea,balancedFormConfigDot,balancedFormConfigGraph,maximalFormConfigLine,maximalFormConfigArea,maximalFormConfigDot,maximalFormConfigGraph} from "./formConfig";

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
const gridConfig: GridPageConfig = {
  container: gridContainer,
};

// these will be changing
let currentGridConfig = {};
let gridType!: GridType;
let gridInstance;
let viewType!: ConfigPersonality;

setupGridPreviews();

gridPicker.forEach((input) => {
  handleGridChange(input);
  input.addEventListener("change", () => {
    handleGridChange(input);
  });
});

viewSwitch.forEach((input) => {
  handleViewChange(input);
  input.addEventListener("change", () => {
    handleViewChange(input);
  });
});

function initGrid(type) {
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
  gridContainer.innerHTML = "";
}

function handleGridChange(input) {
  if (input.checked) {
    gridType = input.value;
    initGrid(gridType);
  }
}

function handleViewChange(input) {
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

  currentConfig.forEach((field) => {
    createField(field, fieldContainer);
  });
}

function createColorField(field) {
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
          updateGridAndConfigBasedOnValue(newValue, initValue, field.configName);
        }
      });
    }

    labelEl.appendChild(inputElement);
    labelEl.appendChild(labelText);
    colorFieldWrapper.appendChild(labelEl);

    inputElement.addEventListener("change", () => {
      updateGridAndConfigBasedOnValue(inputElement.value, initValue, field.configName);
    });
  });

  return colorFieldWrapper;
}

function createField(field, parentEl) {
  const label = document.createElement("label");
  const labelText = document.createElement("span");

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

    if (field.inputType === "checkbox") {
      if (field.initValue === true) {
        inputElement.checked = true;
      }
      label.appendChild(inputElement);
      label.appendChild(labelText);
    } else {
      label.appendChild(labelText);
      label.appendChild(inputElement);
    }

    inputElement.addEventListener("change", () => {
      const fieldValue = field.inputType == "checkbox" ? inputElement.checked : inputElement.value;
      updateGridAndConfigBasedOnValue(fieldValue, field.initValue, field.configName);
    });
  }

  parentEl.appendChild(label);
}

function updateGridAndConfigBasedOnValue(value, initValue, configName) {
  if (value !== initValue) {
    currentGridConfig[configName] = value;
  } else {
    delete currentGridConfig[configName];
  }
  initGrid(gridType);
}
