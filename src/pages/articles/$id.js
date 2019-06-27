import React, { PureComponent } from 'react';
import { Row, Col, Card, Affix } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import router from 'umi/router';
import ArticleContent from './components/ArticleContent';
import ArticleComment from './comment';
import ArticleSuspendPanel from './components/ArticleSuspendPanel';

import HostArticleList from './hostList';

@connect(({ article, follow }) => ({
  article,
  follow: follow.follow,
}))
class Article extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'article/fetchArticleById',
      payload: {
        id,
      },
      callback: obj => {
        const {
          data: { owner },
        } = obj;
        const { id: userId } = owner;
        dispatch({
          type: 'follow/queryFollow',
          payload: {
            id: userId,
          },
        });
      },
    });

    dispatch({
      type: 'article/fetchArticleLikeById',
      payload: {
        targetId: id,
      },
    });

    dispatch({
      type: 'article/fetchArticleStarById',
      payload: {
        articleId: id,
      },
    });

    dispatch({
      type: 'article/fetchCommentList',
      payload: {
        articleId: id,
        sorter: 'updatedAt_desc',
      },
    });
  }

  onClick = obj => {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;

    const { type, selected } = obj;
    if (type === 'like') {
      if (!selected) {
        dispatch({
          type: 'article/addLike',
          payload: {
            type: 'article',
            targetId: id,
          },
        });
      } else {
        dispatch({
          type: 'article/deleteLike',
          payload: {
            type: 'article',
            targetId: id,
          },
        });
      }
    } else if (type === 'star') {
      if (!selected) {
        dispatch({
          type: 'article/addStar',
          payload: {
            article: id,
          },
        });
      } else {
        dispatch({
          type: 'article/deleteStar',
          payload: {
            articleId: id,
          },
        });
      }
    }
  };

  onFollowClick = followed => {
    const {
      dispatch,
      article: {
        articleDetail: {
          data: {
            owner: { id },
          },
        },
      },
    } = this.props;
    if (followed) {
      dispatch({
        type: 'follow/deleteFollow',
        payload: {
          id,
        },
      });
    } else {
      dispatch({
        type: 'follow/addFollow',
        payload: {
          followUser: id,
        },
      });
    }
  };

  onUserClick = owner => {
    // alert(owner);
    const { id } = owner;
    router.push(`/account/center/articles?id=${id}`);
  };

  render() {
    const {
      article,
      follow,
      match: {
        params: { id },
      },
    } = this.props;
    const {
      articleDetail: { data },
      like,
      star,
    } = article;

    if (!data) {
      return null;
    }
    if (!follow) return null;
    const { data: followData } = follow;

    const { commentCount } = data;
    const { data: likeData } = like;
    if (!likeData) return null;
    const { data: starData } = star;
    if (!starData) return null;

    const { likeCount: likeCount_ = 0, like: like_ = undefined } = likeData;
    const { starCount: startCount_ = 0, star: star_ = undefined } = starData;

    const v = [
      {
        type: 'like',
        title: '喜欢',
        count: likeCount_,
        selected: !!like_,
        onClick: this.onClick,
      },
      {
        type: 'star',
        title: '收藏',
        count: startCount_,
        selected: !!star_,
        onClick: this.onClick,
      },
      {
        type: 'message',
        title: '评论',
        count: commentCount,
        selected: false,
        onClick: this.onClick,
      },
      {
        type: 'weibo',
        title: '微博',
        count: 0,
        selected: false,
        onClick: this.onClick,
      },
      {
        type: 'wechat',
        title: '微信',
        count: 0,
        selected: false,
        onClick: this.onClick,
      },
    ];

    return (
      <GridContent>
        <Affix offsetTop={240}>
          <div style={{ float: 'left', marginLeft: '-96px' }}>
            <ArticleSuspendPanel data={v} direction="v" onClick={this.onClick} />
          </div>
        </Affix>
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <Card bordered={false}>
              <div>
                <ArticleContent
                  article={data}
                  followed={!!followData}
                  onFollowClick={this.onFollowClick}
                  onUserClick={this.onUserClick}
                />
                <ArticleComment articleId={id} />
              </div>
            </Card>
          </Col>
          <Col lg={7} md={24}>
            <HostArticleList />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Article;
