import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import FollowButton from '@/pages/articles/components/FollowButton';

@connect(({ loading, user, project, follow }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.user.data,
  currentUserLoading: loading.effects['user/fetchUserById'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
  user,
  follow: follow.follow,
}))
class Center extends Component {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    const { location, dispatch } = this.props;

    const {
      query: { id },
    } = location;
    dispatch({
      type: 'user/fetchUserById',
      payload: {
        id,
      },
    });

    dispatch({
      type: 'follow/queryFollow',
      payload: {
        id,
      },
    });

    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
    dispatch({
      type: 'project/fetchNotice',
    });
  }

  onTabChange = key => {
    const { match, location } = this.props;
    const {
      query: { id },
    } = location;

    switch (key) {
      case 'articles':
        router.push(`${match.url}/articles?id=${id}`);
        break;
      case 'stars':
        router.push(`${match.url}/stars?id=${id}`);
        break;
      case 'follows':
        router.push(`${match.url}/follows?id=${id}`);
        break;
      case 'fans':
        router.push(`${match.url}/fans?id=${id}`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  onFollowClick = follow => {
    const {
      dispatch,
      location: {
        query: { id },
      },
    } = this.props;

    if (follow !== 'none') {
      dispatch({
        type: 'follow/deleteFollow',
        payload: {
          id,
        },
        // callback: ( response )=>{
        //   const {
        //     location,
        //     dispatch,
        //   } = this.props;

        //   const {
        //     query: { id },
        //   } = location;
        //   dispatch({
        //     type: 'user/fetchUserById',
        //     payload: {
        //       id,
        //     },
        //   });
        // },
      });
    } else {
      dispatch({
        type: 'follow/addFollow',
        payload: {
          followUser: id,
        },
        // callback: ( response )=>{
        //   const {
        //     location,
        //     dispatch,
        //   } = this.props;

        //   const {
        //     query: { id },
        //   } = location;
        //   dispatch({
        //     type: 'user/fetchUserById',
        //     payload: {
        //       id,
        //     },
        //   });
        // },
      });
    }
  };

  render() {
    const { newTags, inputVisible, inputValue } = this.state;
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { notice },
      projectLoading,
      match,
      location,
      children,
      follow,
    } = this.props;

    if (!currentUser) return null;
    const {
      articleCount = 0,
      // likeCount = 0,
      starCount = 0,
      fanCount = 0,
      followCount = 0,
    } = currentUser;

    if (!follow) return null;
    const { data: followData } = follow;
    let mu = 'none';
    if (followData) {
      const { mutual } = followData;
      if (mutual) {
        mu = mutual;
      }
    }

    const operationTabList = [
      {
        key: 'articles',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>文章{articleCount > 0 ? `(${articleCount})` : ''}</span>
          </span>
        ),
      },
      {
        key: 'stars',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}> 收藏{starCount > 0 ? `(${starCount})` : ''}</span>
          </span>
        ),
      },
      {
        key: 'follows',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>关注了{followCount > 0 ? `(${followCount})` : ''}</span>
          </span>
        ),
      },
      {
        key: 'fans',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>粉丝{fanCount > 0 ? `(${fanCount})` : ''}</span>
          </span>
        ),
      },
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.nickname}</div>
                    <div>{currentUser.profile}</div>
                  </div>

                  <div className={styles.detail}>
                    {/* <p>
                      <i className={styles.title} />
                      {currentUser.title}
                    </p>
                    <p>
                      <i className={styles.group} />
                      {currentUser.group}
                    </p> */}
                    <p>
                      <i className={styles.address} />
                      {currentUser.geographic.province.label}-{currentUser.geographic.city.label}
                    </p>
                  </div>
                  <div style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>
                    <FollowButton follow={mu} onFollowClick={this.onFollowClick} />
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {/* {currentUser.tags.concat(newTags).map(item => (
                      <Tag key={item.key}>{item.label}</Tag>
                    ))} */}
                    {newTags.map(item => (
                      <Tag key={item.key}>{item.label}</Tag>
                    ))}
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>团队</div>
                    <Spin spinning={projectLoading}>
                      <Row gutter={36}>
                        {notice.map(item => (
                          <Col key={item.id} lg={24} xl={12}>
                            <Link to={item.href}>
                              <Avatar size="small" src={item.logo} />
                              {item.member}
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    </Spin>
                  </div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
