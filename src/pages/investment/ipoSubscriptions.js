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
  Badge,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { formatMoney } from '@/utils/utils';
import styles from './TableList.less';

const statusMap = ['error', 'success', 'processing'];
const status = ['失败', '成功', '...'];

const FormItem = Form.Item;

const UpdateForm = Form.create()(props => {
  const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible, record } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      const v = {
        ...fieldsValue,
        subscriptionType: fieldsValue.subscriptionType == true ? '1' : '0', //eslint-disable-line
      };
      handleUpdate(v);
    });
  };

  const onChange = e => {
    e.preventDefault();
    if (e.target.value === '0')
      form.setFieldsValue({ interest: 0, commissionFee: record.cashCommissionFee });
    else {
      form.setFieldsValue({ commissionFee: record.financeCommissionFee });
    }
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
          {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="融资">
            {form.getFieldDecorator('subscriptionType', {
              initialValue: record.subscriptionType == '1', //eslint-disable-line
              valuePropName: 'checked',
              // rules: [{ required: false, message: '请选择是否融资' }],
            })(<Switch onChange={onChange} />)}
          </FormItem> */}
          <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="申购方式">
            {form.getFieldDecorator('subscriptionType', {
              initialValue: record.subscriptionType, //eslint-disable-line
              valuePropName: 'value',
            })(
              <Radio.Group onChange={onChange}>
                <Radio value="0">现金</Radio>
                <Radio value="1">融资</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="利息">
            {form.getFieldDecorator('interest', {
              initialValue: record.interest,
              rules: [{ required: false, message: '请输入利息' }],
            })(<InputNumber placeholder="利息" min={0} />)}
          </FormItem>
        </Col>
      </Row>

      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手续费">
            {form.getFieldDecorator('commissionFee', {
              initialValue: record.commissionFee,
              rules: [{ required: false, message: '请输入手续费' }],
            })(<InputNumber placeholder="手续费" min={0} />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="申购费">
            {form.getFieldDecorator('subscriptionFee', {
              initialValue: record.subscriptionFee,
              rules: [{ required: false, message: '请输入申购费' }],
            })(<InputNumber placeholder="申购费" min={0} />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="计划申购数量">
            {form.getFieldDecorator('planIPO', {
              initialValue: record.planIPO,
              rules: [{ required: false, message: '请输入计划申购数量' }],
            })(<InputNumber placeholder="计划申购数量" min={0} />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实际申购数量">
            {form.getFieldDecorator('numberOfShares', {
              initialValue: record.numberOfShares,
              rules: [{ required: false, message: '请输入实际申购数量' }],
            })(<InputNumber placeholder="实际申购数量" min={0} />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
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
          this.addPlan(row);
        });
        break;
      case 'ipo':
        selectedRows.forEach(row => {
          this.addIPO(row);
        });
        break;
      case 'sign':
        selectedRows.forEach(row => {
          this.querySign(row);
        });
        break;
      default:
        break;
    }
  };

  setProcessing = (dispatch, record) => {
    dispatch({
      type: 'investment/setIPOProcessing',
      payload: {
        data: record,
      },
    });
  };

  addPlan = record => {
    const { dispatch } = this.props;
    this.setProcessing(dispatch, record);
    dispatch({
      type: 'investment/addPlan',
      payload: {
        id: record.id,
        stockId: record.stockId,
      },
    });
  };

  removePlan = record => {
    const { dispatch } = this.props;
    this.setProcessing(dispatch, record);
    dispatch({
      type: 'investment/removePlan',
      payload: {
        id: record.id,
        stockId: record.stockId,
      },
    });
  };

  addIPO = record => {
    const { dispatch } = this.props;
    this.setProcessing(dispatch, record);

    dispatch({
      type: 'investment/ipo',
      payload: {
        id: record.id,
        stockId: record.stockId,
      },
    });
  };

  addFinanceIPO = record => {
    const { dispatch } = this.props;
    this.setProcessing(dispatch, record);

    dispatch({
      type: 'investment/addFinanceIPO',
      payload: {
        id: record.id,
        stockId: record.stockId,
      },
    });
  };

  cancelFinanceIPO = record => {
    const { dispatch } = this.props;
    this.setProcessing(dispatch, record);

    dispatch({
      type: 'investment/cancelFinanceIPO',
      payload: {
        id: record.id,
        stockId: record.stockId,
      },
    });
  };

  querySign = record => {
    const { dispatch } = this.props;
    this.setProcessing(dispatch, record);
    dispatch({
      type: 'investment/sign',
      payload: {
        id: record.id,
        stockId: record.stockId,
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
      type: 'investment/updateIPO',
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
        title: '',
        align: 'center',
        render: (text, record, index) => {
          return <span style={{ align: 'center' }}>{index + 1}</span>;
        },
        width: 60,
        fixed: 'left',
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
        fixed: 'left',
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
        fixed: 'left',
      },
      {
        title: '资金',
        width: 140,
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        render: val => `${formatMoney(val)} `,
        sorter: (a, b) => a.balance - b.balance,
        sortOrder: sortedInfo.columnKey === 'balance' && sortedInfo.order,
        needTotal: true,
      },
      // {
      //   title: '入场费',
      //   width: 120,
      //   dataIndex: 'adminssionFee',
      //   key: 'adminssionFee',
      //   align: 'right',
      //   render: val => `${formatMoney(val)} `,
      //   sorter: (a, b) => a.adminssionFee - b.adminssionFee,
      //   sortOrder: sortedInfo.columnKey === 'adminssionFee' && sortedInfo.order,
      //   needTotal: true,
      // },

      {
        title: '融资',
        width: 100,
        dataIndex: 'subscriptionType',
        key: 'subscriptionType',
        align: 'right',
        filters: [{ text: '0', value: '0' }, { value: '1', text: '1' }],
        filteredValue: filteredInfo.subscriptionType || null,
        onFilter: (value, record) => record.subscriptionType == value, //eslint-disable-line
        sorter: (a, b) => a.subscriptionType.localeCompare(b.subscriptionType),
        sortOrder: sortedInfo.columnKey === 'subscriptionType' && sortedInfo.order,
        ellipsis: true,
        // needTotal: true,
      },
      {
        title: '手续费',
        width: 120,
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
        title: '利息',
        width: 100,
        dataIndex: 'interest',
        key: 'interest',
        align: 'right',
        // filters: interest,
        // filteredValue: filteredInfo.interest || null,
        // onFilter: (value, record) => record.interest == value, //eslint-disable-line
        sorter: (a, b) => a.interest - b.interest,
        sortOrder: sortedInfo.columnKey === 'interest' && sortedInfo.order,
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
        title: '计划',
        width: 100,
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
        title: '申购',
        width: 100,
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
        title: '中签',
        width: 100,
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
      // {
      //   title: '上次调度时间',
      //   dataIndex: 'lastOperationAt',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '执行状态',
        dataIndex: 'lastOperationStatus',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        width: 240,
        fixed: 'right',
        align: 'center',
        // dataIndex: 'id',
        render: record => (
          <Fragment>
            {record.planIPO < 1 && <a onClick={() => this.addPlan(record)}>加入计划</a>}
            {record.planIPO > 0 && <a onClick={() => this.removePlan(record)}>取消计划</a>}
            <Divider type="vertical" />
            <a onClick={() => this.addIPO(record)}>现金</a>
            <Divider type="vertical" />
            <a onClick={() => this.addFinanceIPO(record)}>融资</a>
            <Divider type="vertical" />
            <a onClick={() => this.cancelFinanceIPO(record)}>暂停</a>
            <Divider type="vertical" />
            <a onClick={() => this.querySign(record)}>中签</a>
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
                scroll={{ x: 1600, y: 800 }}
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
