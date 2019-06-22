import React, { PureComponent } from 'react';
import { Avatar, Divider } from 'antd';
import { formatDate } from '@/utils/utils';
import classnames from 'classnames';
import { connect } from 'dva';
import styles from './ArticleContent.less';

import FollowButton from './FollowButton';

@connect(() => ({}))
class ArticleContent extends PureComponent {
  onUserClick = () => {
    const {
      article: { owner },
      onUserClick,
    } = this.props;
    onUserClick(owner);
  };

  render() {
    const { article, followed, onFollowClick } = this.props;
    if (!article) return null;
    const {
      owner: { avatar, nickname },
      viewCount,
      updatedAt,
      title,
    } = article;
    const content = article.contentHtml;
    return (
      <div className={styles.articleContent}>
        <div className={styles.title}>
          <div className={styles.avatar}>
            <Avatar
              style={{ cursor: 'pointer' }}
              size="large"
              icon="user"
              src={avatar}
              onClick={this.onUserClick}
            />
          </div>
          s
          <div>
            <div className={styles.author}>
              <span>
                <a onClick={this.onUserClick}>{nickname}</a>
              </span>
              <span style={{ float: 'right', right: '10px' }}>
                <FollowButton followed={followed} onFollowClick={onFollowClick} />
              </span>
            </div>
            <div className={styles.time}>
              <span>{formatDate(updatedAt)}</span>
              <Divider type="vertical" />
              <span>阅读数:{viewCount}</span>{' '}
            </div>
          </div>
        </div>
        <div>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={classnames(styles.content)} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }
}

export default ArticleContent;
