import React, { PureComponent } from 'react';
import { Card, List } from 'antd';
import { connect } from 'dva';
import ArticleListContent from '@/components/ArticleListContent';

import styles from './components/ArticleList.less';

@connect(({ article }) => ({
  article,
}))
class HostArticleList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchHotList',
    });
  }

  getTitle = item => {
    const { id, title, owner, updatedAt } = item;
    const { nickname, avatar } = owner;
    return {
      content: (
        <a
          className={styles.listItemMetaTitle}
          href={`/articles/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
      ),
      updatedAt,
      owner: nickname,
      avatar,
    };
  };

  render() {
    const { article } = this.props;
    const { hotList } = article;
    return (
      <Card bordered={false} style={{ marginBottom: 24 }} title="本周热议">
        <List
          size="large"
          className={styles.articleList}
          rowKey="id"
          itemLayout="vertical"
          dataSource={hotList}
          renderItem={item => (
            <List.Item key={item.id}>
              <ArticleListContent data={this.getTitle(item)} />
            </List.Item>
          )}
        />
      </Card>
    );
  }
}

export default HostArticleList;
