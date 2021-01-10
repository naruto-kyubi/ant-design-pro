import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const statusMap = ['error', 'success'];
const status = ['失败','成功'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible,mainAccount,accountTypes } = props;
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
              <Select placeholder="请选择" allowClear='true' style={{ width: '100%' }}>
                {mainAccount.map(element =>( <Option key={element.id}>{element.nameCn}</Option>))}
              </Select>
                  )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="账户类型">
            {form.getFieldDecorator('type')(
              <Select placeholder="请选择" allowClear='true' style={{ width: '100%' }}>
                {accountTypes.map(element =>(<Option key={element.id}>{element.nameCn}</Option>))}
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

@connect(({ investment, loading ,user}) => ({
  mainAccount:investment.mainAccounts,
  subAccount:investment.subAccounts,
  accountTypes:investment.accountTypes,
  currentUser:user.currentUser,
  loading: loading.models.investment,
}))

@Form.create()
class MainAccountList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
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
      sorter: true,
     // render: val => `${val} 万`,
      // mark to display a total number
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
      render: (id) => (
        <Fragment>
          <a onClick={() => this.logon(id)}>登录</a>
          <Divider type="vertical" />
          <a onClick={() => this.queryBalance(id)}>查询余额</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch,currentUser } = this.props;
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
        parent:'',
        type:'',
      },
    });
  }

  logon = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'investment/logon',
      payload: {
        id,
      },
    });
  };

  queryBalance = (id) => {
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
        selectedRows.forEach((row)=>{
          this.logon(row.id);
        });  
        break;
      case 'queryBalance':
        selectedRows.forEach((row)=>{
          this.queryBalance(row.id);
        });  
        break;
      default:
        break;
    }
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form,currentUser} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'investment/querySubAccounts',
        payload: {
          owner: currentUser.id,
          parent:fieldsValue.parent||'',
          type:fieldsValue.type||'',
        },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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

  renderSimpleForm = (accountTypes,mainAccount) => {
    const {
      form: { getFieldDecorator },
    } = this.props;
   // console.log(accountTypes);
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="主账户">
              {getFieldDecorator('parent')(
                <Select placeholder="请选择" allowClear='true' style={{ width: '100%' }}>
                  {mainAccount.map(element =>(<Option key={element.id}>{element.nameCn}</Option>))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="账户类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" allowClear='true' style={{ width: '100%' }}>
                  {accountTypes.map(element =>(<Option key={element.id}>{element.nameCn}</Option>))}
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
  }

  render() {

    const {
      mainAccount,
      subAccount,
      accountTypes,
    } = this.props;

    const data = {
      list:subAccount,
    //  pagination:investment.meta.pagination,
    }

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="logon">登录</Menu.Item>
        <Menu.Item key="queryBalance">查询余额</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { selectedRows, modalVisible, updateModalVisible } = this.state;

    if (!mainAccount||!accountTypes) return null; 
  

    return (
      <PageHeaderWrapper title="子账户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm(accountTypes,mainAccount)}</div>
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
              pagination={{ pageSize: 300,hideOnSinglePage:true }}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} mainAccount={mainAccount} accountTypes={accountTypes} />
      </PageHeaderWrapper>
    );
  }

}

export default MainAccountList;