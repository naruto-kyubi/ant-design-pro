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
      type: 'article/fetchCommentList',
      payload: {
        articleId: id,
        sorter: 'updatedAt_desc',
      },
    });
  }

  onClick = () => {};

  render() {
    const { article } = this.props;
    const {
      articleDetail: { data },
      commentPool,
    } = article;
    if (!data) {
      return null;
    }

    const v = {
      like: {
        count: 88,
        selected: false,
        onClick: this.onClick,
      },
      star: {
        count: 0,
        selected: true,
        onClick: this.onClick,
      },

      message: {
        count: 0,
        selected: false,
        onClick: this.onClick,
      },
      weibo: {
        count: 0,
        selected: false,
        onClick: this.onClick,
      },
      wechat: {
        count: 0,
        selected: false,
        onClick: this.onClick,
      },
    };

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
                <ArticleComment comments={commentPool} />
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
