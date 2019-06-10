import { Menu } from 'antd';
import { connect } from 'dva';
import React from 'react';

import styles from './catalog.less';

@connect(({ article }) => ({
  article,
}))
class Catalog extends React.Component {
  state = {
    current: 'mail',
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

  handleClick = e => {
    this.setState({
      current: e.key,
    });
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
        <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="mail">
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
