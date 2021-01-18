import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';
import { formatMoney } from '@/utils/utils';

const FormItem = Form.Item;
const statusMap = ['error', 'success'];
const status = ['失败', '成功'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, mainAccount, accountTypes } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  if (!mainAccount) return null;
  return (
    <Modal
      destroyOnClose
      title="新建账户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="主账户">
            {form.getFieldDecorator('parent')(
              <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                {mainAccount.map(element => (
                  <Select.Option key={element.id}>{element.nameCn}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="账户类型">
            {form.getFieldDecorator('type')(
              <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                {accountTypes.map(element => (
                  <Select.Option key={element.id}>{element.nameCn}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录账号">
            {form.getFieldDecorator('loginId', {
              rules: [{ required: false, message: '请输入账号', min: 3 }],
            })(<Input placeholder="默认使用主账户手机号" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="APP所在设备">
            {form.getFieldDecorator('appLocation', {
              rules: [{ required: false, message: 'APP所在设备', min: 2 }],
            })(<Input placeholder="默认使用主账户手机" />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录密码">
            {form.getFieldDecorator('loginPwd', {
              rules: [{ required: false, message: '默认使用主账户登录密码', min: 2 }],
            })(<Input placeholder="默认使用主账户登录密码" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="交易密码">
            {form.getFieldDecorator('tradePwd', {
              rules: [{ required: false, message: '默认使用主账户交易密码', min: 2 }],
            })(<Input placeholder="默认使用主账户登录密码" />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    updateModalVisible,
    form,
    handleUpdate,
    handleUpdateModalVisible,
    mainAccount,
    accountTypes,
    record,
  } = props;
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
      title="更新账户"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
      width={800}
    >
      <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="主账户">
            {form.getFieldDecorator('parent', { initialValue: record.parent })(
              <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                {mainAccount.map(element => (
                  <Select.Option key={element.id}>{element.nameCn}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="账户类型">
            {form.getFieldDecorator('type', { initialValue: record.type })(
              <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                {accountTypes.map(element => (
                  <Select.Option key={element.id}>{element.nameCn}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录账号">
            {form.getFieldDecorator('loginId', {
              initialValue: record.loginId,
              rules: [{ required: false, message: '请输入账号', min: 3 }],
            })(<Input placeholder="默认使用主账户手机号" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="APP所在设备">
            {form.getFieldDecorator('appLocation', {
              initialValue: record.appLocation,
              rules: [{ required: false, message: '请输入APP所在设备', min: 2 }],
            })(<Input placeholder="默认使用主账户手机" />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录密码">
            {form.getFieldDecorator('loginPwd', {
              initialValue: record.loginPwd,
              rules: [{ required: false, message: '请输入登录密码', min: 2 }],
            })(<Input placeholder="默认使用主账户登录密码" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="交易密码">
            {form.getFieldDecorator('tradePwd', {
              initialValue: record.tradePwd,
              rules: [{ required: false, message: '请输入交易密码', min: 2 }],
            })(<Input placeholder="默认使用主账户登录密码" />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 2, lg: 2, xl: 2 }}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账号">
            {form.getFieldDecorator('accountNo', {
              initialValue: record.accountNo,
              rules: [{ required: false, message: '请输入账号', min: 2 }],
            })(<Input placeholder="" />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="账户余额">
            {form.getFieldDecorator('balance', {
              initialValue: record.balance,
              rules: [{ required: false, message: '请输入账户余额' }],
            })(<InputNumber placeholder="" />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ investment, loading, user }) => ({
  mainAccount: investment.mainAccounts,
  subAccount: investment.subAccounts,
  accountTypes: investment.accountTypes,
  currentUser: user.currentUser,
  loading: loading.models.investment,
}))
@Form.create()
class MainAccountList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    updateFormValues: {},
  };

  columns = [
    {
      title: '',
      render: (text, record, index) => {
        return <span style={{ align: 'center' }}>{index + 1}</span>;
      },
    },
    {
      title: '账户名称',
      dataIndex: 'nameCn',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '账户类型',
      dataIndex: 'type',
    },
    {
      title: '账户余额',
      dataIndex: 'balance',
      align: 'right',
      // sorter: true,
      render: val => `${formatMoney(val)} `,
      // mark to display a total number
      sorter: (a, b) => a.balance - b.balance,
      needTotal: true,
    },
    {
      title: '上次调度时间',
      dataIndex: 'lastOperationAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
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
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id, record) => (
        <Fragment>
          <a onClick={() => this.logon(id)}>登录</a>
          <Divider type="vertical" />
          <a onClick={() => this.queryBalance(id)}>查询余额</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>更新</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'investment/queryAccountTypes',
    });
    dispatch({
      type: 'investment/queryMainAccounts',
      payload: {
        owner: currentUser.id,
      },
    });
    dispatch({
      type: 'investment/querySubAccounts',
      payload: {
        owner: currentUser.id,
        parent: '',
        type: '',
      },
    });
  }

  logon = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/logon',
      payload: {
        id,
      },
    });
  };

  queryBalance = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/queryBalance',
      payload: {
        id,
      },
    });
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
      case 'logon':
        selectedRows.forEach(row => {
          this.logon(row.id);
        });
        break;
      case 'queryBalance':
        selectedRows.forEach(row => {
          this.queryBalance(row.id);
        });
        break;
      default:
        break;
    }
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form, currentUser } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'investment/querySubAccounts',
        payload: {
          owner: currentUser.id,
          parent: fieldsValue.parent || '',
          type: fieldsValue.type || '',
        },
      });
    });

    this.setState({
      selectedRows: [],
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/addAccount',
      payload: {
        ...fields,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { updateFormValues } = this.state;

    dispatch({
      type: 'investment/updateAccount',
      payload: {
        ...fields,
        id: updateFormValues.id,
      },
    });
    message.success('更新成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm = (accountTypes, mainAccount) => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="主账户">
              {getFieldDecorator('parent')(
                <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                  {mainAccount.map(element => (
                    <Select.Option key={element.id}>{element.nameCn}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="账户类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" allowClear="true" style={{ width: '100%' }}>
                  {accountTypes.map(element => (
                    <Select.Option key={element.id}>{element.nameCn}</Select.Option>
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

  render() {
    const { mainAccount, subAccount, accountTypes } = this.props;

    const data = {
      list: subAccount,
    };

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="logon">登录</Menu.Item>
        <Menu.Item key="queryBalance">查询余额</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };
    const { selectedRows, modalVisible, updateModalVisible, updateFormValues } = this.state;

    if (!mainAccount || !accountTypes) return null;

    return (
      <PageHeaderWrapper title="子账户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm(accountTypes, mainAccount)}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      批量操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              data={data}
              selectedRows={selectedRows}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              pagination={{ pageSize: 300, hideOnSinglePage: true }}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          mainAccount={mainAccount}
          accountTypes={accountTypes}
        />
        <UpdateForm
          {...parentMethods}
          updateModalVisible={updateModalVisible}
          mainAccount={mainAccount}
          accountTypes={accountTypes}
          record={updateFormValues}
        />
      </PageHeaderWrapper>
    );
  }
}

export default MainAccountList;
