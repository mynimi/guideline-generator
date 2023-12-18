type InputTypes = 'number' | 'color' | 'checkbox' | 'radio';

export type FieldConfig = {
  initValue: string | number | boolean;
  labelText: string;
  min?: string;
  max?: string;
  step?: string;
  inputType: InputTypes;
  cat: 'basic' | 'advanced';
};

export type GroupedFormConfig = {
  [legend: string]: {
    [id: string]: FieldConfig;
  };
};


export function generateForm(config: GroupedFormConfig): HTMLFormElement {
  const form = document.createElement('form');
  const toggleVisibility = (category: string) => {
    const elements = form.querySelectorAll(`[data-cat]`);
    elements.forEach((el: HTMLElement) => {
      if (el.getAttribute('data-cat') === category || category === 'all') {
        el.parentElement.classList.remove('hidden');
      } else {
        el.parentElement.classList.add('hidden');
      }
    });
  };
  
  const radioContainer = document.createElement('div');
  radioContainer.classList.add('view-switch');
  
  const basicRadio = document.createElement('input');
  basicRadio.type = 'radio';
  basicRadio.classList.add('visually-hidden');
  basicRadio.name = 'category';
  basicRadio.value = 'basic';
  basicRadio.id = 'basicRadio';
  basicRadio.checked = true; // Set default to 'basic'
  basicRadio.addEventListener('change', () => toggleVisibility('basic'));

  const basicLabel = document.createElement('label');
  basicLabel.htmlFor = 'basicRadio';
  basicLabel.textContent = 'Basic';

  const advancedRadio = document.createElement('input');
  advancedRadio.type = 'radio';
  advancedRadio.classList.add('visually-hidden');
  advancedRadio.name = 'category';
  advancedRadio.value = 'advanced';
  advancedRadio.id = 'advancedRadio';
  advancedRadio.addEventListener('change', () => toggleVisibility('advanced'));

  const advancedLabel = document.createElement('label');
  advancedLabel.htmlFor = 'advancedRadio';
  advancedLabel.textContent = 'Advanced';

  radioContainer.appendChild(basicRadio);
  radioContainer.appendChild(basicLabel);
  radioContainer.appendChild(advancedRadio);
  radioContainer.appendChild(advancedLabel);
  form.appendChild(radioContainer);

  Object.entries(config).forEach(([legend, fields]) => {
    const fieldset = document.createElement('fieldset');
    const fieldsetLegend = document.createElement('legend');
    fieldsetLegend.textContent = legend;
    fieldset.appendChild(fieldsetLegend);

    Object.entries(fields).forEach(([id, configData]) => {
      const label = document.createElement('label');
      label.textContent = configData.labelText;
      label.classList.add(`field`);
      label.classList.add(`field--${configData.inputType}`);

      const input = document.createElement('input');
      input.type = configData.inputType;

      input.id = id;
      input.name = id;

      // Set data-cat attribute for categorization
      input.setAttribute('data-cat', configData.cat);

      if (configData.inputType === 'checkbox' || configData.inputType === 'radio') {
        input.checked = configData.initValue as boolean;
      } else {
        input.value = configData.initValue.toString();
      }

      if (configData.inputType === 'number') {
        if (configData.min) {
          input.min = configData.min;
        }
        if (configData.max) {
          input.max = configData.max;
        }
        if (configData.step) {
          input.step = configData.step;
        }
      }

      label.appendChild(input);
      fieldset.appendChild(label);
    });

    form.appendChild(fieldset);
  });

  // Initially hide advanced fields
  toggleVisibility('basic');

  return form;
}
