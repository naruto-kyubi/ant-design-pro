import React, { PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import { Card, Button, Form, Input, message, TreeSelect, Upload, Icon } from 'antd';
import BraftEditor from 'braft-editor';

import { ContentUtils } from 'braft-utils';
import { context } from '@/defaultSettings';

import 'braft-editor/dist/index.css';

@connect(({ article, user }) => ({
  article,
  user,
}))
class AddArticle extends PureComponent {
  state = {
    editorState: BraftEditor.createEditorState(null),
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

  handleSubmit = e => {
    e.preventDefault();
    const { editorState } = this.state;
    const { user, form } = this.props;
    if (!user.currentUser.id) {
      message.warning('请登录后发表');
      return;
    }

    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          catalogId: values.catalogId,
          title: values.title,
          content: editorState.toRAW(),
          contentHtml: editorState.toHTML(),
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

  handleChange = editorState => {
    this.setState({ editorState });
  };

  onFileChange = info => {
    const { editorState } = this.state;

    if (info.file.status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully`);
      const { status } = info.file.response;
      if (status && status === 'ok') {
        this.setState({
          editorState: ContentUtils.insertMedias(editorState, [
            {
              type: 'IMAGE',
              url: context ? context.concat(info.file.response.data) : info.file.response.data,
            },
          ]),
        });
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      article: {
        catalog: { data },
      },
    } = this.props;

    const { editorState } = this.state;
    const FormItem = Form.Item;

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
    ];

    const uploadProps = {
      name: 'file',
      accept: 'image/*',
      action: context ? context.concat('/v1/file/upload') : '/v1/file/upload',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
    };

    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload {...uploadProps} onChange={this.onFileChange}>
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <Icon type="upload" /> 插入图片
            </button>
          </Upload>
        ),
      },
    ];
    return (
      <GridContent>
        <Card title="发表新帖">
          <Form
            layout="horizontal"
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

            <BraftEditor
              contentStyle={{ height: 300 }}
              controls={controls}
              extendControls={extendControls}
              value={editorState}
              onChange={this.handleChange}
              placeholder="请输入正文内容"
            />

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
