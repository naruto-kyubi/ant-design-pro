import React from 'react';
import { Comment, Avatar, Form, Button, List, Input, message } from 'antd';
import { connect } from 'dva';
import { formatDate } from '@/utils/utils';

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

@connect(({ article, user }) => ({
  article,
  user,
}))
class ArticleComment extends React.Component {
  state = {
    // comments: [],
    submitting: false,
    content: '',
  };

  handleSubmit = () => {
    const { content } = this.state;
    if (!content) {
      return;
    }

    this.setState({
      submitting: true,
    });

    const {
      user,
      article: {
        articleDetail: {
          data: { id },
        },
      },
    } = this.props;
    if (!user.currentUser.id) {
      message.warning('请登录后发表');
      return;
    }

    const payload = { ...this.state, userId: user.currentUser.id, articleId: id };
    const { dispatch } = this.props;

    dispatch({
      type: 'article/addComment',
      payload,
    });

    this.setState({
      submitting: false,
    });
  };

  handleChange = e => {
    this.setState({
      content: e.target.value,
    });
  };

  getContent = comment => {
    const { content, userId, updatedAt } = comment;
    const { nickname, avatar } = userId;
    return {
      content,
      datetime: formatDate(updatedAt),
      author: nickname,
      avatar,
    };
  };

  render() {
    const { submitting, content } = this.state;
    const { comments } = this.props;

    if (!comments) return null;

    return (
      <div>
        <Comment
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
              size={32}
              style={{ backgroundColor: '#87d068' }}
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={content}
            />
          }
        />

        {comments.length > 0 && (
          <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="horizontal"
            renderItem={item => <Comment {...this.getContent(item)} />}
          />
        )}
      </div>
    );
  }
}

export default ArticleComment;
