import type {CalligraphyAreaPageConfig} from "../guideline-generator/CalligraphyAreaMaker";
import type {CalligraphyLinePageConfig} from "../guideline-generator/CalligraphyLineMaker";
import type {DotGridPageConfig} from "../guideline-generator/DotGridMaker";
import type {GraphGridPageConfig} from "../guideline-generator/GraphGridMaker";

export type GridType = "line" | "area" | "dot" | "graph";
export type GridConfig = CalligraphyAreaPageConfig | CalligraphyLinePageConfig | DotGridPageConfig | GraphGridPageConfig;
