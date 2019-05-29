import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ menu }) => ({
  components: menu.components,
}))
class ComponentAuthorization extends Component {
  render() {
    const { children, components, code } = this.props;

    const v = components.filter(item => item.code === code);

    if (v && v.length > 0) {
      return <span>{children}</span>;
    }

    return <span />;
  }
}

export default ComponentAuthorization;
