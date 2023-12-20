import './style.scss'

import { GraphGrid } from './graphGrid-standalone';
import {GridPage} from './GridPage';
import { GraphGridPage } from './GraphGridPage';
import {DotGridPage} from './DotGridPage';
import {CalligraphyLinePage} from './CalligraphyLinePage';
import {CalligraphyAreaPage} from './CalligraphyAreaPage';
console.log('test');

new CalligraphyLinePage({container: document.querySelector('[data-calli-line]')});
new CalligraphyAreaPage({container: document.querySelector('[data-calli-area]')});
new DotGridPage({container: document.querySelector('[data-dot]')});
new GraphGridPage({container: document.querySelector('[data-graph]')});