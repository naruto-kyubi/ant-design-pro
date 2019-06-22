import React, { PureComponent } from 'react';
import { Button } from 'antd';

export default class FollowButton extends PureComponent {
  render() {
    const { followed, onFollowClick } = this.props;
    return (
      <div>
        <Button onClick={() => onFollowClick(followed)}>{followed ? '已关注' : '+关注'}</Button>
      </div>
    );
  }
}
