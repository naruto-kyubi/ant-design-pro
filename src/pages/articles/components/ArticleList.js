import React, { PureComponent } from 'react';
import { List, Icon, Tag, Card } from 'antd';
import ArticleListContent from '@/components/ArticleListContent';
import InfiniteScroll from 'react-infinite-scroller';

import styles from './ArticleList.less';

class ArticleList extends PureComponent {
  getContent = article => {
    const { contentHtml, owner, updatedAt } = article;
    const { nickname, avatar } = owner;

    return {
      // content: `${JSON.parse(JSON.stringify(contentHtml).replace(/<\/?.+?\/?>/g, '')).substring(
      //   0,
      //   200
      // )}...`,
      content: <div dangerouslySetInnerHTML={{ __html: contentHtml }} />,
      updatedAt,
      owner: nickname,
      avatar,
    };
  };

  render() {
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const { data, loadMore, hasMore } = this.props;

    return (
      <Card className={styles.tabsCard} bordered={false}>
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
            size="large"
            className={styles.articleList}
            rowKey="id"
            itemLayout="vertical"
            dataSource={data}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
                  <IconText type="star-o" text={item.starCount} />,
                  <IconText type="like-o" text={item.likeCount} />,
                  <IconText type="message" text={item.commentCount} />,
                  <IconText type="read" text={item.viewCount} />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <a
                      className={styles.listItemMetaTitle}
                      href={`/articles/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  }
                  description={
                    <span>
                      {item.tags && item.tags.map(tag => <Tag color={tag.color}>{tag.name}</Tag>)}
                    </span>
                  }
                />
                <ArticleListContent data={this.getContent(item)} />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </Card>
    );
  }
}

export default ArticleList;
