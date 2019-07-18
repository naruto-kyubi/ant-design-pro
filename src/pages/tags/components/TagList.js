import React, { PureComponent } from 'react';
import { List, Card } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import FollowButton from '@/pages/articles/components/FollowButton';
import stylesProjects from '../../List/Projects.less';

export default class TagList extends PureComponent {
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
        <List
          className={stylesProjects.coverCardList}
          rowKey="id"
          grid={{ gutter: 48, column: 5 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card
                style={{ width: 144, height: 240 }}
                className={stylesProjects.card}
                hoverable
                cover={
                  <img
                    alt={item.name}
                    src={item.avatar}
                    style={{ width: 144, height: 140, padding: 10 }}
                  />
                }
              >
                <Card.Meta title={<a>{item.name}</a>} style={{ textAlign: 'center' }} />
                {/* <div className={stylesProjects.cardItemContent}> */}
                <div style={{ textAlign: 'center' }}>
                  <FollowButton follow={item.follow} data={item} onFollowClick={onFollowClick} />
                  {/* <span>{moment(item.updatedAt).fromNow()}</span> */}
                  {/* <div className={stylesProjects.avatarList}> */}
                  {/* <AvatarList size="mini">
                        {item.members.map(member => (
                            <AvatarList.Item
                            key={`${item.id}-avatar-${member.id}`}
                            src={member.avatar}
                            tips={member.name}
                            />
                        ))}
                        </AvatarList> */}
                  {/* </div> */}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    );
  }
}
