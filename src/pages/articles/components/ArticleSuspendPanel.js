import React, { PureComponent } from 'react';
import ArticleOperator from './ArticleOperator';
import styles from './ArticleSuspendPanel.less';

export default class ArticleSuspendPanel extends PureComponent {
  render() {
    const { data, direction } = this.props;

    return (
      <div className={direction === 'v' ? styles.vPanel : styles.hPanel}>
        {data.map(item => (
          <ArticleOperator {...item} />
        ))}
      </div>
    );
  }
}
