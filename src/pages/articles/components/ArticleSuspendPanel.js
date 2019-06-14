import React, { PureComponent } from 'react';
import ArticleOperator from './ArticleOperator';
import styles from './ArticleSuspendPanel.less';

export default class ArticleSuspendPanel extends PureComponent {
  render() {
    const { data, direction } = this.props;
    const { star, like, message, weibo, wechat } = data;

    return (
      <div className={direction === 'v' ? styles.vPanel : styles.hPanel}>
        <ArticleOperator type="like" title="赞" {...like} />
        <ArticleOperator type="star" title="收藏" {...star} />
        <ArticleOperator type="message" title="评论" {...message} />
        <ArticleOperator type="weibo" title="微博" {...weibo} />
        <ArticleOperator type="wechat" title="微信" {...wechat} />
      </div>
    );
  }
}
