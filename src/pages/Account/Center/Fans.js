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
        followUserId: id,
        sorter: 'updated_at_desc',
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
        follows: { meta },
      },
    } = this.props;

    const {
      query: { id },
    } = location;

    let current = meta ? meta.pagination.current + 1 : 1;
    current = resetPool ? 1 : current;

    dispatch({
      type: 'follow/fetchFans',
      payload: {
        sorter: 'updated_at_desc',
        current,
        followUserId: id,
      },
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

  onFollowClick = (follow, item) => {
    const { dispatch } = this.props;
    const { id } = item;
    switch (follow) {
      case 'both':
      case 'follow':
        dispatch({
          type: 'follow/deleteFans',
          payload: {
            id,
          },
        });
        break;
      case null:
      case 'none':
        dispatch({
          type: 'follow/addFans',
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
    const { fans } = follow;
    if (!fans) return null;

    const { data } = fans;
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

export default Fans;
