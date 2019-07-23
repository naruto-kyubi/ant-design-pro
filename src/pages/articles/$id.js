import React, { PureComponent } from 'react';
import { Row, Col, Card, Affix, Modal } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import ArticleContent from './components/ArticleContent';
import ArticleComment from './comment';
import ArticleSuspendPanelContainer from './ArticleSuspendPanelContainer';

import HotArticleList from './hotList';
import MoreLikeThisArticle from '@/pages/search/MoreLikeThisArticle'

@connect(({ article  }) => ({
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
    } = article;

    if (!data) {
      return null;
    }

    return (
      <div>
        <GridContent>
          <Affix offsetTop={240}>
            <div style={{ float: 'left', marginLeft: '-96px' }}>
              <ArticleSuspendPanelContainer id={ id }/>
            </div>
          </Affix>
          <Row gutter={24}>
            <Col lg={17} md={24}>
              <Card bordered={false}>
                <div>
                  <ArticleContent
                    article={data}
                  />
                  <ArticleComment articleId={id} />
                  <MoreLikeThisArticle id={id} />
                </div>
              </Card>
            </Col>
            <Col lg={7} md={24}>
              {/* <MoreLikeThisArticle id={id} /> */}
            </Col>
          </Row>
        </GridContent>
      </div>
    );
  }
}

export default Article;
