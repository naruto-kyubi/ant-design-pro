import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import CommentList from './components/CommentList';
import Reply from './components/Reply';
import { hasMorePage, getPaginationPayload } from '@/utils/pageUtils';

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

  queryComments = isFirstPage => {
    const {
      dispatch,
      article: { commentList },
      articleId,
    } = this.props;

    const payload = getPaginationPayload(commentList, isFirstPage, null, 'updatedAt_desc', {
      articleId,
    });

    dispatch({
      type: 'article/fetchCommentList',
      payload,
    });
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
            hasMore={hasMorePage(commentList)}
            commentCount={commentCount}
            avatar={avatar}
          />
        )}
      </div>
    );
  }
}

export default ArticleComment;
