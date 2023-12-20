import './style.scss'

import {DotGridPage} from './DotGridPage';
import {CalligraphyLinePage} from './CalligraphyLinePage';
import {CalligraphyAreaPage} from './CalligraphyAreaPage';
import {GraphGridPage} from './GraphGridPage';
import {GridPageBasicOtions, GridPageConfig} from './GridPage';

const colorOptions = [
  {
    label: 'non-photo blue',
    value: '#A4DDED'
  },
  {
    label: '30% Black',
    value: '#b3b3b3'
  },
  {
    label: '50% Black',
    value: '#808080'
  },
  {
    label: 'Black',
    value: '#000000'
  },
  {
    label: 'Custom (Enter Hexcode)',
    value: '#ff0000',
    isTextInput: true,
  }
]

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
  initValue:string|boolean,
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
    initValue: true,
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
    initValue: true,
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
    initValue: true,
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
    initValue: true,
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
    initValue: true,
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
  });
}

function createColorField(field) {
  const colorFieldWrapper = document.createElement('fieldset');
  const legend = document.createElement('legend');
  const initValue = field.initValue;
  colorFieldWrapper.classList.add('color-group');
  legend.innerHTML = field.label;

  colorFieldWrapper.appendChild(legend);

  colorOptions.forEach((color) => {
    const inputElement = document.createElement('input');
    const labelEl = document.createElement('label');
    const labelText = document.createElement('span');
    labelText.style.setProperty('--_c', color.value);
    labelText.innerText = color.label;

    inputElement.setAttribute('type', 'radio');
    inputElement.setAttribute('name', field.configName);
    inputElement.setAttribute('value', color.value);

    if(color.value == initValue){
      inputElement.checked = true
    }

    if(color.isTextInput){
      const customColorText = document.createElement('input');
      customColorText.setAttribute('type', 'text');
      customColorText.setAttribute('aria-label', 'Add Custom Color (in Hex Format)');
      customColorText.setAttribute('pattern', '^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$');
      customColorText.setAttribute('maxlength', '7');
      customColorText.value = color.value;
      labelText.appendChild(customColorText);

      customColorText.addEventListener('change', () => {
        const newValue = customColorText.value
        inputElement.value = newValue;
        labelText.style.setProperty('--_c', newValue);
        if(inputElement.checked){
          updateGridAndConfigBasedOnValue(newValue, initValue, field.configName);
        } else {
          console.log('we don not matter');
        }
      });
    }

    if(color.isColorInput){}

    labelEl.appendChild(inputElement);
    labelEl.appendChild(labelText);
    colorFieldWrapper.appendChild(labelEl);
    
    inputElement.addEventListener('change', () => {
      updateGridAndConfigBasedOnValue(inputElement.value, initValue, field.configName);
    });
  });

  return colorFieldWrapper;

  // colorOptions.forEach((colorOption) => {
  //   const radioInput = document.createElement('input');
  //   radioInput.setAttribute('type', 'radio');
  //   radioInput.setAttribute('name', field.configName);
  //   radioInput.setAttribute('value', colorOption.value);

  //   const radioLabel = document.createElement('label');
  //   radioLabel.innerText = colorOption.label;

  //   const radioDiv = document.createElement('div');
  //   radioDiv.appendChild(radioInput);
  //   radioDiv.appendChild(radioLabel);
  //   radioGroup.appendChild(radioDiv);

  //   radioInput.addEventListener('change', () => {
  //     if (radioInput.checked) {
  //       if (colorOption.value === 'custom-hex') {
  //         const customHexInput = document.createElement('input');
  //         customHexInput.setAttribute('type', 'text');
  //         customHexInput.setAttribute('placeholder', 'Enter hexcode');

  //         customHexInput.addEventListener('input', () => {
  //           radioInput.value = customHexInput.value;
  //           initGrid(gridType);
  //         });

  //         colorFieldWrapper.appendChild(customHexInput);
  //       } else if (colorOption.value === 'custom-color') {
  //         const customColorInput = document.createElement('input');
  //         customColorInput.setAttribute('type', 'color');

  //         customColorInput.addEventListener('input', () => {
  //           radioInput.value = customColorInput.value;
  //           initGrid(gridType);
  //         });

  //         colorFieldWrapper.appendChild(customColorInput);
  //       }
  //     }
  //   });
  // });

  // colorFieldWrapper.appendChild(radioGroup);

}

function createField(field, parentEl) {
  const fieldWrapper = document.createElement('div');
  const label = document.createElement('label');
  const labelText = document.createElement('span');

  fieldWrapper.classList.add('field');
  fieldWrapper.classList.add(`field--${field.inputType}`);

  labelText.innerText = field.label;

  if (field.inputType === 'color') {
    const colorField = createColorField(field);
    fieldWrapper.appendChild(colorField);
  } else {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', field.inputType);
    inputElement.setAttribute('name', field.configName);
    inputElement.setAttribute('value', field.initValue || '');

    if (field.inputType === 'checkbox') {
      if (field.initValue === true) {
        inputElement.checked = true;
      }
      label.appendChild(inputElement);
      label.appendChild(labelText);
    } else {
      label.appendChild(labelText);
      label.appendChild(inputElement);
    }

    fieldWrapper.appendChild(label);

    inputElement.addEventListener('change', () => {
      const fieldValue = (field.inputType == 'checkbox') ? inputElement.checked : inputElement.value;
      updateGridAndConfigBasedOnValue(fieldValue, field.initValue, field.configName);
    });
  }

  parentEl.appendChild(fieldWrapper);
}

function updateGridAndConfigBasedOnValue(value, initValue, configName){
  if(value !== initValue){
    currentGridConfig[configName] = value;
  } else {
    delete currentGridConfig[configName];
  }
  initGrid(gridType);
}
