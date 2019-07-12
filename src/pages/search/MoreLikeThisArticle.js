import React, { PureComponent } from 'react';
import { Card, List } from 'antd';
import { connect } from 'dva';
import ArticleListContent from '@/components/ArticleListContent';

import styles from './MoreLikeThisArticle.less';

@connect(({ search }) => ({
  search,
}))
class MoreLikeThisArticle extends PureComponent {
  componentDidMount() {
    const { id, dispatch } = this.props;

    dispatch({
      type: 'search/searchlike',
      payload: {
        id,
      },
    });
  }

  getTitle = item => {
    const { id, title, owner, updatedAt } = item;
    const { nickname, avatar } = owner;
    return {
      content: (
        <a href={`/articles/${id}`} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      ),
      updatedAt,
      owner: nickname,
      avatar,
    };
  };

  render() {
    const {
      search: { searchlikes },
    } = this.props;
    return (
      <Card bordered={false} style={{ marginBottom: 24 }} title="相关推荐">
        <List
          size="large"
          className={styles.articleList}
          rowKey="id"
          itemLayout="vertical"
          dataSource={searchlikes}
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

export default MoreLikeThisArticle;
