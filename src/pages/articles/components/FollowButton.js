import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './FollowButton.less';

export default class FollowButton extends PureComponent {
  render() {
    const { followed, onFollowClick } = this.props;
    return (
      <div>
        <Button onClick={() => onFollowClick(followed)} className={styles.main}>
          {followed ? '已关注' : '+关注'}
        </Button>
      </div>
    );
  }
}
