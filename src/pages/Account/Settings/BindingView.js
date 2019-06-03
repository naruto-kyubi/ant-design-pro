import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Icon, List } from 'antd';

class BindingView extends Component {
  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.binding.weibo' }, {}),
      description: formatMessage({ id: 'app.settings.binding.weibo-description' }, {}),
      actions: [
        <a onClick={this.handleBindClick('weibo')}>
          <FormattedMessage id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <Icon type="weibo" className="weibo" />,
    },

    {
      title: formatMessage({ id: 'app.settings.binding.taobao' }, {}),
      description: formatMessage({ id: 'app.settings.binding.taobao-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <Icon type="taobao" className="taobao" />,
    },
    {
      title: formatMessage({ id: 'app.settings.binding.alipay' }, {}),
      description: formatMessage({ id: 'app.settings.binding.alipay-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <Icon type="alipay" className="alipay" />,
    },
    {
      title: formatMessage({ id: 'app.settings.binding.dingding' }, {}),
      description: formatMessage({ id: 'app.settings.binding.dingding-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <Icon type="dingding" className="dingding" />,
    },
  ];

  handleBindClick = oAuthType => {
    const iWidth = 800; // 弹出窗口的宽度;
    const iHeight = 600; // 弹出窗口的高度;
    const iTop = (window.screen.availHeight - iHeight) / 2; // 获得窗口的垂直位置;
    const iLeft = (window.screen.availWidth - iWidth) / 2; // 获得窗口的水平位置;
    const name = '认证';
    if (oAuthType === 'weibo') {
      const url = `https://api.weibo.com/oauth2/authorize?client_id=3274457296&response_type=code&redirect_uri=${
        window.location.origin
      }/user/weibo`;
      window.open(
        url,
        name,
        `height=${iHeight},width=${iWidth},top=${iTop},left=${iLeft},toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no`
      );
    } else if (oAuthType === 'taobao') {
      alert('taobao');
    } else if (oAuthType === 'alipay') {
      alert('alipay');
    }
  };

  // handOAuthClick = oAuthType => {
  //   const iWidth = 800; // 弹出窗口的宽度;
  //   const iHeight = 600; // 弹出窗口的高度;
  //   const iTop = (window.screen.availHeight - iHeight) / 2; // 获得窗口的垂直位置;
  //   const iLeft = (window.screen.availWidth - iWidth) / 2; // 获得窗口的水平位置;
  //   const name = '认证';
  //   if (oAuthType === 'weibo') {
  //     const url = `https://api.weibo.com/oauth2/authorize?client_id=3274457296&response_type=code&redirect_uri=${
  //       window.location.origin
  //     }/user/weibo`;
  //     window.open(
  //       url,
  //       name,
  //       `height=${iHeight},width=${iWidth},top=${iTop},left=${iLeft},toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no`
  //     );
  //   } else if (oAuthType === 'taobao') {
  //     alert('taobao');
  //   } else if (oAuthType === 'alipay') {
  //     alert('alipay');
  //   }
  // };

  oAuth = (authType, authCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/bind',
      payload: {
        // ...values,
        authType,
        authCode,
      },
    });
  };

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default BindingView;
