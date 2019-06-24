import React, { Component } from 'react';
import { connect } from 'dva';
// import ArticleListContent from '@/components/ArticleListContent';
import ArticleList from '@/pages/articles/components/ArticleList';

@connect(({ article, user }) => ({
  article,
  user,
}))
class Articles extends Component {
  componentDidMount() {
    const { location, dispatch } = this.props;

    const {
      query: { id },
    } = location;

    // const { dispatch , user: { data :{id}} }  = this.props;
    dispatch({
      type: 'article/fetchArticleList',
      payload: {
        'owner.id': id,
        sorter: 'updatedAt_desc',
      },
    });
  }

  loadMore = () => {
    this.queryArticles();
  };

  queryArticles = resetPool => {
    const {
      dispatch,
      location,
      article: {
        articleList: { meta },
      },
    } = this.props;

    const {
      query: { id },
    } = location;

    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;
    const payload = {
      sorter: 'updatedAt_desc',
      currentPage,
      'owner.id': id,
    };

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

  render() {
    const { article } = this.props;
    if (!article) return null;
    const { articlePool } = article;
    if (!articlePool) return null;
    const hasMore = this.hasMore();

    return <ArticleList data={articlePool} loadMore={this.loadMore} hasMore={hasMore} />;
  }
}

export default Articles;
