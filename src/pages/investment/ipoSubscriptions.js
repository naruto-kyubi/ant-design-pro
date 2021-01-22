import React, { Fragment } from 'react';
import { Button, Card, Form, Select, Row, Col, Menu, Dropdown, Icon, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { formatMoney } from '@/utils/utils';
import styles from './TableList.less';

const FormItem = Form.Item;

@connect(({ investment, loading, user }) => ({
  ipoSubscriptions: investment.ipoSubscriptions,
  stocks: investment.stocks,
  currentUser: user.currentUser,
  loading: loading.models.investment,
}))
@Form.create()
class IPOSubscriptions extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/queryStocks',
      payload: {},
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'investment/queryIPOSubscriptions',
        payload: {
          stockCode: fieldsValue.stockCode,
        },
      });
    });
    this.setState({
      selectedRows: [],
    });
  };

  handleImport = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'investment/importData',
        payload: {
          stockCode: fieldsValue.stockCode,
        },
      });
    });
    this.setState({
      selectedRows: [],
    });
  };

  renderSimpleForm = stocks => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="股票">
              {getFieldDecorator('stockCode')(
                <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                  {stocks.map(element => (
                    <Select.Option key={element.code}>{element.name}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" htmlType="button" onClick={this.handleImport}>
                导入申购账户
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  };

  groupBy = (array, id) => {
    const groups = {};
    array.forEach(o => {
      const group = o[id];
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return groups;
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleMenuClick = e => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'plan':
        selectedRows.forEach(row => {
          this.addPlan(row.id, row.stockCode);
        });
        break;
      case 'ipo':
        selectedRows.forEach(row => {
          this.addIPO(row.id, row.stockCode);
        });
        break;
      case 'sign':
        selectedRows.forEach(row => {
          this.querySign(row.id, row.stockCode);
        });
        break;
      default:
        break;
    }
  };

  addPlan = (id, stockCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/addPlan',
      payload: {
        id,
        stockCode,
      },
    });
  };

  addIPO = (id, stockCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/ipo',
      payload: {
        id,
        stockCode,
      },
    });
  };

  querySign = (id, stockCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/sign',
      payload: {
        id,
        stockCode,
      },
    });
  };

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="plan">加入计划</Menu.Item>
        <Menu.Item key="ipo">新股申购</Menu.Item>
        <Menu.Item key="sign">中签统计</Menu.Item>
      </Menu>
    );

    const { ipoSubscriptions, stocks } = this.props;

    const data = ipoSubscriptions;

    let { sortedInfo, filteredInfo } = this.state;
    const { selectedRows } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    let types = [];
    if (ipoSubscriptions) {
      types = Object.keys(this.groupBy(ipoSubscriptions, 'type'));
      types = types.map(x => {
        return { text: x, value: x };
      });
    }

    let nameCns = [];
    if (ipoSubscriptions) {
      nameCns = Object.keys(this.groupBy(ipoSubscriptions, 'nameCn'));
      nameCns = nameCns.map(x => {
        return { text: x, value: x };
      });
    }

    let commissionFee = [];
    if (ipoSubscriptions) {
      commissionFee = Object.keys(this.groupBy(ipoSubscriptions, 'commissionFee'));
      commissionFee = commissionFee.map(x => {
        return { text: x, value: x };
      });
    }

    let planIPOs = [];
    if (ipoSubscriptions) {
      planIPOs = Object.keys(this.groupBy(ipoSubscriptions, 'planIPO'));
      planIPOs = planIPOs.map(x => {
        return { text: x, value: x };
      });
    }

    let numberOfShares = [];
    if (ipoSubscriptions) {
      numberOfShares = Object.keys(this.groupBy(ipoSubscriptions, 'numberOfShares'));
      numberOfShares = numberOfShares.map(x => {
        return { text: x, value: x };
      });
    }

    let numberOfSigneds = [];
    if (ipoSubscriptions) {
      numberOfSigneds = Object.keys(this.groupBy(ipoSubscriptions, 'numberOfSigned'));
      numberOfSigneds = numberOfSigneds.map(x => {
        return { text: x, value: x };
      });
    }

    const columns = [
      {
        title: '序号',
        align: 'center',
        render: (text, record, index) => {
          return <span style={{ align: 'center' }}>{index + 1}</span>;
        },
        width: 80,
      },
      {
        title: '券商',
        width: 150,
        dataIndex: 'type',
        key: 'type',
        filters: types,
        filteredValue: filteredInfo.type || null,
        onFilter: (value, record) => record.type.includes(value),
        sorter: (a, b) => a.type.localeCompare(b.type),
        sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '姓名',
        width: 150,
        dataIndex: 'nameCn',
        key: 'nameCn',
        filters: nameCns,
        filteredValue: filteredInfo.nameCn || null,
        onFilter: (value, record) => record.nameCn.includes(value),
        sorter: (a, b) => a.nameCn.localeCompare(b.nameCn),
        sortOrder: sortedInfo.columnKey === 'nameCn' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '账户资金',
        width: 150,
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        render: val => `${formatMoney(val)} `,
        sorter: (a, b) => a.balance - b.balance,
        sortOrder: sortedInfo.columnKey === 'balance' && sortedInfo.order,
        needTotal: true,
      },
      {
        title: '入场费',
        width: 150,
        dataIndex: 'adminssionFee',
        key: 'adminssionFee',
        align: 'right',
        render: val => `${formatMoney(val)} `,
        sorter: (a, b) => a.adminssionFee - b.adminssionFee,
        sortOrder: sortedInfo.columnKey === 'adminssionFee' && sortedInfo.order,
        needTotal: true,
      },
      {
        title: '手续费',
        width: 150,
        dataIndex: 'commissionFee',
        key: 'commissionFee',
        align: 'right',
        filters: commissionFee,
        filteredValue: filteredInfo.commissionFee || null,
        onFilter: (value, record) => record.commissionFee == value, //eslint-disable-line
        sorter: (a, b) => a.commissionFee - b.commissionFee,
        sortOrder: sortedInfo.columnKey === 'commissionFee' && sortedInfo.order,
        ellipsis: true,
        needTotal: true,
      },
      {
        title: '申购费用',
        width: 150,
        dataIndex: 'subscriptionFee',
        key: 'subscriptionFee',
        align: 'right',
        render: val => `${formatMoney(val)} `,
        sorter: (a, b) => a.subscriptionFee - b.subscriptionFee,
        sortOrder: sortedInfo.columnKey === 'subscriptionFee' && sortedInfo.order,
        needTotal: true,
      },
      {
        title: '申购计划',
        width: 150,
        dataIndex: 'planIPO',
        key: 'planIPO',
        align: 'right',
        filters: planIPOs,
        filteredValue: filteredInfo.planIPO || null,
        onFilter: (value, record) => record.planIPO == value, //eslint-disable-line
        sorter: (a, b) => a.planIPO - b.planIPO,
        sortOrder: sortedInfo.columnKey === 'planIPO' && sortedInfo.order,
        ellipsis: true,
        needTotal: true,
      },
      {
        title: '申购数量',
        width: 150,
        dataIndex: 'numberOfShares',
        key: 'numberOfShares',
        align: 'right',
        filters: numberOfShares,
        filteredValue: filteredInfo.numberOfShares || null,
        onFilter: (value, record) => record.numberOfShares == value, //eslint-disable-line
        sorter: (a, b) => a.numberOfShares - b.numberOfShares,
        sortOrder: sortedInfo.columnKey === 'numberOfShares' && sortedInfo.order,
        ellipsis: true,
        needTotal: true,
      },
      {
        title: '中签数量',
        width: 150,
        dataIndex: 'numberOfSigned',
        key: 'numberOfSigned',
        align: 'right',
        filters: numberOfSigneds,
        filteredValue: filteredInfo.numberOfSigned || null,
        onFilter: (value, record) => record.numberOfSigned == value, //eslint-disable-line
        sorter: (a, b) => a.numberOfSigned - b.numberOfSigned,
        sortOrder: sortedInfo.columnKey === 'numberOfSigned' && sortedInfo.order,
        ellipsis: true,
        needTotal: true,
      },
      {
        title: '操作',
        width: 210,
        // dataIndex: 'id',
        render: record => (
          <Fragment>
            <a onClick={() => this.addPlan(record.id, record.stockCode)}>计划</a>
            <Divider type="vertical" />
            <a onClick={() => this.addIPO(record.id, record.stockCode)}>申购</a>
            <Divider type="vertical" />
            <a onClick={() => this.querySign(record.id, record.stockCode)}>中签</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="新股申购统计">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm(stocks)}</div>
            <div>
              <div className="tableListOperator">
                {selectedRows.length > 0 && (
                  <span>
                    <Dropdown overlay={menu}>
                      <Button>
                        批量操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )}
                {/* <Button onClick={this.setAgeSort}>Sort age</Button> */}
                <Button onClick={this.clearFilters}>Clear filters</Button>
                <Button onClick={this.clearAll}>Clear filters and sorters</Button>
              </div>

              <StandardTable
                rowKey="id"
                dataSource={data}
                selectedRows={selectedRows}
                onChange={this.handleChange}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                scroll={{ y: 800 }}
                pagination={{ pageSize: 500, hideOnSinglePage: true }}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default IPOSubscriptions;
