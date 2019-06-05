import React, { PureComponent } from 'react';
import { Row, Col, Card, List } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ArticleListContent from '@/components/ArticleListContent';
import { connect } from 'dva';
import ArticleContent from './components/ArticleContent';

@connect(({ article }) => ({
  article,
}))
class Article extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'article/fetchList',
      payload: {
        sorter: 'updatedAt_desc',
      },
    });
    dispatch({
      type: 'article/fetch',
      payload: {
        id,
      },
    });
  }

  getTitle = item => {
    const { title, owner, updatedAt } = item;
    const { nickname, avatar } = owner;
    return {
      content: title,
      updatedAt,
      owner: nickname,
      avatar,
    };
  };

  render() {
    const { article } = this.props;
    const { list, content } = article;
    if (!content) {
      return null;
    }
    const { data } = content;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <Card>
              <div>
                <ArticleContent article={data} />
              </div>
            </Card>
          </Col>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} title="本周热议">
              <List
                size="large"
                // className={styles.articleList}
                rowKey="id"
                itemLayout="vertical"
                dataSource={list.data}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <ArticleListContent data={this.getTitle(item)} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Article;
