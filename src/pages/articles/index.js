import React, { PureComponent } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Catalog from './catalog';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import HotArticleList from './hotList';
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
      if (e.key === 'tags') {
        // nav to user-tag-page
        router.push('/tags/usertags');
      } else {
        this.queryArticles(true);
      }
    });
  };

  loadMore = () => {
    this.queryArticles();
  };

  queryArticles = resetPool => {
    const {
      dispatch,
      article: {
        articleList: { meta },
      },
    } = this.props;
    const { catalog } = this.state;
    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;
    let payload = { sorter: 'updatedAt_desc', currentPage };
    if (catalog !== 'recommand') {
      payload = { ...payload, catalogId_equal: catalog };
    }
    dispatch({
      type: 'article/fetchArticleList',
      payload,
    });
  };

  hasMore = () => {
    const {
      article: {
        articleList: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  addArticle = () => {
    // router.push('/articles/edit');
    const { dispatch } = this.props;
    dispatch({
      type: 'article/new',
    });
  };

  render() {
    const { article } = this.props;
    const { articlePool } = article;
    const hasMore = this.hasMore();
    return (
      <GridContent>
        <div>
          <Catalog onMenuClick={this.handleClick} />
        </div>
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <ArticleList data={articlePool} loadMore={this.loadMore} hasMore={hasMore} />
          </Col>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <Button type="primary" icon="edit" onClick={this.addArticle}>
                发表新帖
              </Button>
            </Card>
            <HotArticleList />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Articles;
