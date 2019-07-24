import React, { Component } from 'react';

class Oauth extends Component {
  componentDidMount() {
    // 获取code
    const {
      location: {
        query: { code, error },
      },
    } = this.props;
    if (!error) {
      window.opener.oAuth('weibo', code);
    }
    window.close();
  }

  render() {
    return <div />;
  }
}

export default Oauth;
