import React, { Component } from 'react';

import { Avatar, Row, Col } from 'antd';
import { connect } from 'dva';
import FollowButton from '@/pages/articles/components/FollowButton';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ArticleList from '@/pages/articles/components/ArticleList';
import Tab from './Tab';

@connect(({ user, article }) => ({
  user: user.user,
  article,
}))
export default class User extends Component {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;

    dispatch({
      type: 'user/fetchUserById',
      payload: {
        id,
      },
    });

    dispatch({
      type: 'article/fetchArticleList',
      payload: {
        'owner.id': id,
        sorter: 'updatedAt_desc',
      },
    });
  }
  handlerMenuClick = e => {
    const { key } = e;
    switch (key) {
      case '1':
        break;
      case '2':
        dispatch({
          type: 'article/fetchStarList',
          payload: {
            userId: id,
            sorter: 'updatedAt_desc',
          },
        });

        break;
      case '3':
        break;
      default:
    }
  };
  loadMore = () => {
    this.queryArticles();
  };

  queryArticles = resetPool => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      article: {
        articleList: { meta },
      },
    } = this.props;

    // const { catalog } = this.state;
    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;
    let payload = {
      sorter: 'updatedAt_desc',
      currentPage,
      'owner.id': id,
    };

    // if (catalog !== 'recommand') {
    //     payload = { ...payload, catalogId_equal: catalog };
    // }
    dispatch({
      type: 'article/fetchArticleList',
      payload,
    });
  };

  hasMore = () => {
    const {
      article: {
        articleList: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  render() {
    const {
      user: { data },
      followed = false,
      onFollowClick,
    } = this.props;
    if (!data) return null;

    const { avatar, nickname } = data;

    const tabData = [
      {
        id: 1,
        name: '文章',
      },
      {
        id: 2,
        name: '收藏',
      },
      {
        id: 3,
        name: '喜欢',
      },
    ];

    const { article } = this.props;
    if (!article) return null;
    const { articlePool } = article;
    if (!articlePool) return null;
    const hasMore = this.hasMore();

    return (
      <div>
        <div>
          <span>
            <Avatar style={{ cursor: 'pointer' }} size="large" icon="user" src={avatar} />
          </span>
          <span>{nickname}</span>
          <span>
            <span style={{ float: 'right', right: '10px' }}>
              <FollowButton followed={true} onFollowClick={onFollowClick} />
            </span>
          </span>
        </div>
        <div>
          <GridContent>
            <Tab data={tabData} onMenuClick={this.handlerMenuClick} />
            <Row gutter={24}>
              <Col lg={17} md={24}>
                <ArticleList data={articlePool} loadMore={this.loadMore} hasMore={hasMore} />
              </Col>
            </Row>
          </GridContent>
        </div>
      </div>
    );
  }
}
