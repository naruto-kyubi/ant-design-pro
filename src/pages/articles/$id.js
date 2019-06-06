import React, { PureComponent } from 'react';
import { Row, Col, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import ArticleContent from './components/ArticleContent';

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

  render() {
    const { article } = this.props;
    const { content } = article;
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
            <HostArticleList />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Article;
