import React, { PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import { Card, Button, Form, Row, Col, Input, message, TreeSelect } from 'antd';
import Editor from './components/Editor';

import styles from './add.less';

@connect(({ article, user }) => ({
  article,
  user,
}))
class AddArticle extends PureComponent {
  state = {
    content: '',
    contentHtml: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchCatalog',
      payload: {
        sorter: 'sort_desc',
      },
    });
  }

  onChange = (html, txt) => {
    this.setState({ contentHtml: html, content: txt });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { content, contentHtml } = this.state;
    if (content === '' || contentHtml === null) {
      message.warning('请输入发表内容');
      return;
    }

    const { user } = this.props;
    if (!user.currentUser.id) {
      message.warning('请登录后发表');
      return;
    }
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const payload = { ...values, ...this.state, owner: user.currentUser.id };
        const { dispatch } = this.props;

        dispatch({
          type: 'article/addArticle',
          payload,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const FormItem = Form.Item;
    const {
      article: { catalog },
    } = this.props;
    if (!catalog) return null;
    const { data } = catalog;
    const treedata = data.map(item => ({
      title: item.name,
      value: item.id,
      key: item.id,
      disabled: false,
    }));
    return (
      <GridContent>
        <Card title="发表新帖">
          <div className={styles.addArticle}>
            <Form
              layout="horizontal"
              onSubmit={this.handleSubmit}
              hideRequiredMark
              style={{ marginTop: 8, marginBottom: 8 }}
            >
              <Row gutter={12}>
                <Col span={8}>
                  <FormItem label="板块">
                    {getFieldDecorator('catalogId', {
                      rules: [
                        {
                          required: true,
                          message: '请输入板块',
                        },
                      ],
                    })(
                      <TreeSelect
                        style={{ width: 300 }}
                        dropdownStyle={{ maxHeight: 800, overflow: 'auto' }}
                        treeData={treedata}
                        placeholder="板块"
                        onChange={this.onChange}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <FormItem label="标题">
                    {getFieldDecorator('title', {
                      rules: [
                        {
                          required: true,
                          message: '请输入标题',
                        },
                      ],
                    })(<Input placeholder="标题，一句话说明您要发表的内容" />)}
                  </FormItem>
                </Col>
              </Row>

              <Editor onChange={this.onChange} />
              <Button type="primary" htmlType="submit">
                {' '}
                立即发布
              </Button>
            </Form>
          </div>
        </Card>
      </GridContent>
    );
  }
}

export default Form.create()(AddArticle);
