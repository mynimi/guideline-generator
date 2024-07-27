import {atom} from 'nanostores';
import type {GridConfig, GridType} from './src/types/shared';

let currentGridConfig:GridConfig = {};
let currentGridType:GridType = 'line';

export const $currentGridType = atom(currentGridType);
export const $gridConfig = atom(currentGridConfig);