import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ menu }) => ({
  components: menu.components,
}))
class ComponentUnAuthorization extends Component {
  render() {
    const { children, components, code } = this.props;

    const v = components.filter(item => item.code === code);

    if (!v || v.length < 1) {
      return <div>{children}</div>;
    }
    return <div />;
  }
}

export default ComponentUnAuthorization;
