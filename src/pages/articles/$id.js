import React, { PureComponent } from 'react';
import { Row, Col, Card, Affix } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import ArticleContent from './components/ArticleContent';
import ArticleComment from './comment';
import ArticleSuspendPanel from './components/ArticleSuspendPanel';

import HostArticleList from './hostList';

@connect(({ article }) => ({
  article,
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
            articleId: id,
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

  render() {
    const {
      article,
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

    const { starCount, likeCount, commentCount } = data;
    const v = [
      {
        type: 'like',
        title: '喜欢',
        count: likeCount,
        selected: like.data ? true : false,
        onClick: this.onClick,
      },
      {
        type: 'star',
        title: '收藏',
        count: starCount,
        selected: star.data ? true : false,
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
            <Card>
              <div>
                <ArticleContent article={data} />
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
