import React, { PureComponent } from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';

export default class UserList extends PureComponent {
  render() {
    const { loading, loadMore, data } = this.props;

    return (
      <div>
        <List
          // className="demo-loadmore-list"
          style={{ 'min-height': '350px' }}
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={data}
          renderItem={item => (
            <List.Item
              actions={[
                <Button>+关注</Button>,
                // ,
                // <Button>取消关注</Button>
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
    );
  }
}
