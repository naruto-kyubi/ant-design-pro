import React, { Component } from 'react';
import { connect } from 'dva';

import UserList from '@/pages/Account/components/UserList';

@connect(({ user, follow }) => ({
  user,
  follow,
}))
class Users extends Component {
  componentDidMount() {
    const { location, dispatch } = this.props;

    const {
      query: { keyword },
    } = location;

    dispatch({
      type: 'follow/search',
      payload: {
        keyword,
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
      query: { keyword },
    } = location;

    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;

    dispatch({
      type: 'follow/search',
      payload: {
        currentPage,
        keyword,
      },
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

  onFollowClick = (follow, item) => {
    const { dispatch } = this.props;
    const { id } = item;
    switch (follow) {
      case 'both':
      case 'follow':
        // 取消关注；
        dispatch({
          type: 'follow/deleteFollows',
          payload: {
            id,
          },
        });
        break;
      case null:
      case 'none':
        // 新增关注；
        dispatch({
          type: 'follow/addFollows',
          payload: {
            followUser: id,
          },
        });
        break;
      default:
    }
  };

  render() {
    const { follow } = this.props;
    if (!follow) return null;
    const { follows } = follow;
    if (!follows) return null;

    const { data } = follows;
    if (!data) return null;

    const hasMore = this.hasMore();

    return (
      <UserList
        data={data}
        loadMore={this.loadMore}
        hasMore={hasMore}
        onFollowClick={this.onFollowClick}
      />
    );
  }
}

export default Users;
