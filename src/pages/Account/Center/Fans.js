import React, { Component } from 'react';
import { connect } from 'dva';

import UserList from '../components/UserList';
import { hasMorePage, getPaginationPayload } from '@/utils/pageUtils';

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
      },
    });
  }

  loadMore = () => {
    this.queryFans();
  };

  queryFans = isFirstPage => {
    const {
      dispatch,
      location,
      follow: { follows },
    } = this.props;

    const {
      query: { id },
    } = location;

    // let current = meta ? meta.pagination.current + 1 : 1;
    // current = isFirstPage ? 1 : current;

    const payload = getPaginationPayload(follows, isFirstPage, null, null, { followUserId: id });

    dispatch({
      type: 'follow/fetchFans',
      payload,
    });
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

    return (
      <UserList
        data={data}
        loadMore={this.loadMore}
        hasMore={hasMorePage(fans)}
        onFollowClick={this.onFollowClick}
      />
    );
  }
}

export default Fans;
