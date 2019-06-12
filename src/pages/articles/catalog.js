import { Menu } from 'antd';
import { connect } from 'dva';
import React from 'react';

import styles from './catalog.less';

@connect(({ article }) => ({
  article,
}))
class Catalog extends React.Component {
  state = {
    current: null,
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
      article: { catalog },
    } = this.props;
    if (!catalog) return null;
    const { data } = catalog;
    const { current } = this.state;
    return (
      <div className={styles.nav}>
        <Menu onClick={this.onClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="recommand">
            {/* <Icon type="mail" /> */}
            推荐
          </Menu.Item>
          {data.map(element => {
            return <Menu.Item key={element.id}>{element.name}</Menu.Item>;
          })}
        </Menu>
      </div>
    );
  }
}

export default Catalog;
