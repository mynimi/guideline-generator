import './style.scss'


import { CalliGrid, CalliGridOptions } from './calliGrid';
import {generatePDF} from './savePDF';
import { generateForm, FormConfig } from './calliGridForm';
import {saveSVGAsFile} from './saveSVG';

let calliInstance = new CalliGrid();

const formFields: FormConfig = {
  'Document Setup':{
    documentWidth: {
      initValue: 210,
      labelText: 'Document Width (in mm)',
      inputType: 'number',
      cat: 'basic'
    },
    documentHeight: {
      initValue: 297,
      labelText: 'Document Height (in mm)',
      inputType: 'number',
      cat: 'basic'
    },
    documentMarginTop: {
      initValue: 10,
      labelText: 'Document Margin Top (in mm)',
      inputType: 'number',
      cat: 'advanced'
    },
    documentMarginBottom: {
      initValue: 10,
      labelText: 'Document Margin Bottom (in mm)',
      inputType: 'number',
      cat: 'advanced'
    },
    documentMarginLeft: {
      initValue: 7,
      labelText: 'Document Margin Left (in mm)',
      inputType: 'number',
      cat: 'advanced'
    },
    documentMarginRight: {
      initValue: 7,
      labelText: 'Document Margin Right (in mm)',
      inputType: 'number',
      cat: 'advanced'
    },
  },
  'Area Box':{
    addAreaBox: {
      initValue: true,
      labelText: 'Add Area Box',
      inputType: 'checkbox',
      cat: 'basic'
    },
    areaBorderWidth: {
      initValue: 0.3,
      labelText: 'Area Border Width',
      inputType: 'number',
      step: '0.1',
      cat: 'advanced'
    },
    areaBorderColor: {
      initValue: 'black',
      labelText: 'Area Border Color',
      inputType: 'color',
      cat: 'advanced'
    },
    areaBorderRadius: {
      initValue: 2,
      labelText: 'Area Border Radius',
      inputType: 'number',
      cat: 'advanced'
    },
    areaBlockBuffer: {
      initValue: 5,
      labelText: 'Area Block Buffer',
      inputType: 'number',
      cat: 'advanced'
    },
  },
  'Grid Line':{
    gridLineRatioAscender: {
      initValue: 3,
      labelText: 'Grid Line Ratio Ascender',
      inputType: 'number',
      cat: 'basic'
    },
    gridLineRatioBase: {
      initValue: 2,
      labelText: 'Grid Line Ratio Base',
      inputType: 'number',
      cat: 'basic'
    },
    gridLineRatioDescender: {
      initValue: 3,
      labelText: 'Grid Line Ratio Descender',
      inputType: 'number',
      cat: 'basic'
    },
    gridLineXHeight: {
      initValue: 5,
      labelText: 'Grid Line X-Height (in mm)',
      inputType: 'number',
      cat: 'basic'
    },
    gridLineColor: {
      initValue: 'black',
      labelText: 'Grid Line Color',
      inputType: 'color',
      cat: 'basic'
    },
    gridLineStrokeWidth: {
      initValue: 0.2,
      labelText: 'Grid Line Stroke Width',
      inputType: 'number',
      step: '0.1',
      cat: 'advanced'
    },
    gridBaseLineStrokeWidth: {
      initValue: 1,
      labelText: 'Grid Base Line Stroke Width',
      inputType: 'number',
      step: '0.1',
      cat: 'advanced'
    },
    addgridXHeightIndicator: {
      initValue: true,
      labelText: 'Add Grid X-Height Indicator',
      inputType: 'checkbox',
      cat: 'basic'
    },
    gridXHeightIndicatorStrokeWidth: {
      initValue: 2,
      labelText: 'Grid X-Height Indicator Stroke Width',
      inputType: 'number',
      cat: 'advanced'
    },
    slantLineAngle: {
      initValue: 55,
      labelText: 'Slant Line Angle',
      inputType: 'number',
      max: '180',
      step: '5',
      cat: 'basic'
    },
    slantLinesPerLine: {
      initValue: 10,
      labelText: 'Slant Lines Per Line',
      inputType: 'number',
      cat: 'advanced'
    }
  },
};

const generatedForm = generateForm(formFields);
const formContainer = document.getElementById('formContainer');
if (formContainer) {
  formContainer.appendChild(generatedForm);
  setUpformEvents(formFields);
}

const dlBtn = document.querySelector('[data-download-pdf]');
dlBtn?.addEventListener('click', () => {
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

function setUpformEvents(config: GroupedFormConfig): CalliGridOptions {
  const changedValues: CalliGridOptions = {};

  Object.entries(config).forEach(([legend, fields]) => {
    Object.entries(fields).forEach(([id, configData]) => {
      const input = document.getElementById(id) as HTMLInputElement | null;

      if (input) {
        const handleChange = () => {
          if (configData.inputType === 'checkbox') {
            changedValues[id] = input.checked;
          } else {
            const formValue = input.value;

            if (
              formValue !== null &&
              formValue !== undefined &&
              formValue !== configData.initValue.toString()
            ) {
              if (configData.inputType === 'number') {
                changedValues[id] = parseFloat(formValue);
              } else {
                changedValues[id] = formValue;
              }
            }
          }
          regenerateSVG(changedValues);
        };

        // Attach event listeners for change and input events
        input.addEventListener('change', handleChange);
        input.addEventListener('input', handleChange);
      } else {
        console.error(`Element with ID '${id}' not found.`);
      }
    });
  });

  return changedValues;
}