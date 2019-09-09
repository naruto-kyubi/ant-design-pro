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
        userId: id,
        sorter: 'updated_at_desc',
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

    let current = meta ? meta.pagination.current + 1 : 1;
    current = resetPool ? 1 : current;

    dispatch({
      type: 'follow/fetchFollows',
      payload: {
        sorter: 'updated_at_desc',
        current,
        userId: id,
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
        dispatch({
          type: 'follow/deleteFollows',
          payload: {
            id,
          },
        });
        break;
      case null:
      case 'none':
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

    return (
      <UserList
        data={data}
        loadMore={this.loadMore}
        hasMore={this.hasMore()}
        onFollowClick={this.onFollowClick}
      />
    );
  }
}

export default Follows;
