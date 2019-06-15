import React, { PureComponent } from 'react';
import { Row, Col, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import ArticleContent from './components/ArticleContent';
import ArticleComment from './comment';

import HostArticleList from './hostList';

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
      type: 'article/fetchArticleById',
      payload: {
        id,
      },
    });

    dispatch({
      type: 'article/fetchCommentList',
      payload: {
        articleId: id,
        sorter: 'updatedAt_desc',
      },
    });
  }

  render() {
    const { article } = this.props;
    const {
      articleDetail: { data },
      commentPool,
    } = article;
    if (!data) {
      return null;
    }

    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <Card>
              <div>
                <ArticleContent article={data} />
                <ArticleComment comments={commentPool} />
              </div>
            </Card>
          </Col>
          <Col lg={7} md={24}>
            <HostArticleList />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Article;
