import React, { PureComponent } from 'react';
import { Comment, Avatar, Form, Button } from 'antd';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const Editor = ({ onChange, onSubmit, submitting, value, controls }) => (
  <div>
    <Form.Item>
      <BraftEditor
        contentStyle={{ height: 100 }}
        style={{ border: '1px solid #D9D9D9' }}
        value={value}
        onChange={onChange}
        controls={controls}
      />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        发表评论
      </Button>
    </Form.Item>
  </div>
);

class Replay extends PureComponent {
  onChange = editorState => {
    const { handleChange } = this.props;
    handleChange(editorState);
  };

  render() {
    const { handleSubmit, avatar = null, submitting, value } = this.props;

    return (
      <Comment
        avatar={<Avatar src={avatar} size={32} icon="user" />}
        content={
          <Editor
            onChange={this.onChange}
            onSubmit={handleSubmit}
            controls={['font-size', 'text-color']}
            value={value}
            submitting={submitting}
          />
        }
      />
    );
  }
}

export default Replay;
