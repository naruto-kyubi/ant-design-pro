import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ArticleSuspendPanel from './components/ArticleSuspendPanel';
import AuthorizationUtils from '@/pages/Authorization/AuthorizationUtils';

@connect(({ article, star }) => ({
  article,
  star: star.star,
}))
class ArticleSuspendPanelContainer extends PureComponent {
  componentDidMount() {
    const { id, dispatch } = this.props;

    dispatch({
      type: 'article/fetchArticleLikeById',
      payload: {
        targetId: id,
      },
    });

    dispatch({
      type: 'star/fetchArticleStarById',
      payload: {
        articleId: id,
      },
    });
  }

  onClick = obj => {
    if (AuthorizationUtils.check2login()) {
      return;
    }

    const { id, dispatch } = this.props;

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
          type: 'star/addStar',
          payload: {
            article: id,
          },
        });
      } else {
        dispatch({
          type: 'star/deleteStar',
          payload: {
            articleId: id,
          },
        });
      }
    }
  };

  render() {
    const { article, star } = this.props;
    const {
      articleDetail: { data },
      // like,
      // star,
    } = article;

    if (!data) {
      return null;
    }
    const { commentCount } = data;

    const { like } = article;

    const { data: likeData } = like;
    if (!likeData) return null;
    if (!star) return null;

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

    return <ArticleSuspendPanel data={v} direction="v" />;
  }
}

export default ArticleSuspendPanelContainer;
