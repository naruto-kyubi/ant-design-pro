import React, { PureComponent } from 'react';
import { Avatar, Divider } from 'antd';
import { formatDate } from '@/utils/utils';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './ArticleContent.less';

import 'braft-editor/dist/output.css';

import FollowButton from './FollowButton';

@connect(({ user, follow }) => ({
  user,
  follow: follow.follow,
}))
class ArticleContent extends PureComponent {
  componentDidMount() {
    const { article, dispatch } = this.props;
    if (!article) return;
    const { owner } = article;
    if (!owner) return;

    const { id: userId } = owner;

    dispatch({
      type: 'follow/queryFollow',
      payload: {
        id: userId,
      },
    });
  }

  editArticle = () => {
    router.push('/articles/edit');
  };

  onFollowClick = follow => {
    const {
      dispatch,
      article: {
        owner: { id },
      },
    } = this.props;
    if (follow !== 'none') {
      dispatch({
        type: 'follow/deleteFollow',
        payload: {
          id,
        },
      });
    } else {
      dispatch({
        type: 'follow/addFollow',
        payload: {
          followUser: id,
        },
      });
    }
  };

  onUserClick = () => {
    const { article } = this.props;
    const {
      owner: { id },
    } = article;
    router.push(`/account/center/articles?id=${id}`);
  };

  render() {
    const { article, follow, user } = this.props;
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

    if (!follow) return null;
    const { data: followData } = follow;

    let mu = 'none';
    if (followData) {
      const { mutual } = followData;
      if (mutual) {
        mu = mutual;
      }
    }

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
                <FollowButton follow={mu} onFollowClick={this.onFollowClick} />
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
        <div className="braft-output-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }
}

export default ArticleContent;
