import React, { PureComponent } from 'react';
import { Card, List } from 'antd';
import { connect } from 'dva';
import ArticleListContent from '@/components/ArticleListContent';

import styles from './components/ArticleList.less';

@connect(({ article }) => ({
  article,
}))
class User2ArticleList extends PureComponent {
  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'article/fetchUser2ArticleList',
      payload: {
        userId,
        currentPage: 1,
        sorter: 'updatedAt_desc',
      },
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
    const { user2ArticleList } = article;
    if (!user2ArticleList || user2ArticleList.length === 0) return null;
    const { data } = user2ArticleList;
    return (
      <Card bordered={false} style={{ marginBottom: 24 }} title="作者文章">
        <List
          size="large"
          className={styles.articleList}
          rowKey="id"
          itemLayout="vertical"
          dataSource={data}
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

export default User2ArticleList;
