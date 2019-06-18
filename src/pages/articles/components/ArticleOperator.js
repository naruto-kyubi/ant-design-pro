import React, { PureComponent } from 'react';
import { Icon, Badge } from 'antd';
import styles from './ArticleOperator.less';

export default class ArticleOperator extends PureComponent {
  render() {
    const { type, title, count, selected, onClick } = this.props;

    const obj = {
      type,
      title,
      count,
      selected,
    };

    return (
      <div className={styles.operator} onClick={() => onClick(obj)}>
        <Badge count={count} offset={[0, 0]} style={{ backgroundColor: '#b2b2b5' }}>
          <div className={selected ? styles.selected_circle : styles.circle}>
            <Icon type={type} className={styles.icon} />
          </div>
          <div className={styles.title}>{title}</div>
        </Badge>
      </div>
    );
  }
}
