import './style.scss'

import { GraphGrid } from './graphGrid-standalone';
import {GridPage} from './GridPage';
import { GraphGridPage } from './GraphGridPage';
import {DotGridPage} from './DotGridPage';
import {CalligraphyLinePage} from './CalligraphyLinePage';
import {CalligraphyAreaPage} from './CalligraphyAreaPage';
console.log('test');

// new CalligraphyLinePage();
new CalligraphyAreaPage({documentHeight: 100, documentWidth: 100, slantAngle: 55});
// new DotGridPage();
// new GraphGridPage();