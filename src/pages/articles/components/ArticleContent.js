import React, { PureComponent } from 'react';
import { Avatar } from 'antd';
import { formatDate } from '@/utils/utils';
import classnames from 'classnames';
import { connect } from 'dva';
import styles from './ArticleContent.less';

@connect(() => ({}))
class ArticleContent extends PureComponent {
  render() {
    const { article } = this.props;
    if (!article) return null;
    const {
      owner: { avatar, nickname },
      updatedAt,
      title,
    } = article;
    const content = article.contentHtml;
    return (
      <div className={styles.articleContent}>
        <div className={styles.title}>
          <div className={styles.avatar}>
            <Avatar size="large" icon="user" src={avatar} />
          </div>
          <div>
            <div className={styles.author}>{nickname}</div>
            <div className={styles.time}>{formatDate(updatedAt)}</div>
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
