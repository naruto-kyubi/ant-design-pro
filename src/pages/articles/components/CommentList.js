import React, { PureComponent } from 'react';
import { Comment, List } from 'antd';
import { formatDate } from '@/utils/utils';
import InfiniteScroll from 'react-infinite-scroller';

class CommentList extends PureComponent {
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
    const { comments, hasMore, loadMore } = this.props;

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
          header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
          itemLayout="horizontal"
          renderItem={item => <Comment {...this.getContent(item)} />}
        />
      </InfiniteScroll>
    );
  }
}

export default CommentList;
