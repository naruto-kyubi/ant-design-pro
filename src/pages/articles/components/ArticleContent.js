import React, { PureComponent } from 'react';
import { Avatar, Divider } from 'antd';
import { formatDate } from '@/utils/utils';
import classnames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './ArticleContent.less';

import FollowButton from './FollowButton';

@connect(({ user }) => ({
  user,
}))
class ArticleContent extends PureComponent {
  onUserClick = () => {
    const {
      article: { owner },
      onUserClick,
    } = this.props;
    onUserClick(owner);
  };

  editArticle = () => {
    router.push('/articles/edit?isEdit=true');
  };

  render() {
    const { article, follow, onFollowClick, user } = this.props;
    if (!article) return null;
    const {
      owner: { avatar, nickname, id },
      viewCount,
      updatedAt,
      title,
    } = article;

    const currentUserid = user.currentUser ? user.currentUser.id : null;
    const isOwner = currentUserid === id;

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
          <div style={{ width: '100%' }}>
            <div className={styles.author}>
              <span>
                <a onClick={this.onUserClick}>{nickname}</a>
              </span>
              <span style={{ float: 'right' }}>
                <FollowButton follow={follow} onFollowClick={onFollowClick} />
              </span>
            </div>
            <div className={styles.time}>
              <span>{formatDate(updatedAt)}</span>
              <Divider type="vertical" />
              <span>阅读数:{viewCount}</span>
              {isOwner ? (
                <span>
                  <a onClick={this.editArticle}> 编辑</a>
                </span>
              ) : null}
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
