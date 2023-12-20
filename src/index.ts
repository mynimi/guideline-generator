import './style.scss'

import {DotGridPage} from './DotGridPage';
import {CalligraphyLinePage} from './CalligraphyLinePage';
import {CalligraphyAreaPage} from './CalligraphyAreaPage';
import {GraphGridPage} from './GraphGridPage';
import {GridPageConfig} from './GridPage';

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