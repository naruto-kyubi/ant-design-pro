import React, { PureComponent } from 'react';
import { Row, Col, Card, Affix } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import ArticleContent from './components/ArticleContent';
import ArticleComment from './comment';
import ArticleSuspendPanelContainer from './ArticleSuspendPanelContainer';

import MoreLikeThisArticle from '@/pages/search/MoreLikeThisArticle';
import User2ArticleList from './user2articleContainer';

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
  }

  render() {
    const {
      article,
      match: {
        params: { id },
      },
    } = this.props;
    const {
      articleDetail: { data },
    } = article;


    if (!data) {
      return null;
    }

    const { owner:{id:userId}} = data;

    return (
      <div>
        <GridContent>
          <Affix offsetTop={240}>
            <div style={{ float: 'left', marginLeft: '-96px' }}>
              <ArticleSuspendPanelContainer id={id} />
            </div>
          </Affix>
          <Row gutter={24}>
            <Col lg={17} md={24}>
              <Card bordered={false}>
                <div>
                  <ArticleContent article={data} />
                  <ArticleComment articleId={id} />
                  <MoreLikeThisArticle id={id} />
                  
                </div>
              </Card>
            </Col>
            <Col lg={7} md={24}>
              {/* <MoreLikeThisArticle id={id} /> */}
              <User2ArticleList userId={userId} />
            </Col>
          </Row>
        </GridContent>
      </div>
    );
  }
}

export default Article;
