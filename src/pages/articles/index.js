import React, { PureComponent } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Catalog from './catalog';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import HostArticleList from './hostList';
import ArticleList from './components/ArticleList';

@connect(({ article }) => ({
  article,
}))
class Articles extends PureComponent {
  state = {
    catalog: 'recommand',
  };

  componentDidMount() {
    this.queryArticles();
  }

  handleClick = e => {
    this.setState({ catalog: e.key }, () => {
      this.queryArticles(e.key);
    });
  };

  loadMore = () => {
    this.queryArticles();
  };

  queryArticles = catalogId => {
    const {
      dispatch,
      article: {
        list: { meta },
      },
    } = this.props;
    const { catalog } = this.state;
    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = catalogId ? 1 : currentPage;
    let payload = { sorter: 'updatedAt_desc', currentPage };
    if (catalog !== 'recommand') {
      payload = { ...payload, catalogId_equal: catalog };
    }
    dispatch({
      type: 'article/fetchList',
      payload,
    });
  };

  hasMore = () => {
    const {
      article: {
        list: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  addArticle = () => {
    router.push('/articles/add');
  };

  render() {
    const { article } = this.props;
    const { articleList } = article;
    const hasMore = this.hasMore();
    return (
      <GridContent>
        <Catalog onMenuClick={this.handleClick} />
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <ArticleList data={articleList} loadMore={this.loadMore} hasMore={hasMore} />
          </Col>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <Button type="primary" icon="edit" onClick={this.addArticle}>
                发表新帖
              </Button>
            </Card>
            <HostArticleList />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Articles;
