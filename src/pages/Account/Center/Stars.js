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
      dispatch,
      location: {
        query: { id },
      },
      star: {
        stars: { meta },
      },
      user: { currentUser },
    } = this.props;
    let uid;

    if (currentUser) {
      const { id: cid } = currentUser;
      uid = cid;
    }

    const userId = id || uid;

    let current = meta ? meta.pagination.current + 1 : 1;
    current = resetPool ? 1 : current;
    const payload = {
      sorter: 'updatedAt_desc',
      current,
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
        stars: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  render() {
    const {
      star: {
        stars: { data },
      },
    } = this.props;

    if (!data) return null;

    const v = data.map(item => {
      const { article: ar } = item;
      return ar;
    });

    return (
      <GridContent>
        <ArticleList data={v} loadMore={this.loadMore} hasMore={this.hasMore()} />
      </GridContent>
    );
  }
}

export default Stars;
