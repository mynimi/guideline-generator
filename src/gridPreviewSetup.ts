import {CalligraphyAreaPage} from "./CalligraphyAreaPage";
import {CalligraphyLinePage} from "./CalligraphyLinePage";
import {DotGridPage} from "./DotGridPage";
import {GraphGridPage} from "./GraphGridPage";

export function setupGridPreviews(): void {
  const previewConfig = {
    documentWidth: 40,
    documentHeight: 40,
    documentMarginTop: 2,
    documentMarginBottom: 0,
    documentMarginLeft: 2,
    documentMarginRight: 2,
    areaBorderRadius: 3,
    addTitle: false,
    textFontSize: 0,
    textLineHeight: 0,
  };

  new DotGridPage({
    container: document.querySelector("[data-dot-preview]"),
    ...previewConfig,
    dotSize: 1,
    cellSize: 5,
  });

  new CalligraphyLinePage({
    container: document.querySelector("[data-calli-line-preview]"),
    ...previewConfig,
    xHeight: 4,
    areaBlockBuffer: 2,
  });

  new CalligraphyAreaPage({
    container: document.querySelector("[data-calli-area-preview]"),
    ...previewConfig,
    xHeight: 10,
  });

  new GraphGridPage({
    container: document.querySelector("[data-graph-preview]"),
    ...previewConfig,
    gridStrokeWidth: 0.4,
    cellSize: 5,
  });
}