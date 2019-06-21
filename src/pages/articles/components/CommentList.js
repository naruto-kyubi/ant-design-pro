import React, { PureComponent } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import Comment from './Comment';

class CommentList extends PureComponent {
  rendCommentItem = item => {
    return (
      <Comment comment={item}>
        {item.children.map(child => (
          <Comment comment={child} />
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
