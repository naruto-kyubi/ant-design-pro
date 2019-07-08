import React, { PureComponent } from 'react';
import { List, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';
import Comment from './Comment';

@connect(({ user }) => ({
  user,
}))
class CommentList extends PureComponent {
  handleComment = (replyto, parent, content, contentHtml) => {
    if (!content) {
      return;
    }

    const { user, dispatch } = this.props;
    if (!user.currentUser.id) {
      message.warning('请登录后发表');
      return;
    }

    const payload = {
      replyId: replyto,
      userId: user.currentUser.id,
      //   articleId: parent.articleId,
      parent: parent.id,
      content,
      contentHtml,
    };

    dispatch({
      type: 'article/addComment',
      payload,
    });
  };

  rendCommentItem = item => {
    const { avatar } = this.props;
    return (
      <Comment comment={item} parent={item} avatar={avatar} handleComment={this.handleComment}>
        {item.children.map(child => (
          <Comment
            comment={child}
            parent={item}
            avatar={avatar}
            handleComment={this.handleComment}
          />
        ))}
      </Comment>
    );
  };

  render() {
    const { comments, hasMore, loadMore, commentCount } = this.props;

    return (
      <InfiniteScroll
        pageStart={1}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        <List
          dataSource={comments}
          header={`${commentCount} ${commentCount > 1 ? 'replies' : 'reply'}`}
          itemLayout="horizontal"
          renderItem={this.rendCommentItem}
        />
      </InfiniteScroll>
    );
  }
}

export default CommentList;
