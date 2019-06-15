import React from 'react';
import { Comment, Avatar, Form, Button, Input, message } from 'antd';
import { connect } from 'dva';
import CommentList from './components/CommentList';

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

@connect(({ article, user }) => ({
  article,
  user,
}))
class ArticleComment extends React.Component {
  state = {
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
      content: '',
    });
  };

  handleChange = e => {
    this.setState({
      content: e.target.value,
    });
  };

  render() {
    const { submitting, content } = this.state;
    const {
      comments,
      user: {
        currentUser: { avatar },
      },
    } = this.props;

    if (!comments) return null;

    return (
      <div>
        <Comment
          avatar={<Avatar src={avatar} size={32} icon="user" />}
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={content}
            />
          }
        />

        {comments.length > 0 && <CommentList comments={comments} loadMore="" hasMore={false} />}
      </div>
    );
  }
}

export default ArticleComment;
