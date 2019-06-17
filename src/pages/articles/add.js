import React, { PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import { Card, Button, Form, Input, message, TreeSelect } from 'antd';
import BraftEditor from 'braft-editor';

import 'braft-editor/dist/index.css';

@connect(({ article, user }) => ({
  article,
  user,
}))
class AddArticle extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchCatalog',
      payload: {
        sorter: 'sort_desc',
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { user } = this.props;
    if (!user.currentUser.id) {
      message.warning('请登录后发表');
      return;
    }
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          catalogId: values.catalogId,
          title: values.title,
          content: values.content.toRAW(),
          contentHtml: values.content.toHTML(),
          owner: user.currentUser.id,
        };
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
      article: {
        catalog: { data },
      },
    } = this.props;
    if (!data) return null;
    const treedata = data.map(item => ({
      title: item.name,
      value: item.id,
      key: item.id,
      disabled: false,
    }));

    const controls = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator',
      'media',
    ];
    return (
      <GridContent>
        <Card title="发表新帖">
          <Form
            layout="horizontal"
            // {...formItemLayout}
            onSubmit={this.handleSubmit}
            // hideRequiredMark
            style={{ marginTop: 8, marginBottom: 8 }}
          >
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

            <FormItem label="文章正文">
              {getFieldDecorator('content', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入正文内容');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <BraftEditor
                  contentStyle={{ height: 300 }}
                  controls={controls}
                  placeholder="请输入正文内容"
                />
              )}
            </FormItem>

            {/* <Editor onChange={this.onChange} /> */}
            <Button type="primary" htmlType="submit">
              {' '}
              立即发布
            </Button>
          </Form>
        </Card>
      </GridContent>
    );
  }
}

export default Form.create()(AddArticle);
