import './style.scss'


import { CalliGrid, CalliGridOptions } from './calliGrid';
import {generatePDF} from './savePDF';
import { generateForm, FormConfig } from './calliGridForm';
import {saveSVGAsFile} from './saveSVG';

let calliInstance = new CalliGrid();

const formFields: FormConfig = {
  documentWidth: {
    initValue: 210,
    labelText: 'Document Width (in mm)',
    inputType: 'number'
  },
  documentHeight: {
    initValue: 297,
    labelText: 'Document Height (in mm)',
    inputType: 'number'
  },
  documentMarginTop: {
    initValue: 10,
    labelText: 'Document Margin Top (in mm)',
    inputType: 'number'
  },
  documentMarginBottom: {
    initValue: 10,
    labelText: 'Document Margin Bottom (in mm)',
    inputType: 'number'
  },
  documentMarginLeft: {
    initValue: 7,
    labelText: 'Document Margin Left (in mm)',
    inputType: 'number'
  },
  documentMarginRight: {
    initValue: 7,
    labelText: 'Document Margin Right (in mm)',
    inputType: 'number'
  },
  addAreaBox: {
    initValue: true,
    labelText: 'Add Area Box',
    inputType: 'checkbox'
  },
  areaBorderWidth: {
    initValue: 0.3,
    labelText: 'Area Border Width',
    inputType: 'number',
    step: '0.1',
  },
  areaBorderColor: {
    initValue: 'black',
    labelText: 'Area Border Color',
    inputType: 'color'
  },
  areaBorderRadius: {
    initValue: 2,
    labelText: 'Area Border Radius',
    inputType: 'number'
  },
  areaBlockBuffer: {
    initValue: 5,
    labelText: 'Area Block Buffer',
    inputType: 'number'
  },
  gridLineRatioAscender: {
    initValue: 3,
    labelText: 'Grid Line Ratio Ascender',
    inputType: 'number'
  },
  gridLineRatioBase: {
    initValue: 2,
    labelText: 'Grid Line Ratio Base',
    inputType: 'number'
  },
  gridLineRatioDescender: {
    initValue: 3,
    labelText: 'Grid Line Ratio Descender',
    inputType: 'number'
  },
  gridLineXHeight: {
    initValue: 5,
    labelText: 'Grid Line X-Height (in mm)',
    inputType: 'number'
  },
  gridLineColor: {
    initValue: 'black',
    labelText: 'Grid Line Color',
    inputType: 'color'
  },
  gridLineStrokeWidth: {
    initValue: 0.2,
    labelText: 'Grid Line Stroke Width',
    inputType: 'number',
    step: '0.1',
  },
  gridBaseLineStrokeWidth: {
    initValue: 1,
    labelText: 'Grid Base Line Stroke Width',
    inputType: 'number',
    step: '0.1',
  },
  addgridXHeightIndicator: {
    initValue: true,
    labelText: 'Add Grid X-Height Indicator',
    inputType: 'checkbox'
  },
  gridXHeightIndicatorStrokeWidth: {
    initValue: 2,
    labelText: 'Grid X-Height Indicator Stroke Width',
    inputType: 'number'
  },
  slantLineAngle: {
    initValue: 55,
    labelText: 'Slant Line Angle',
    inputType: 'number',
    max: '180',
    step: '5',
  },
  slantLinesPerLine: {
    initValue: 10,
    labelText: 'Slant Lines Per Line',
    inputType: 'number'
  }
};

const generatedForm = generateForm(formFields);
const formContainer = document.getElementById('formContainer');
if (formContainer) {
  formContainer.appendChild(generatedForm);
  setUpformEvents(formFields);
}

const dlBtn = document.querySelector('[data-download-pdf]');
dlBtn?.addEventListener('click', (e) => {
  generatePDF(calliInstance)
});

const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', function() {
  saveSVGAsFile(calliInstance);
});

function regenerateSVG(options:CalliGridOptions){
  calliInstance.removeSVG();
  calliInstance = new CalliGrid(options);
}

function setUpformEvents(config: FormConfig): CalliGridOptions {
  const changedValues: CalliGridOptions = {};

  Object.entries(config).forEach(([id, configData]) => {
    const input = document.getElementById(id) as HTMLInputElement;

    if (configData.inputType === 'checkbox') {
      input.addEventListener('change', () => {
        changedValues[id] = input.checked;
        regenerateSVG(changedValues);
      });
    } else {
      input.addEventListener('change', () => {
        const formValue = input.value;

        if (formValue !== null && formValue !== configData.initValue.toString()) {
          if (configData.inputType === 'number') {
            changedValues[id] = parseFloat(formValue);
          } else {
            changedValues[id] = formValue;
          }
        }
        regenerateSVG(changedValues);
      });
    }
  });

  return changedValues;
}