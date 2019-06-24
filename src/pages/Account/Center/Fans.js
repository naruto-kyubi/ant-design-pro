import React, { Component } from 'react';
import { connect } from 'dva';

import UserList from '../components/UserList';

@connect(({ user, follow }) => ({
  user,
  follow,
}))
class Fans extends Component {
  componentDidMount() {
    const { location, dispatch } = this.props;

    const {
      query: { id },
    } = location;

    dispatch({
      type: 'follow/fetchFans',
      payload: {
        'followUser.id': id,
        sorter: 'updatedAt_desc',
      },
    });
  }

  loadMore = () => {
    this.queryFans();
  };

  queryFans = resetPool => {
    const {
      dispatch,
      location,
      follow: {
        users: { meta },
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
      'followUser.id': id,
    };

    dispatch({
      type: 'follow/fetchFans',
      payload,
    });
  };

  hasMore = () => {
    const {
      follow: {
        fans: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  render() {
    const { follow } = this.props;
    if (!follow) return null;
    const { fans } = follow;
    if (!fans) return null;

    const { data } = fans;
    if (!data) return null;

    const hasMore = this.hasMore();

    const fansData = data.map(item => {
      const { user } = item;
      return user;
    });

    return <UserList data={fansData} loadMore={this.loadMore} hasMore={hasMore} />;
  }
}

export default Fans;
