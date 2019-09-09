import React, { PureComponent } from 'react';
import { connect } from 'dva';

import TagList from './components/TagList';

@connect(({ tag }) => ({
  tag,
}))
class AllTags extends PureComponent {
  componentDidMount() {
    this.query(true);
  }

  loadMore = () => {
    this.query();
  };

  hasMore = () => {
    const {
      tag: {
        tags: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  query = resetPool => {
    const {
      dispatch,
      tag: {
        tags: { meta },
      },
    } = this.props;

    let current = meta ? meta.pagination.current + 1 : 1;
    current = resetPool ? 1 : current;
    const payload = {
      current,
    };

    dispatch({
      type: 'tag/fetchAllTags',
      payload,
    });
  };

  onFollowClick = (follow, item) => {
    // add/cancel follow;

    const { dispatch } = this.props;
    const { id } = item;
    switch (follow) {
      case 'follow':
        // cancel
        dispatch({
          type: 'tag/deleteTag',
          payload: {
            tagId: id,
          },
        });
        break;
      case 'none':
        // add
        dispatch({
          type: 'tag/addTag',
          payload: {
            tag: id,
          },
        });
        break;
      default:
    }
  };

  render() {
    const {
      tag: { tags },
    } = this.props;
    if (!tags) return null;
    const { data } = tags;
    if (!data) return null;
    const v = data.map(item => {
      return { ...item, follow: item.userId ? 'follow' : 'none' };
    });
    return (
      <TagList
        data={v}
        hasMore={this.hasMore()}
        loadMore={this.loadMore}
        onFollowClick={this.onFollowClick}
      />
    );
  }
}

export default AllTags;
