import React, { PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import { Card, Button, Form, Input, message, TreeSelect, Upload, Icon, Select } from 'antd';
import BraftEditor from 'braft-editor';

import { ContentUtils } from 'braft-utils';
import { context } from '@/defaultSettings';

import 'braft-editor/dist/index.css';

@connect(({ article, user }) => ({
  article,
  user,
}))
class EditArticle extends PureComponent {
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
    dispatch({
      type: 'article/fetchTag',
      payload: {
        sorter: 'name_desc',
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { editorState } = this.state;
    const {
      user,
      form,
      location: {
        query: { isEdit },
      },
    } = this.props;

    // eslint-disable-next-line react/destructuring-assignment
    const id = isEdit ? this.props.article.articleDetail.data.id : null;

    if (!user.currentUser.id) {
      message.warning('请登录后发表');
      return;
    }

    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          id,
          catalogId: values.catalogId,
          title: values.title,
          tags: values.tags,
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
              type: info.file.name.endsWith('mp4') ? 'VIDEO' : 'IMAGE',
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
        tag: { data: tags },
      },
      location: {
        query: { isEdit },
      },
    } = this.props;

    if (!data || !tags) return null;

    const { Option } = Select;
    const children = tags.map(item => <Option key={item.id}>{item.name}</Option>);

    let currentAticle = {
      content: null,
      catalogId: null,
      title: '',
      id: '',
      tags: [],
    };

    if (isEdit) {
      const {
        article: {
          articleDetail: { data: d },
        },
      } = this.props;
      currentAticle = { ...d, tags: d.tags.map(item => item.id) };
      this.setState({ editorState: BraftEditor.createEditorState(currentAticle.content) });
    }

    const { editorState } = this.state;
    const FormItem = Form.Item;

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
      accept: 'image,mp4/*',
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
              data-title="插入图片/视频"
            >
              <Icon type="upload" /> 插入图片/视频
            </button>
          </Upload>
        ),
      },
    ];

    const extra = (
      <Button type="primary" onClick={this.handleSubmit}>
        立即发布
      </Button>
    );

    return (
      <GridContent>
        <Card title="发表新帖" extra={extra}>
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
                initialValue: currentAticle.catalogId,
              })(
                <TreeSelect
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 800, overflow: 'auto' }}
                  treeData={treedata}
                  placeholder="板块"
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  style={{ width: '100%' }}
                  onChange={this.onChange}
                />
              )}
            </FormItem>

            <FormItem label="标签">
              {getFieldDecorator('tags', {
                rules: [
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ],
                initialValue: currentAticle.tags,
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="至少选择一个标签">
                  {children}
                </Select>
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
                initialValue: currentAticle.title,
              })(<Input placeholder="标题，一句话说明您要发表的内容" />)}
            </FormItem>

            <BraftEditor
              contentStyle={{ height: 700 }}
              controls={controls}
              extendControls={extendControls}
              value={editorState}
              defaultValue={BraftEditor.createEditorState(currentAticle.content)}
              onChange={this.handleChange}
              placeholder="请输入正文内容"
            />
          </Form>
        </Card>
      </GridContent>
    );
  }
}

export default Form.create()(EditArticle);
