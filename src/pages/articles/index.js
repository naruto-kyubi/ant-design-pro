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
  componentDidMount() {
    this.queryArticlesByCatalog();
  }

  addArticle = () => {
    router.push('/articles/add');
  };

  handleClick = e => {
    this.queryArticlesByCatalog(e.key);
  };

  queryArticlesByCatalog = catalogId => {
    const { dispatch } = this.props;
    let payload = { sorter: 'updatedAt_desc' };
    if (catalogId !== 'recommand') {
      payload = { ...payload, catalogId_equal: catalogId };
    }
    dispatch({
      type: 'article/fetchList',
      payload,
    });
  };

  render() {
    const { article } = this.props;
    const { list } = article;

    return (
      <GridContent>
        <Catalog onMenuClick={this.handleClick} />
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <ArticleList list={list} />
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
