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
  Steps,
  Radio,
  List,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
//const statusMap = ['default', 'processing', 'success', 'error'];
const statusMap = ['error', 'success'];
const status = ['失败','成功'];

@connect(({ investment, loading ,user}) => ({
  mainAccount:investment.mainAccounts,
  currentUser:user.currentUser,
  loading: loading.models.investment,
}))

class MainAccountList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
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
      type: 'investment/queryMainAccounts',
      payload: {
        owner: currentUser.id,
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

  render() {

    const {
      mainAccount,
    } = this.props;

    const data = {
      list:mainAccount,
    //  pagination:investment.meta.pagination,
    }

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    if (!mainAccount) return null;
  

    return (
      <PageHeaderWrapper title="子账户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              data={data}
              selectedRows={selectedRows}
              columns={this.columns}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }

}

export default MainAccountList;