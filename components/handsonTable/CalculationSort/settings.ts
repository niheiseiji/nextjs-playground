import Handsontable from 'handsontable';

export const excludeSort = (hotTableRef:React.RefObject<HotTable>) => {
    const hotInstance = hotTableRef?.current.hotInstance;
    const lastRowIndex = hotInstance.countRows() - 1;

    // 各ソートの後、行 1 を取り出し、そのインデックスを 0 に変更します。
    // hotInstance.rowIndexMapper.moveIndexes(hotInstance.toVisualRow(0), 0);
    // 各ソートの後、行16を取り、そのインデックスを15に変更する。
    hotInstance.rowIndexMapper.moveIndexes(hotInstance.toVisualRow(lastRowIndex), lastRowIndex);
};

export const excludeFilter = (hotTableRef:React.RefObject<HotTable>) => {
    let hotInstance = hotTableRef?.current.hotInstance;
    let filtersRowsMap = hotInstance.getPlugin('filters').filtersRowsMap;

    // 0行目をfilterしない
    // filtersRowsMap.setValueAtIndex(0, false);
    // 最終行目をfilterしない
    filtersRowsMap.setValueAtIndex(filtersRowsMap.indexedValues.length - 1, false);
};