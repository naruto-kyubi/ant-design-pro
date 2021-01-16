import React from 'react';
import { Table, Button, Card, Form, Select, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import styles from './TableList.less';

const FormItem = Form.Item;

@connect(({ investment, loading, user }) => ({
  mainAccount: investment.mainAccounts,
  subAccount: investment.subAccounts,
  accountTypes: investment.accountTypes,
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
          nameCn: '%',
          type: '%',
        },
      });
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
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

  render() {
    const { ipoSubscriptions, stocks } = this.props;

    const data = ipoSubscriptions;

    let { sortedInfo, filteredInfo } = this.state;
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
        render: (text, record, index) => {
          return <span style={{ align: 'center' }}>{index + 1}</span>;
        },
      },
      {
        title: '券商',
        dataIndex: 'type',
        key: 'type',
        filters: types,
        filteredValue: filteredInfo.type || null,
        onFilter: (value, record) => record.type.includes(value),
        sorter: (a, b) => a.type.length - b.type.length,
        sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '姓名',
        dataIndex: 'nameCn',
        key: 'nameCn',
        filters: nameCns,
        filteredValue: filteredInfo.nameCn || null,
        onFilter: (value, record) => record.nameCn.includes(value),
        sorter: (a, b) => a.nameCn.length - b.nameCn.length,
        sortOrder: sortedInfo.columnKey === 'nameCn' && sortedInfo.order,
        ellipsis: true,
      },
      { title: '账户资金', dataIndex: 'balance', key: 'balance' },
      { title: '申购数量', dataIndex: 'numberOfShares', key: 'numberOfShares' },
      {
        title: '中签数量',
        dataIndex: 'numberOfSigned',
        key: 'numberOfSigned',
        filters: numberOfSigneds,
        filteredValue: filteredInfo.numberOfSigned || null,
        onFilter: (value, record) => record.numberOfSigned == value, //eslint-disable-line
        sorter: (a, b) => a.numberOfSigned - b.numberOfSigned,
        sortOrder: sortedInfo.columnKey === 'numberOfSigned' && sortedInfo.order,
        ellipsis: true,
      },
    ];

    return (
      <PageHeaderWrapper title="新股申购统计">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm(stocks)}</div>
            <div>
              <div className="table-operations">
                {/* <Button onClick={this.setAgeSort}>Sort age</Button> */}
                <Button onClick={this.clearFilters}>Clear filters</Button>
                <Button onClick={this.clearAll}>Clear filters and sorters</Button>
              </div>
              <Table
                columns={columns}
                dataSource={data}
                onChange={this.handleChange}
                pagination={false}
                size="small"
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default IPOSubscriptions;
