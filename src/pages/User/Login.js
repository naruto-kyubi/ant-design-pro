import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    authType: 'account',
    autoLogin: true,
  };

  componentDidMount() {
    window.oAuth = this.oAuth;
  }

  oAuth = (authType, authCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: {
        // ...values,
        authType,
        authCode,
        password: '123',
      },
    });

    // 登录；
    // dispatch({
    //   type: 'login/auth',
    //   payload: {
    //     oAuthType,
    //     code,
    //   },
    // });
  };

  onTabChange = authType => {
    this.setState({ authType });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getLogonCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
          // message.warning(formatMessage({ id: 'app.login.verification-code-warning' }));
        }
      });
    });

  handleSubmit = (err, values) => {
    const { authType } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          authType,
        },
      });
    }
  };

  handOAuthClick = oAuthType => {
    console.log('----');
    // this.handleModalVisible(true);
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

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { authType, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={authType}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'fail' &&
              authType === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: login.data.errCode }))}
            <UserName
              name="userName"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <Tab key="captcha" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'fail' &&
              authType === 'captcha' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: login.data.errCode }))}
            <Mobile
              name="mobile"
              placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
              getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.verification-code.required' }),
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="/user/forgotpassword">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>

          <div className={styles.other}>
            <FormattedMessage id="app.login.sign-in-with" />
            <Icon
              type="alipay-circle"
              className={styles.icon}
              theme="outlined"
              onClick={() => this.handOAuthClick('alipay')}
            />
            <Icon
              type="taobao-circle"
              className={styles.icon}
              theme="outlined"
              onClick={() => this.handOAuthClick('taobao')}
            />
            <Icon
              type="weibo-circle"
              className={styles.icon}
              theme="outlined"
              onClick={() => this.handOAuthClick('weibo')}
            />
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
