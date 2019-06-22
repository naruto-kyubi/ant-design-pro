import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';

export default class Tab extends Component {
  state = {
    current: 'recommand',
  };

  onClick = e => {
    const { onMenuClick } = this.props;
    this.setState({ current: e.key });
    onMenuClick(e);
  };

  render() {
    const { data } = this.props;
    if (!data) return null;
    const { current } = this.state;

    return (
      <div>
        <Menu onClick={this.onClick} selectedKeys={[current]} mode="horizontal">
          {data.map(item => {
            return <Menu.Item key={item.id}> {item.name} </Menu.Item>;
          })}
        </Menu>
      </div>
    );
  }
}
