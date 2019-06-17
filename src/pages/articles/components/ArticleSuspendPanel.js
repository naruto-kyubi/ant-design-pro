import React, { PureComponent } from 'react';
import ArticleOperator from './ArticleOperator';
import styles from './ArticleSuspendPanel.less';

export default class ArticleSuspendPanel extends PureComponent {
  render() {
    const { data, direction } = this.props;
    // const { star, like, message, weibo, wechat } = data;

    return (
      <div className={direction === 'v' ? styles.vPanel : styles.hPanel}>
        {data.map(item => (
          <ArticleOperator {...item} />
        ))}
      </div>
    );
  }
}
