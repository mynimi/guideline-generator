type InputTypes = 'number' | 'color' | 'checkbox';

export type FormConfig = {
  [id: string]: {
    initValue: string | number | boolean;
    labelText: string;
    min?: string;
    max?: string;
    step?: string;
    inputType: InputTypes;
    // cat: 'basic' | 'advanced';
  };
};

export function generateForm(config: FormConfig): HTMLFormElement {
  const form = document.createElement('form');

  Object.entries(config).forEach(([id, configData]) => {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = configData.labelText;
    fieldset.appendChild(legend);

    const label = document.createElement('label');
    const span = document.createElement('span');
    span.textContent = configData.labelText;
    label.appendChild(span);

    const input = document.createElement('input');
    input.type = configData.inputType;

    input.id = id;
    input.name = id;

    if (configData.inputType === 'checkbox') {
      input.checked = configData.initValue as boolean;
    } else {
      input.value = configData.initValue.toString();
    }
    if(configData.inputType === 'number'){
      if(configData.min){
        input.min = configData.min;
      }
      if(configData.max){
        input.max = configData.max;
      }
      if(configData.step){
        input.step = configData.step;
      }
    }
    label.appendChild(input);

    fieldset.appendChild(label);
    form.appendChild(fieldset);
  });

  return form;
}