/* eslint-disable react/no-string-refs */

import React, { PureComponent } from 'react';
import E from 'wangeditor';
import { Spin } from 'antd';

import styles from './Editor.less';

class Editor extends PureComponent {
  state = {
    isUpload: false,
  };

  componentDidMount() {
    const self = this;
    const editor = new E(this.editorElem);
    this.editor = editor;

    const { onChange } = this.props;
    editor.customConfig.zIndex = 0;

    // elem.attr('contenteditable', false);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      const txt = editor.txt.text();
      onChange(html, txt);
    };

    // 自定义菜单配置
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];

    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgServer = '/naruto/uploadEditorFile'; // 上传图片到服务器
    // 限制一次最多上传 5 张图片
    editor.customConfig.uploadImgMaxLength = 5;
    editor.customConfig.uploadImgHooks = {
      before() {
        // 加载中
        self.setState({ isUpload: true });
      },

      customInsert(insertImg, result) {
        const url = result.data;
        url.forEach(element => {
          insertImg(`/naruto${element}`);
        });
        // 关闭加载
        self.setState({ isUpload: false });
      },
    };
    editor.create();

    // editor.txt.html('')
  }

  componentDidUpdate() {
    const { isCommited } = this.props;
    if (isCommited) {
      this.editor.txt.html('');
    }
  }

  render() {
    const { isUpload } = this.state;
    return (
      <div className={styles.editor}>
        <Spin className={styles.spin} spinning={isUpload} />
        <div
          ref={input => {
            this.editorElem = input;
          }}
        />
      </div>
    );
  }
}

export default Editor;
