import React, { PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import { Card, Button, Form, Input, message, TreeSelect, Upload, Icon, Select } from 'antd';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import Markdown from 'braft-extensions/dist/markdown';
import { ContentUtils } from 'braft-utils';
import DraftBox from './components/DraftBox';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';

import styles from './edit.less';

const tableOptions = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: false, // 插入表格前是否弹出下拉菜单
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
  includeEditors: ['articleEditor'],
};

const markdownOptions = {
  includeEditors: ['articleEditor'],
};

BraftEditor.use(Table(tableOptions));
BraftEditor.use(Markdown(markdownOptions));

@connect(({ article, user, loading, drafList }) => ({
  article,
  user,
  saving: loading.effects['article/addArticle'],
  drafList,
}))
class EditArticle extends PureComponent {
  state = {
    editorState: BraftEditor.createEditorState(null),
    status: 'unsaved', // unsaved, waitingForSave, saved
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

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

    if (id) {
      dispatch({
        type: 'article/editArticle',
        payload: { id },
      });
    }

    this.getDraftList();

    this.saveJob = window.setInterval(() => this.saveArticle('draft'), 10000);
  }

  componentWillReceiveProps(nextProps) {
    const { form } = this.props;
    const id = form.getFieldValue('id');
    const {
      article: {
        articleDetail: { data },
      },
    } = nextProps;
    if (data && id !== data.id) {
      // change draft article
      if (data.createdAt !== data.updatedAt) {
        this.setState({
          editorState: BraftEditor.createEditorState(data.content),
        });
      } else {
        //  draft save success for the first time
        this.getDraftList();
      }
    }
    if (!data) {
      // new article
      this.setState({
        editorState: BraftEditor.createEditorState(null),
      });
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.saveJob);
  }

  getDraftList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchDraftList',
      payload: {
        status_equal: 'draft',
        sorter: 'updatedAt_desc',
      },
    });
  };

  handleSubmit = e => {
    if (e) e.preventDefault();
    const { form } = this.props;
    // eslint-disable-next-line no-unused-vars
    form.validateFields((err, values) => {
      if (!err) {
        this.saveArticle('publish');
      }
    });
  };

  saveArticle = state => {
    const { editorState, status } = this.state;
    const { user, form } = this.props;

    if (!user.currentUser.id) {
      message.warning('请登录后发表');
      return;
    }
    if (status !== 'waitingForSave' && state === 'draft') return;
    const values = form.getFieldsValue();
    const payload = {
      id: values.id,
      catalogId: values.catalogId,
      title: values.title,
      tags: values.tags,
      publishedVersion: values.publishedVersion,
      content: editorState.toRAW(),
      contentHtml: editorState.toHTML(),
      owner: user.currentUser.id,
      status: state,
    };
    const { dispatch } = this.props;

    dispatch({
      type: 'article/saveArticle',
      payload,
      callback: (_status, error) => {
        if (_status === 'ok') {
          this.setState({ status: 'saved' });
        } else {
          message(error.errMsg);
        }
      },
    });
  };

  handleChange = editorState => {
    this.setState({ editorState });
    if (editorState.toHTML().length < 10) return;
    this.setState({ status: 'waitingForSave' });
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
              url: info.file.response.data,
            },
          ]),
        });
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  getSaveTips = () => {
    const { status } = this.state;
    const { saving } = this.props;
    if (status === 'unsaved') {
      return '文章将会自动保存至';
    }
    return saving ? '正在保存文章至' : '文章已于 刚刚 保存到';
  };

  getDraft = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchArticleById',
      payload: {
        id,
      },
    });
  };

  deleteDraft = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/deleteArticle',
      payload: {
        targetId: id,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      article: {
        catalog: { data: catalog },
        tag: { data: tags },
        articleDetail: { data },
        draftList,
      },
    } = this.props;

    if (!catalog || !tags || (data && data.status === 'publish')) return null;

    const currentAticle = data
      ? { ...data, tags: data.tags ? data.tags.map(item => item.id) : [] }
      : {
          content: null,
          catalogId: null,
          title: '',
          id: null,
          tags: [],
          publishedVersion: null,
        };

    const { Option } = Select;
    const children = tags.map(item => <Option key={item.id}>{item.name}</Option>);

    const { editorState } = this.state;
    const FormItem = Form.Item;

    const treedata = catalog.map(item => ({
      title: item.name,
      value: item.id,
      key: item.id,
      disabled: false,
    }));

    const excludeControls = [
      'strike-through',
      'superscript',
      'subscript',
      // 'text-color',
      'remove-styles',
      'media',
      'separator',
      'clear',
      'separator',
      'underline',
      'letter-spacing',
      'emoji',
      'hr',
      'list-ul',
      'undo',
      'redo',
    ];

    const uploadProps = {
      name: 'file',
      accept: 'image,mp4/*',
      action: '/server/api/v1/file/upload',
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
      <div>
        <span className={styles.saveTips}>{this.getSaveTips()} </span>
        <DraftBox
          draftList={draftList}
          getDraftArticle={this.getDraft}
          getDraftList={this.getDraftList}
          deleteDraft={this.deleteDraft}
        />
        <Button type="primary" onClick={this.handleSubmit}>
          立即发布
        </Button>
      </div>
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
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('id', {
                initialValue: currentAticle.id,
              })(<Input placeholder="id" value={currentAticle.id} />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('publishedVersion', {
                initialValue: currentAticle.publishedVersion,
              })(<Input placeholder="publishedVersion" value={currentAticle.publishedVersion} />)}
            </FormItem>
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
              id="articleEditor"
              contentStyle={{ height: 700 }}
              style={{ border: '1px solid #D9D9D9' }}
              // controls={controls}
              excludeControls={excludeControls}
              extendControls={extendControls}
              value={editorState}
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
