import React, { Component } from 'react';
import { connect } from 'dva';

import UserList from '../components/UserList';

@connect(({ user, follow }) => ({
  user,
  follow,
}))
class Follows extends Component {
  componentDidMount() {
    const { location, dispatch } = this.props;

    const {
      query: { id },
    } = location;

    dispatch({
      type: 'follow/fetchFollows',
      payload: {
        'user.id': id,
        sorter: 'updatedAt_desc',
      },
    });
  }

  loadMore = () => {
    this.queryFollows();
  };

  queryFollows = resetPool => {
    const {
      dispatch,
      location,
      follow: {
        follows: { meta },
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
      'user.id': id,
    };

    dispatch({
      type: 'follow/fetchFollows',
      payload,
    });
  };

  hasMore = () => {
    const {
      follow: {
        follows: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  render() {
    const { follow } = this.props;
    if (!follow) return null;
    const { follows } = follow;
    if (!follows) return null;

    const { data } = follows;
    if (!data) return null;

    const hasMore = this.hasMore();

    const followsData = data.map(item => {
      const { followUser } = item;
      return followUser;
    });

    return <UserList data={followsData} loadMore={this.loadMore} hasMore={hasMore} />;
  }
}

export default Follows;
