import React, { memo } from "react";
import PropTypes from "prop-types";
import { css, cx } from "emotion";

import Context from "./Context";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import VirtualTableDataStore from "./models/Table";

import RowComponentDefault from "./defaultComponents/Row";
import CellComponentDefault from "./defaultComponents/Cell";
import RowCountWarningContainerDefault from "./defaultComponents/RowCountWarningContainer";


/*
    * flex: 1 1 auto, assuming that table would be used full-stretch mostly
    * border-box is important, because head th widths are synced with td widths
    width: 100% covers case, when no tbody is rendered and exact width cannot be calculated
*/
const wrapperClass = css`
    display: flex;
    flex: 1 1 auto;
    flex-flow: column nowrap;
    overflow: hidden;

    * {
        box-sizing: border-box;
    }
`;

/*
    If we provide a ref to a class component, we could access Data and call it's methods from outside( Data.scrollTo(), etc. ).
    Functional components encapsulate internals, so to keep this flexibility we use class components here.
*/
class Table extends React.PureComponent {

    scrollContainerRef = React.createRef();
    tbodyRef = React.createRef();

    constructor( props ){
        super( props );

        this.Data = new VirtualTableDataStore({
            overscanRowsCount: props.overscanRowsCount,
            columns: props.columns,
            totalRows: props.rowCount,
            rowDataGetter: props.getRowData,
            rowKeyGetter: props.getRowKey,
            estimatedRowHeight: props.estimatedRowHeight,
            headlessMode: props.headless,
            getRowsContainerNode: () => this.tbodyRef.current,
            getScrollContainerNode: () => this.scrollContainerRef.current
        });
    }
    
    componentDidUpdate(){
        /*
            Order is important here!
            TODO:
                write order tests
        */
        const { rowCount, columns, estimatedRowHeight, overscanRowsCount, getRowData, getRowKey, headless } = this.props;
        this.Data
            .setHeadlessMode( headless )
            .setRowDataGetter( getRowData )
            .setRowKeyGetter( getRowKey )
            .setOverscanRowsCount( overscanRowsCount )
            .setColumns( columns )
            .setTotalRows( rowCount )
            .setEstimatedRowHeight( estimatedRowHeight );        
    }

    componentWillUnmount(){
        this.Data.destructor();
    }

    render(){

        const {
            columns,
            getRowData,
            getRowKey,
            getRowExtraProps,
            rowCount,
            estimatedRowHeight,
            overscanRowsCount,
            rowCountWarningsTable,
            fixedLayout,
            headless,

            RowComponent,
            CellComponent,
            RowCountWarningContainer,
            className,

            ...props
        } = this.props;

        return (
            <Context.Provider value={this.Data}>
                <div className={cx(wrapperClass, className )} {...props}>
                    { headless ? null : <TableHead /> }
                    { rowCount > 0 ? (
                        <TableBody
                            scrollContainerRef={this.scrollContainerRef}
                            tbodyRef={this.tbodyRef}
                            getRowExtraProps={getRowExtraProps}
                            RowComponent={RowComponent}
                            CellComponent={CellComponent}
                            fixedLayout={fixedLayout}
                        />
                    ) : rowCountWarningsTable ? (
                        <RowCountWarningContainer>
                            {rowCountWarningsTable[rowCount]}
                        </RowCountWarningContainer>
                    ) : null }
                </div>
            </Context.Provider>
        );
    };
}

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

export default Table;