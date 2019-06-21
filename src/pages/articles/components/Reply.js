import React, { PureComponent } from 'react';
import { Comment, Avatar, Form, Input, Button } from 'antd';

const { TextArea } = Input;
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        发表评论
      </Button>
    </Form.Item>
  </div>
);

class Replay extends PureComponent {
  onChange = e => {
    const { handleChange } = this.props;
    const content = e.target.value;
    handleChange(content);
  };

  render() {
    const { handleSubmit, avatar = null, value, submitting } = this.props;

    return (
      <Comment
        avatar={<Avatar src={avatar} size={32} icon="user" />}
        content={
          <Editor
            onChange={this.onChange}
            onSubmit={handleSubmit}
            value={value}
            submitting={submitting}
          />
        }
      />
    );
  }
}

export default Replay;
