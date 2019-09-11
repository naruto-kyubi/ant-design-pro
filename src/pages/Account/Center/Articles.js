import React, { Component } from 'react';
import { connect } from 'dva';
import ArticleList from '@/pages/articles/components/ArticleList';
import { hasMorePage, getPaginationPayload } from '@/utils/pageUtils';

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
      },
    });
  }

  loadMore = () => {
    this.queryArticles();
  };

  queryArticles = isFirstPage => {
    const {
      dispatch,
      location,
      article: { user2ArticleList },
    } = this.props;

    const {
      query: { id },
    } = location;

    const payload = getPaginationPayload(user2ArticleList, isFirstPage, null, null, { userId: id });

    dispatch({
      type: 'article/fetchUser2ArticleList',
      payload,
    });
  };

  render() {
    const { article } = this.props;
    const { user2ArticleList } = article;
    if (!user2ArticleList || user2ArticleList.length === 0) return null;
    const { data } = user2ArticleList;

    return (
      <ArticleList data={data} loadMore={this.loadMore} hasMore={hasMorePage(user2ArticleList)} />
    );
  }
}

export default Articles;
