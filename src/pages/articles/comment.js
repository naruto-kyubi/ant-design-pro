import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import CommentList from './components/CommentList';
import Reply from './components/Reply';

import 'braft-editor/dist/index.css';

@connect(({ article, user }) => ({
  article,
  user,
}))
class ArticleComment extends React.Component {
  state = {
    submitting: false,
    editorState: BraftEditor.createEditorState(null),
  };

  componentDidMount() {
    this.queryComments(true);
  }

  handleSubmit = () => {
    const { editorState } = this.state;
    if (!editorState) {
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

    const payload = {
      content: editorState.toRAW(),
      contentHtml: editorState.toHTML(),
      userId: user.currentUser.id,
      articleId: id,
    };
    const { dispatch } = this.props;

    dispatch({
      type: 'article/addComment',
      payload,
    });

    this.setState({
      submitting: false,
      editorState: BraftEditor.createEditorState(null),
    });
  };

  handleChange = editorState => {
    this.setState({
      editorState,
    });
  };

  queryComments = resetList => {
    const {
      dispatch,
      article: {
        commentList: { meta },
      },
      articleId,
    } = this.props;
    let current = meta ? meta.pagination.current + 1 : 1;
    current = resetList ? 1 : current;
    const payload = { sorter: 'updatedAt_desc', current, articleId };
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
      article: { commentList },
      user: {
        currentUser: { avatar },
      },
    } = this.props;

    const commentCount = this.getCommentCount();
    return (
      <div id="Reply">
        <Reply
          avatar={avatar}
          submitting={submitting}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          value={content}
        />

        {commentCount > 0 && (
          <CommentList
            comments={commentList.data}
            loadMore={this.loadMore}
            hasMore={this.hasMore()}
            commentCount={commentCount}
            avatar={avatar}
          />
        )}
      </div>
    );
  }
}

export default ArticleComment;
