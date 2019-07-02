import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './FollowButton.less';

export default class FollowButton extends PureComponent {
  render() {
    const { data, follow, onFollowClick } = this.props;
    // 未关注，已关注，相互关注；

    let followType = '+关注';

    switch (follow) {
      case null:
        followType = '+关注';
        break;
      case 'none':
        followType = '+关注';
        break;
      case 'follow':
        followType = '已关注';
        break;
      case 'both':
        followType = '相互关注';
        break;
      default:
    }
    return (
      <div>
        <Button onClick={() => onFollowClick(follow, data)} className={styles.main}>
          {followType}
        </Button>
      </div>
    );
  }
}
