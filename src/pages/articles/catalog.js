import { Menu } from 'antd';
import { connect } from 'dva';
import React from 'react';

import styles from './catalog.less';

@connect(({ article }) => ({
  article,
}))
class Catalog extends React.Component {
  state = {
    current: 'recommand',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchCatalog',
      payload: {
        sorter: 'sort_desc',
      },
    });
  }

  onClick = e => {
    const { onMenuClick } = this.props;
    this.setState({ current: e.key });
    onMenuClick(e);
  };

  render() {
    const {
      article: {
        catalog: { data },
      },
    } = this.props;
    if (!data) return null;
    const { current } = this.state;
    return (
      <div className={styles.nav}>
        <Menu onClick={this.onClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="recommand">推荐</Menu.Item>
          {data.map(element => {
            return <Menu.Item key={element.id}>{element.name}</Menu.Item>;
          })}
        </Menu>
      </div>
    );
  }
}

export default Catalog;
