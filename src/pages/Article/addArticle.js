import React, { PureComponent } from 'react';
import Editor from '@/pages/Article/components/Editor';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import { Card, Button, Form, Row, Col, Input, message } from 'antd';

import styles from './addArticle.less';

@connect(({ article }) => ({
  article,
}))
class AddArticle extends PureComponent {
  state = {
    content: '',
    contentHtml: '',
  };

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
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        //  const {user} = this.props;
        const payload = { ...values, ...this.state, owner: '4028839b6b015d9c016b015ef4430000' };
        const { dispatch } = this.props;

        dispatch({
          type: 'article/add',
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
