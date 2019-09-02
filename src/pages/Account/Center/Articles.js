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

    dispatch({
      type: 'article/fetchUser2ArticleList',
      payload: {
        userId: id,
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
        user2ArticleList: { meta },
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
      userId: id,
    };

    dispatch({
      type: 'article/fetchUser2ArticleList',
      payload,
    });
  };

  hasMore = () => {
    const {
      article: {
        user2ArticleList: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  render() {
    // const { article } = this.props;
    // if (!article) return null;
    // const { articlePool } = article;
    // if (!articlePool) return null;

    const { article } = this.props;
    const { user2ArticleList } = article;
    if (!user2ArticleList || user2ArticleList.length === 0) return null;
    const { data } = user2ArticleList;

    return <ArticleList data={data} loadMore={this.loadMore} hasMore={this.hasMore()} />;
  }
}

export default Articles;
