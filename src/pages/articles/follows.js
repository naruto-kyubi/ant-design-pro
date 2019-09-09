import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import HotArticleList from './hotList';
import ArticleList from './components/ArticleList';

@connect(({ article }) => ({
  article,
}))
class FollowArticles extends PureComponent {
  componentDidMount() {
    this.queryArticles(true);
  }

  // handleClick = e => {
  //   this.setState({ catalog: e.key }, () => {
  //     this.queryArticles(true);
  //   });
  // };

  loadMore = () => {
    this.queryArticles();
  };

  queryArticles = resetPool => {
    const {
      dispatch,
      article: {
        followArticleList: { meta },
      },
    } = this.props;
    let current = meta ? meta.pagination.current + 1 : 1;
    current = resetPool ? 1 : current;
    // let payload = { sorter: 'updatedAt_desc', current };
    dispatch({
      type: 'article/fetchFollowArticleList',
      payload: {
        sorter: 'updatedAt_desc',
        current,
      },
    });
  };

  hasMore = () => {
    const {
      article: {
        followArticleList: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  addArticle = () => {
    router.push('/articles/edit');
  };

  render() {
    const {
      article: { followArticleList },
    } = this.props;
    if (!followArticleList) return null;
    const { data } = followArticleList;
    const hasMore = this.hasMore();
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <ArticleList data={data} loadMore={this.loadMore} hasMore={hasMore} />
          </Col>
          <Col lg={7} md={24}>
            <HotArticleList />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default FollowArticles;
