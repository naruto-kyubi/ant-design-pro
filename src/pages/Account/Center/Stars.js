import React, { Component } from 'react';
import { connect } from 'dva';
import ArticleList from '@/pages/articles/components/ArticleList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { hasMorePage, getPaginationPayload } from '@/utils/pageUtils';

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
        // sorter: 'updatedAt_desc',
      },
    });
  }

  loadMore = () => {
    this.queryStars();
  };

  queryStars = isFirstPage => {
    const {
      dispatch,
      location: {
        query: { id },
      },
      star: { starList },
      user: { currentUser },
    } = this.props;
    let uid;

    if (currentUser) {
      const { id: cid } = currentUser;
      uid = cid;
    }
    const userId = id || uid;

    const payload = getPaginationPayload(starList, isFirstPage, null, null, { userId });

    dispatch({
      type: 'star/fetchStarList',
      payload,
    });
  };

  render() {
    const {
      star: { starList },
    } = this.props;

    if (!starList) return null;
    const { data } = starList;
    if (!data) return null;

    const v = data.map(item => {
      const { article: ar } = item;
      return ar;
    });

    return (
      <GridContent>
        <ArticleList data={v} loadMore={this.loadMore} hasMore={hasMorePage(starList)} />
      </GridContent>
    );
  }
}

export default Stars;
