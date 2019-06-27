import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import CommentList from './components/CommentList';
import Reply from './components/Reply';

@connect(({ article, user }) => ({
  article,
  user,
}))
class ArticleComment extends React.Component {
  state = {
    submitting: false,
    content: '',
  };

  componentDidMount() {
    this.queryComments(true);
  }

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

  handleChange = content => {
    this.setState({
      content,
    });
  };

  queryComments = resetPool => {
    const {
      dispatch,
      article: {
        commentList: { meta },
      },
      articleId,
    } = this.props;
    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;
    const payload = { sorter: 'updatedAt_desc', currentPage, articleId };
    dispatch({
      type: 'article/fetchCommentList',
      payload,
    });
  };

  hasMore = () => {
    const {
      article: {
        commentList: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  loadMore = () => {
    this.queryComments(false);
  };

  getCommentCount = () => {
    const {
      article: {
        commentList: { meta },
      },
    } = this.props;
    return meta ? meta.pagination.total : 0;
  };

  render() {
    const { submitting, content } = this.state;
    const {
      article: { commentPool },
      user: {
        currentUser: { avatar },
      },
    } = this.props;

    const hasMore = this.hasMore();
    const commentCount = this.getCommentCount();
    return (
      <div>
        <Reply
          avatar={avatar}
          submitting={submitting}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          value={content}
        />

        {commentPool.length > 0 && (
          <CommentList
            comments={commentPool}
            loadMore={this.loadMore}
            hasMore={hasMore}
            commentCount={commentCount}
            avatar={avatar}
          />
        )}
      </div>
    );
  }
}

export default ArticleComment;
