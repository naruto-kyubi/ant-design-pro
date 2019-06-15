import React, { PureComponent } from 'react';
import { Icon, Badge } from 'antd';
import styles from './ArticleOperator.less';

export default class ArticleOperator extends PureComponent {
  render() {
    const { type, title, count, selected, onClick } = this.props;

    return (
      <div className={styles.operator} onClick={() => onClick(type)}>
        <Badge count={count} offset={[0, 0]}>
          <div className={selected ? styles.selected_circle : styles.circle}>
            <Icon type={type} className={styles.icon} />
          </div>
          <div className={styles.title}>{title}</div>
        </Badge>
      </div>
    );
  }
}
