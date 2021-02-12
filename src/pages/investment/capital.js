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
  Table,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';
import { formatMoney } from '@/utils/utils';

const FormItem = Form.Item;

const transStatusMap = ['default', 'processing', 'success', 'error'];
const transStatus = ['计划', '执行中', '成功', '失败'];



@connect(({ investment, loading, user }) => ({
  mainAccount: investment.mainAccounts,
  fundTrans: investment.fundTrans,
  accountTypes: investment.accountTypes,
  currentUser: user.currentUser,
  loading: loading.models.investment,
}))
@Form.create()
class AccountList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    transModalVisible: false,
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
      title: '转出方',
      dataIndex: 'receivingAccount.accountType.nameCn',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '转出账户',
      dataIndex: 'receivingAccount.nameCn',
    },
    {
      title: '转出前余额',
      dataIndex: 'balanceBeforeTransOfReceivingAccount',
      render: val => `${formatMoney(val)} `,
    },
    {
      title: '转账金额',
      dataIndex: 'amount',
      align: 'right',
      // sorter: true,
      render: val => `${formatMoney(val)} `,
      // mark to display a total number
      sorter: (a, b) => a.cash - b.cash,
      needTotal: true,
    },
    {
      title: '转入方',
      dataIndex: 'debitAccount.accountType.nameCn',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '转入账户',
      dataIndex: 'debitAccount.nameCn',
    },
    {
      title: '转入前余额',
      dataIndex: 'balanceBeforeTransOfDebitAccount',
      render: val => `${formatMoney(val)} `,
    },   
    {
      title: '转账状态',
      dataIndex: 'status',
      filters: [
        {
          text: transStatus[0],
          value: 0,
        },
        {
          text: transStatus[1],
          value: 1,
        },
        {
          text: transStatus[2],
          value: 2,
        },
        {
          text: transStatus[2],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={transStatusMap[val]} text={transStatus[val]} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id, record) => (
        <Fragment>

          <Divider type="vertical" />
          <a onClick={() => this.executeTrans(record)}>执行转账</a>
          <Divider type="vertical" />
          <a onClick={() => this.closeTrans(record)}>完结转账</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleTransModalVisible(true, record)}>删除</a>
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
      type: 'investment/queryFundTrans',
      payload: {
        owner: currentUser.id,
        parent: '',
        type: '',
      },
    });
  }

  setProcessing = (dispatch, record) => {
    dispatch({
      type: 'investment/setProcessing',
      payload: {
        data: record,
      },
    });
  };

  logon = record => {
    const { dispatch } = this.props;
    this.setProcessing(dispatch, record);
    dispatch({
      type: 'investment/logon',
      payload: {
        id: record.id,
      },
    });
  };

  handleSelectRows = rows => {
    console.log(rows);
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
          this.logon(row);
        });
        break;
      case 'queryBalance':
        selectedRows.forEach(row => {
          this.queryBalance(row);
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
        type: 'investment/queryFundTrans',
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


  handleTransAdd = fields => {
    const { dispatch } = this.props;
    const { updateFormValues } = this.state;

    dispatch({
      type: 'investment/addTrans',
      payload: {
        ...fields,
        account: updateFormValues.id,
      },
    });
    message.success('提交成功');
    this.handleTransModalVisible();
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



  executeTrans = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/executeTrans',
      payload: {
        id:record.id,
      },
    });
  };

  closeTrans = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/closeTrans',
      payload: {
        id:record.id,
      },
    });
  };

  render() {
    const { mainAccount, fundTrans, accountTypes } = this.props;

    const data = {
      list: fundTrans,
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
      handleTransModalVisible: this.handleTransModalVisible,
      handleTransAdd: this.handleTransAdd,
    };
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      updateFormValues,
      transModalVisible,
    } = this.state;

    if (!mainAccount || !accountTypes) return null;

    return (
      <PageHeaderWrapper title="转账管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm(accountTypes, mainAccount)}
            </div>
            <div className={styles.tableListOperator}>
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
              // dataSource={subAccount}
              selectedRows={selectedRows}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              pagination={{ pageSize: 300, hideOnSinglePage: true }}
              bordered
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AccountList;
