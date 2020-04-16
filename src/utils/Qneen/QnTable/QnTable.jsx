// 版本1.0.0
// 更新时间 2017年11月15日15:43:03
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Table } from 'antd';
import ColumnSwitch from '../ColumnSwitch/ColumnSwitch';
import isEqual from 'lodash/isEqual';
import './QnTable.less';

const log = console.log.bind(console);
class QnTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredColumns: this.props.columns,
    };
    // this.allColumnValues = this.getAllColumnValues(this.props.columns);
    // this.scrollX = 150 * (this.props.columns.length + 1);
  }

  componentDidMount() {}

  componentWillMount() {
    // const filteredColumns = this.getFilteredColumns(
    //   this.props.defaultColumnValues || this.allColumnValues,
    // );
    // this.setState({ filteredColumns });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.columns, this.props.columns)) {
      this.setState({ filteredColumns: nextProps.columns });
    }
  }

  componentDidUpdate = prevProps => {};

  render() {
    // log('defaultPageSize', this.props.defaultPageSize);
    const {
      columns,
      dataSource,
      total,
      loading,
      handlePageChange,
      handlePageSizeChange,
      expandedRowKeys,
      expandedRowRender,
      expandRowByClick,
      current,
      pageSize,
      hideOnSinglePage,
      rowSelection,
    } = this.props;
    let pagination = false;
    if (this.props.hasPagination) {
      if (this.props.paginationSetting) {
        pagination = this.props.paginationSetting;
      } else {
        pagination = {
          current,
          defaultCurrent: 1,
          pageSizeOptions: this.props.pageSizeOptions || ['5', '10', '20', '50', '100'],
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          defaultPageSize: this.props.defaultPageSize || 10,
          total,
          showTotal: (totalCount, range) => {
            return (
              <div className="fl">
                共 {totalCount} 条记录， 第 {range[0]} - {range[1]} 条
              </div>
            );
          },
        };
      }
    }
    return (
      <div className="QnTable">
        {/* {this.props.hasColumnSwitch ? (
          <ColumnSwitch
            columns={columns}
            defaultCheckedList={this.props.defaultColumnValues || this.allColumnValues}
            onChange={this.handleColumnSwitchChange}
          />
        ) : null} */}

        <Table
          {...this.props.otherProps}
          expandedRowRender={expandedRowRender ? record => expandedRowRender(record) : undefined}
          expandRowByClick={expandRowByClick}
          expandedRowKeys={expandedRowKeys || []}
          hideOnSinglePage={!!hideOnSinglePage}
          className="QnTableTable"
          columns={this.state.filteredColumns}
          dataSource={dataSource}
          rowClassName={() => {
            return 'titleRow';
          }}
          pageSize={pageSize}
          rowKey={this.props.rowKey}
          bordered={this.props.bordered}
          pagination={pagination}
          loading={loading}
          rowSelection={rowSelection}
          scroll={this.props.scroll}
        />
      </div>
    );
  }
}
QnTable.propTypes = {
  columns: propTypes.array,
  defaultColumnValues: propTypes.array, // 默认显示的列字段
  dataSource: propTypes.array,
  // total: propTypes.number, // 数据条数
  loading: propTypes.bool,
  handlePageChange: propTypes.func,
  handlePageSizeChange: propTypes.func,
  hasPagination: propTypes.bool,
  hasColumnSwitch: propTypes.bool,
  rowKey: propTypes.func,
};

QnTable.defaultProps = {
  columns: [],
  // c: [],
  current: 1,
  dataSource: [],
  total: 0, // 数据条数
  loading: false,

  handlePageChange: (pageNo, pageSize) => {},
  handlePageSizeChange: (pageNo, pageSize) => {},

  hasPagination: true,
  hasColumnSwitch: false,
  paginationSetting: false,
  expandedRowRender: false,
  rowSelection: null,
  rowKey: item => item.id,
  bordered: true,
  defaultPageSize: 10,
  scroll: {
    x: false,
    y: false,
  },
  otherProps: {},
};
export default QnTable;
