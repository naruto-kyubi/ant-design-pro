import React, { Component } from 'react';
import { connect } from 'dva';
import ArticleList from '@/pages/articles/components/ArticleList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

@connect(({ star, user }) => ({
  star,
  user,
}))
class Stars extends Component {
  componentDidMount() {
    const { location, dispatch } = this.props;

    const {
      query: { id },
    } = location;

    const {
      user: { currentUser },
    } = this.props;
    let uid;

    if (currentUser) {
      const { id: cid } = currentUser;
      uid = cid;
    }

    const userId = id || uid;

    dispatch({
      type: 'star/fetchStarList',
      payload: {
        userId,
        sorter: 'updatedAt_desc',
      },
    });
  }

  loadMore = () => {
    this.queryStars();
  };

  queryStars = resetPool => {
    const {
      // match: {
      //   params: { id },
      // },
      dispatch,
      location,
      star: {
        starList: { meta },
      },
    } = this.props;

    const {
      query: { id },
    } = location;

    const {
      user: { currentUser },
    } = this.props;
    let uid;

    if (currentUser) {
      const { id: cid } = currentUser;
      uid = cid;
    }

    const userId = id || uid;

    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;
    const payload = {
      sorter: 'updatedAt_desc',
      currentPage,
      userId,
    };

    dispatch({
      type: 'star/fetchStarList',
      payload,
    });
  };

  hasMore = () => {
    const {
      star: {
        starList: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  render() {
    const { star } = this.props;
    if (!star) return null;
    const { starPool } = star;
    if (!starPool) return null;
    const hasMore = this.hasMore();

    const stars = starPool.map(item => {
      const { article: ar } = item;
      return ar;
    });

    return (
      <GridContent>
        <ArticleList data={stars} loadMore={this.loadMore} hasMore={hasMore} />
      </GridContent>
    );
  }
}

export default Stars;
