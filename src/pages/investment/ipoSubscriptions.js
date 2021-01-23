import React, { Fragment } from 'react';
import {
  Button,
  Card,
  Form,
  Select,
  Row,
  Col,
  Menu,
  Dropdown,
  Icon,
  Divider,
  Modal,
  Input,
  InputNumber,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { formatMoney } from '@/utils/utils';
import styles from './TableList.less';

const FormItem = Form.Item;

const UpdateForm = Form.create()(props => {
  const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible, record } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  if (!updateModalVisible) return null;
  return (
    <Modal
      destroyOnClose
      title="更新申购情况"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
      width={800}
    >
      <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="券商">
            {form.getFieldDecorator('type', {
              initialValue: record.type,
              rules: [{ required: false, message: '请输入券商', min: 1 }],
            })(<Input placeholder="券商" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账户">
            {form.getFieldDecorator('nameCn', {
              initialValue: record.nameCn,
              rules: [{ required: false, message: '请输入账户', min: 1 }],
            })(<Input placeholder="账户" />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="申购费">
            {form.getFieldDecorator('subscriptionFee', {
              initialValue: record.subscriptionFee,
              rules: [{ required: false, message: '请输入申购费', min: 0 }],
            })(<InputNumber placeholder="申购费" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="计划申购数量">
            {form.getFieldDecorator('planIPO', {
              initialValue: record.planIPO,
              rules: [{ required: false, message: '请输入计划申购数量' }],
            })(<InputNumber placeholder="计划申购数量" min={0} />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实际申购数量">
            {form.getFieldDecorator('numberOfShares', {
              initialValue: record.numberOfShares,
              rules: [{ required: false, message: '请输入实际申购数量' }],
            })(<InputNumber placeholder="实际申购数量" min={0} />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="中签数量">
            {form.getFieldDecorator('numberOfSigned', {
              initialValue: record.numberOfSigned,
              rules: [{ required: false, message: '请输入中签数量' }],
            })(<InputNumber placeholder="中签数量" min={0} />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

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
    // modalVisible: false,
    updateModalVisible: false,
    updateFormValues: {},
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
          stockId: fieldsValue.stockId,
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
          stockId: fieldsValue.stockId,
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
              {getFieldDecorator('stockId')(
                <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                  {stocks.map(element => (
                    <Select.Option key={element.id}>{element.name}</Select.Option>
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
          this.addPlan(row.id, row.stockId);
        });
        break;
      case 'ipo':
        selectedRows.forEach(row => {
          this.addIPO(row.id, row.stockId);
        });
        break;
      case 'sign':
        selectedRows.forEach(row => {
          this.querySign(row.id, row.stockId);
        });
        break;
      default:
        break;
    }
  };

  addPlan = (id, stockId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/addPlan',
      payload: {
        id,
        stockId,
      },
    });
  };

  addIPO = (id, stockId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/ipo',
      payload: {
        id,
        stockId,
      },
    });
  };

  querySign = (id, stockId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/sign',
      payload: {
        id,
        stockId,
      },
    });
  };

  // handleModalVisible = flag => {
  //   this.setState({
  //     modalVisible: !!flag,
  //   });
  // };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { updateFormValues } = this.state;

    dispatch({
      type: 'investment/updateIpo',
      payload: {
        ...fields,
        id: updateFormValues.id,
      },
    });
    // message.success('更新成功');
    this.handleUpdateModalVisible();
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
    // const { selectedRows } = this.state;
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
        width: 100,
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
        width: 100,
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
        width: 140,
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
        width: 140,
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
        width: 140,
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
        width: 140,
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
        width: 240,
        // dataIndex: 'id',
        render: record => (
          <Fragment>
            <a onClick={() => this.addPlan(record.id, record.stockId)}>计划</a>
            <Divider type="vertical" />
            <a onClick={() => this.addIPO(record.id, record.stockId)}>申购</a>
            <Divider type="vertical" />
            <a onClick={() => this.querySign(record.id, record.stockId)}>中签</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>更新</a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleUpdate: this.handleUpdate,
      // handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };
    const { selectedRows, updateModalVisible, updateFormValues } = this.state;

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
        <UpdateForm
          {...parentMethods}
          updateModalVisible={updateModalVisible}
          record={updateFormValues}
        />
      </PageHeaderWrapper>
    );
  }
}

export default IPOSubscriptions;
