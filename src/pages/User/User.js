import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './User.less';
import ComponentAuthorization from '@/pages/Authorization/ComponentAuthorization';
import AuthorizationUtils from '@/pages/Authorization/AuthorizationUtils';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

let queryParams = {};
const callback = (dispatch, _queryParams) => {
  return () =>
    dispatch({
      type: 'user/query',
      payload: _queryParams,
    });
};
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // @liuhaoyi
      // form.resetFields();
      handleAdd(form, fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="nickname">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: true, message: '请输入昵称！', min: 1 }],
        })(<Input placeholder="please input nickname" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="mobile">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '请输入手机！', min: 10 }],
        })(<Input placeholder="please input mobile" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        id: props.values.id,
        nickname: props.values.nickname,
        mobile: props.values.mobile,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleUpdate = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        }
      );
    });
  };

  renderContent = formVals => {
    const { form } = this.props;

    return [
      <FormItem key="nickname" {...this.formLayout} label="nickname">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: true, message: '请输入昵称！' }],
          initialValue: formVals.nickname,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="mobile" {...this.formLayout} label="mobile">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '请输入手机！', min: 5 }],
          initialValue: formVals.mobile,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;

    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleUpdate()}>
        Save
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="user edit"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class User extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    rowFormValues: {},
  };

  columns = [
    {
      title: 'nickname',
      dataIndex: 'nickname',
    },
    {
      title: 'mobile',
      dataIndex: 'mobile',
    },

    {
      title: 'operator',
      code: 'console.user.update',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>edit</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/query',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    // @liuhaoyi new add
    queryParams = params;

    dispatch({
      type: 'user/query',
      payload: params,
    });

    // clear selected state;
    this.setState({
      selectedRows: [],
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    // @liuhaoyi new add
    queryParams = {};
    dispatch({
      type: 'user/query',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'user/remove',
          payload: {
            key: selectedRows.map(row => row.id),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            callback(dispatch, queryParams)();
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      // @liuhaoyi new add;
      queryParams = values;

      dispatch({
        type: 'user/query',
        payload: values,
      });
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
      rowFormValues: record || {},
    });
  };

  handleAdd = (form, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/create',
      payload: {
        // desc: fields.desc,
        ...fields,
      },
      // @liuhaoyi new add,重新加载列表；
      // callback: callback(dispatch, queryParams),
      callback: ({ status = 'ok', data = '' }) => {
        return () => {
          if (status === 'ok') {
            dispatch({
              type: 'user/query',
              payload: queryParams,
            });
            message.success('添加成功');
            form.resetFields();
            this.handleModalVisible();
          } else {
            message.error(`error=${data}`);
          }
        };
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'user/update',
      payload: {
        query: formValues,
        body: {
          ...fields,
        },
      },
      callback: callback(dispatch, queryParams),
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickname_like')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机">
              {getFieldDecorator('mobile_like')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      user: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, rowFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    this.columns = AuthorizationUtils.getAuthorizedColums(this.columns);
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <ComponentAuthorization code="console.user.add">
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              </ComponentAuthorization>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>

            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {rowFormValues && Object.keys(rowFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={rowFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default User;
