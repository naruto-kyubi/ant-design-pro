import React, { PureComponent } from 'react';
import { List, Avatar, Skeleton } from 'antd';
import FollowButton from '@/pages/articles/components/FollowButton';
import InfiniteScroll from 'react-infinite-scroller';

export default class UserList extends PureComponent {
  render() {
    const { loadMore, hasMore, data, onFollowClick } = this.props;

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
        <div>
          <List
            // className="demo-loadmore-list"
            style={{ 'min-height': '350px' }}
            // loading={loading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={data}
            renderItem={item => (
              <List.Item
                actions={[
                  <FollowButton data={item} follow={item.mutual} onFollowClick={onFollowClick} />,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href="https://ant.design">{item.nickname}</a>}
                    description={item.profile}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>
      </InfiniteScroll>
    );
  }
}
