# af-react-table

### Install & use
`npm install --save af-react-table`

### Features
* All heights are calculated automatically, so there is no need to provide them.
* Sortable
* Optimized non-recursize segment tree is used to store row dimensions.
* mobx-ready Row and Cell components, which can be easily wrapped by observer
* available height and width are calculated and observed automatically via `use-resize-observer` hook
* `scrollToRow(rowIndex)` method is available
* fixed and auto table layout mode
* -N ... 0 rowCount handling available via `rowCountWarningsTable` prop
* `useApi` can give table any table subcomponent access to global API
* renders `table`, `tr`, `td`, `th`, so default table styling, border collapsing, etc. can be easily applied.
* small size ([playground bundle contents](https://nowaalex.github.io/af-react-table/exampleAssets/bundle.html))


### PropTypes
```javascript
Table.propTypes = {
    columns: PropTypes.array.isRequired,
    getRowData: PropTypes.func.isRequired,

    headless: PropTypes.bool,
    className: PropTypes.string,
    rowCount: PropTypes.number,
    getRowKey: PropTypes.func,
    estimatedRowHeight: PropTypes.number,
    getRowExtraProps: PropTypes.func,
    overscanRowsCount: PropTypes.number,

    HeaderRowComponent: PropTypes.any,
    RowComponent: PropTypes.any,
    CellComponent: PropTypes.any,

    RowCountWarningContainer: PropTypes.any,
    rowCountWarningsTable: PropTypes.object,
    fixedLayout: PropTypes.bool
};

Table.defaultProps = {
    rowCount: 0,
    estimatedRowHeight: 20,
    overscanRowsCount: 4,
    fixedLayout: false,
    headless: false,

    /*
        For 90% non-reactive solutions, which only provide new getRowData when data is changed, memo is ok.
        If RowComponent should be wrapped my mobx observer - non-memo version should be imported.
        memo(observer(RowComponentDefault)) will do the trick.
    */
    RowComponent: memo( RowComponentDefault ),
    CellComponent: CellComponentDefault,
    RowCountWarningContainer: RowCountWarningContainerDefault,
};
```

### Demo
* [**Customizable playground**](https://nowaalex.github.io/af-react-table/exampleAssets/)

### TODO
* happens rarely(after certain width changes), but sometimes I can't scroll to last index(it trembles and hides)
* add rerenderCurrentRange() method
* show example source in playground
* write documentation
* implement position: sticky where it is supported
* maybe pass props via context somehow to avoid memos and deep passing?
* as models are extensible and most of the logics is taken away from react, it should be easy to implement List
* improve performance on mobile
* add footer with column summaries
* mobile scroll flickering
* maybe remove react focus evt
* dynamically adjust estimatedRowHeight on width change( otherwise too few or too much rows could be rendered sometimes)