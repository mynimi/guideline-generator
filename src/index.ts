import './style.scss'

import {DotGridPage} from './DotGridPage';
import {CalligraphyLinePage} from './CalligraphyLinePage';
import {CalligraphyAreaPage} from './CalligraphyAreaPage';
import {GraphGridPage} from './GraphGridPage';
import {GridPageBasicOtions, GridPageConfig} from './GridPage';

const colorPresets = ['#A4DDED', '#b3b3b3', '#808080', '#000000', 'custom'];

const previewConfig:GridPageConfig = {
  documentWidth: 40,
  documentHeight: 40,
  documentMarginTop: 2,
  documentMarginBottom: 0,
  documentMarginLeft: 2,
  documentMarginRight: 2,
  addTitle: false,
  textFontSize: 0,
  textLineHeight: 0,
}

const dotPreview = new DotGridPage({
  container: document.querySelector('[data-dot-preview]'),
  ...previewConfig,
  dotSize: 1,
  cellSize: 5,
});
const calliLinePreview = new CalligraphyLinePage({
  container: document.querySelector('[data-calli-line-preview]'),
  ...previewConfig,
  xHeight: 4,
  areaBlockBuffer: 2,
});
const calliAreaPreview = new CalligraphyAreaPage({
  container: document.querySelector('[data-calli-area-preview]'),
  ...previewConfig,
  xHeight: 10,
});
const graphPreview = new GraphGridPage({
  container: document.querySelector('[data-graph-preview]'),
  ...previewConfig,
  gridStrokeWidth: 0.4,
  cellSize: 5,
});


type InputTypes = 'number' | 'color' | 'checkbox';

interface fieldConfig {
  label: string,
  initValue:string,
  inputType: InputTypes,
  configName: string,
  max?:number,
  min?:number,
  step?:number,
  options?:string[],
}

const basicConfigShared:fieldConfig[] = [
  {
    label: 'Document Width',
    initValue: '210',
    inputType: 'number',
    configName: 'documentWidth',
  },
  {
    label: 'Document Height',
    initValue: '297',
    inputType: 'number',
    configName: 'documentHeight',
  },
  {
    label: 'Color',
    initValue: '#000000',
    inputType: 'color',
    configName: 'color',
  },
  {
    label: 'Stroke',
    initValue: '1',
    inputType: 'number',
    configName: 'stroke',
    step: 0.1
  },
  {
    label: 'Add Area Box',
    initValue: 'true',
    inputType: 'checkbox',
    configName: 'addAreaBox',
  },
]

const balancedConfigShared:fieldConfig[] = [
  {
    label: 'Document Margin Top',
    initValue: '10',
    inputType: 'number',
    configName: 'documentMarginTop',
  },
  {
    label: 'Document Margin Bottom',
    initValue: '10',
    inputType: 'number',
    configName: 'documentMarginBottom',
  },
  {
    label: 'Document Margin Left',
    initValue: '7',
    inputType: 'number',
    configName: 'documentMarginLeft',
  },
  {
    label: 'Document Margin Right',
    initValue: '7',
    inputType: 'number',
    configName: 'documentMarginRight',
  },
  {
    label: 'Area Border Radius',
    initValue: '5',
    inputType: 'number',
    configName: 'areaBorderRadius',
  },
  {
    label: 'Area Stroke Width',
    initValue: '1',
    inputType: 'number',
    configName: 'areaStrokeWidth',
    step: 0.1,
  },
  {
    label: 'Area Stroke Color',
    initValue: '#000000',
    inputType: 'color',
    configName: 'areaStrokeColor',
  },
];

const maximalConfigShared:fieldConfig[] = [
  {
    label: 'Add Title',
    initValue: 'true',
    inputType: 'checkbox',
    configName: 'addTitle'
  }
]

const minimalConfigArea:fieldConfig[]=[
  {
    label: 'Line Color',
    initValue: '#000000',
    inputType: 'color',
    configName: 'lineColor'
  },
  {
    label: 'X Height',
    initValue: '7',
    inputType: 'number',
    configName: 'xHeight',
    min: 0
  },
  {
    label: 'Slant Angle',
    initValue: '55',
    inputType: 'number',
    configName: 'slantAngle',
    max: 90,
    min: 0,
    step: 1
  }
];
const balancedConfigArea:fieldConfig[]=[
  {
    label: 'Grid Stroke Width',
    initValue: 'parentDefaults.stroke',
    inputType: 'number',
    configName: 'gridStrokeWidth',
    min: 0
  },
  {
    label: 'Area Block Buffer',
    initValue: '7',
    inputType: 'number',
    configName: 'areaBlockBuffer',
    min: 0
  },
  {
    label: 'Slant Angle Gap',
    initValue: '10',
    inputType: 'number',
    configName: 'slantAngleGap',
    min: 0
  }
];
const maximalConfigArea:fieldConfig[]=[
  {
    label: 'Slant Line Min Length',
    initValue: '10',
    inputType: 'number',
    configName: 'slantLineMinLength',
    min: 0
  },
  {
    label: 'Add Divider Lines',
    initValue: 'true',
    inputType: 'checkbox',
    configName: 'addDividerLines'
  }
];

const minimalConfigLine:fieldConfig[]=[
  {
    label: 'Line Color',
    initValue: '#000000',
    inputType: 'color',
    configName: 'lineColor'
  },
  {
    label: 'X Height',
    initValue: '7',
    inputType: 'number',
    configName: 'xHeight',
    min: 0
  },
  {
    label: 'Ratio Ascender',
    initValue: '3',
    inputType: 'number',
    configName: 'ratioAscender',
    min: 0
  },
  {
    label: 'Ratio Base',
    initValue: '2',
    inputType: 'number',
    configName: 'ratioBase',
    min: 0
  },
  {
    label: 'Ratio Descender',
    initValue: '3',
    inputType: 'number',
    configName: 'ratioDescender',
    min: 0
  },
  {
    label: 'Slant Angle',
    initValue: '55',
    inputType: 'number',
    configName: 'slantAngle',
    max: 90,
    min: 0,
    step: 1
  }
];
const balancedConfigLine:fieldConfig[]=[
  {
    label: 'Grid Stroke Width',
    initValue: 'parentDefaults.stroke',
    inputType: 'number',
    configName: 'gridStrokeWidth',
    min: 0
  },
  {
    label: 'Grid Base Line Stroke Width',
    initValue: '0.5',
    inputType: 'number',
    configName: 'gridBaseLineStrokeWidth',
    min: 0
  },
  {
    label: 'Area Block Buffer',
    initValue: '7',
    inputType: 'number',
    configName: 'areaBlockBuffer',
    min: 0
  },
  {
    label: 'Show X Height Indicator',
    initValue: 'true',
    inputType: 'checkbox',
    configName: 'showXHeightIndicator'
  },
  {
    label: 'X Height Indicator Stroke Width',
    initValue: '2',
    inputType: 'number',
    configName: 'xHeightIndicatorStrokeWidth',
    min: 0
  }
];
const maximalConfigLine:fieldConfig[]=[
  {
    label: 'Slant Lines Per Line',
    initValue: '10',
    inputType: 'number',
    configName: 'slantLinesPerLine',
    min: 0
  },
  {
    label: 'Add Divider Lines',
    initValue: 'true',
    inputType: 'checkbox',
    configName: 'addDividerLines'
  }
];

const minimalConfigGraph:fieldConfig[]=[
  {
    label: 'Line Color',
    initValue: '#000000',
    inputType: 'color',
    configName: 'lineColor'
  },
  {
    label: 'Cell Size',
    initValue: '5',
    inputType: 'number',
    configName: 'cellSize',
    min: 0
  }
];
const balancedConfigGraph:fieldConfig[]=[
  {
    label: 'Grid Stroke Width',
    initValue: 'parentDefaults.stroke',
    inputType: 'number',
    configName: 'gridStrokeWidth',
    min: 0
  }
];
const maximalConfigGraph:fieldConfig[]=[];

const minimalConfigDot:fieldConfig[]=[  {
  label: 'Line Color',
  initValue: '#000000',
  inputType: 'color',
  configName: 'lineColor'
},
{
  label: 'Cell Size',
  initValue: '5',
  inputType: 'number',
  configName: 'cellSize',
  min: 0
}
];
const balancedConfigDot:fieldConfig[]=[
  {
    label: 'Dot Size',
    initValue: '0.4',
    inputType: 'number',
    configName: 'dotSize',
    min: 0
  }
];
const maximalConfigDot:fieldConfig[]=[];

const form = document.querySelector('[data-form-container]');

const gridPicker = document.querySelectorAll('input[name="grid-type"]');

let gridType;
gridPicker.forEach(input => {
  if (input.checked) {
    gridType = input.value
  }
  input.addEventListener('change', () => {
    if (input.checked) {
      gridType = input.value
    }
    initGrid(gridType);
  });
});

const gridContainer = document.querySelector('[data-svg-preview]');
const gridConfig:GridPageConfig = {
  container: gridContainer
};
let currentGridConfig = {};

let gridInstance;
function initGrid(type) {
  let newGrid;
  const newGridConfig = {
    ...gridConfig,
    ...currentGridConfig
  };

  if (gridInstance) {
    killGrid();
  }

  switch (type) {
    case 'line':
      gridInstance = new CalligraphyLinePage(newGridConfig);
      break;
    case 'area':
      gridInstance = new CalligraphyAreaPage(newGridConfig);
      break;
    case 'dot':
      gridInstance = new DotGridPage(newGridConfig);
      break;
    case 'graph':
      gridInstance = new GraphGridPage(newGridConfig);
      break;
    default:
      console.error('Invalid grid type');
      break;
  }
  return newGrid;
}
function killGrid(){
  gridInstance = undefined;
  gridContainer.innerHTML = '';
}

initGrid(gridType);

const viewSwitch = document.querySelectorAll('input[name="config-type"]');
const fieldContainer = document.querySelector('[data-field-container]');

type ConfigPersonality = 'minimal'|'balanced'|'maximal';
let viewType!:ConfigPersonality;
viewSwitch.forEach(input => {
  if (input.checked) {
    viewType = input.value
  }
  input.addEventListener('change', () => {
    if (input.checked) {
      viewType = input.value
    }
    renderFields(viewType);
  });
});
renderFields(viewType);

function renderFields(configPersonality:ConfigPersonality){  
  if (!fieldContainer) {
    console.error("Field container not found.");
    return;
  } else {
    fieldContainer.innerHTML = '';
  }

  const getConfig = (configType: ConfigPersonality): fieldConfig[] => {
    switch (configType) {
      case 'minimal':
        return basicConfigShared; // Replace with your actual minimal config
      case 'balanced':
        return balancedConfigShared; // Replace with your actual balanced config
      case 'maximal':
        return maximalConfigShared; // Replace with your actual maximal config
      default:
        return [];
    }
  };

  const currentConfig = getConfig(configPersonality);

  currentConfig.forEach((field) => {
    createField(field, fieldContainer);
    const inputElement = fieldContainer.querySelector(`input[name="${field.configName}"]`);
    if (inputElement) {
      inputElement.addEventListener('change', (event) => {
        const fieldValue = event.target.value;

        if (fieldValue !== field.initValue) {
          // Add the changed field to the object
          currentGridConfig[field.configName] = fieldValue;
        } else {
          // Remove the field from the object if it reverts to its initial value
          delete currentGridConfig[field.configName];
        }

        // Log the object with changed fields
        initGrid(gridType);
      });
    }
  });
}

function createColorField(field, label) {
  const colorOptions = field.options || colorPresets;
  const customColorInput = document.createElement('input');
  const radioGroup = document.createElement('div');

  radioGroup.classList.add('color-options');

  colorOptions.forEach((color) => {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = `${field.configName}-options`;
    radioInput.value = color;

    const colorPreview = document.createElement('div');
    colorPreview.style.backgroundColor = color;
    colorPreview.classList.add('color-preview');

    const labelColor = document.createElement('label');
    labelColor.appendChild(radioInput);
    labelColor.appendChild(colorPreview);

    radioGroup.appendChild(labelColor);
  });

  customColorInput.type = 'color';
  customColorInput.name = field.configName;
  customColorInput.value = field.initValue || '';
  customColorInput.classList.add('custom-color-input');
  customColorInput.style.display = 'none'; // Initially hide the custom color input

  radioGroup.addEventListener('change', (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'custom') {
      customColorInput.style.display = 'block'; // Show custom color input
    } else {
      customColorInput.style.display = 'none'; // Hide custom color input
    }
  });

  label.appendChild(radioGroup);
  label.appendChild(customColorInput);

  return label;
}

function createField(field, parentEl) {
  const fieldWrapper = document.createElement('div');
  const label = document.createElement('label');
  const labelText = document.createElement('span');

  fieldWrapper.classList.add('field');
  fieldWrapper.classList.add(`field--${field.inputType}`);

  labelText.innerText = field.label;

  if (field.inputType === 'color') {
    const colorField = createColorField(field, label);
    label.appendChild(labelText);
    fieldWrapper.appendChild(colorField);
  } else {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', field.inputType);
    inputElement.setAttribute('name', field.configName);
    inputElement.setAttribute('value', field.initValue || '');

    if (field.inputType === 'checkbox') {
      if (field.initValue === 'true') {
        inputElement.checked = true;
      }
      label.appendChild(inputElement);
      label.appendChild(labelText);
    } else {
      label.appendChild(labelText);
      label.appendChild(inputElement);
    }

    fieldWrapper.appendChild(label);
  }

  parentEl.appendChild(fieldWrapper);
}
