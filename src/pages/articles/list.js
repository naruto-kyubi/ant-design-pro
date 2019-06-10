import React, { PureComponent } from 'react';
import { List, Icon, Tag, Card, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Catalog from './catalog';
import ArticleListContent from '@/components/ArticleListContent';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import HostArticleList from './hostList';

import styles from './list.less';

@connect(({ article }) => ({
  article,
}))
class Articles extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchList',
      payload: {
        sorter: 'updatedAt_desc',
      },
    });
  }

  getContent = item => {
    const { content, owner, updatedAt } = item;
    const { nickname, avatar } = owner;
    return {
      content: `${content.substring(0, 200)}...`,
      updatedAt,
      owner: nickname,
      avatar,
    };
  };

  addArticle = () => {
    router.push('/articles/add');
  };

  render() {
    const { article } = this.props;
    const { list } = article;

    /*
    const {
      // eslint-disable-next-line no-unused-vars
      list: { article },
    } = this.props; */
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    return (
      <GridContent>
        <Catalog />
        <Row gutter={24}>
          <Col lg={17} md={24}>
            <Card className={styles.tabsCard} bordered={false}>
              <List
                size="large"
                className={styles.articleList}
                rowKey="id"
                itemLayout="vertical"
                dataSource={list.data}
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[
                      <IconText type="star-o" text={item.starCount} />,
                      <IconText type="like-o" text={item.likeCount} />,
                      <IconText type="message" text={item.commentCount} />,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <a className={styles.listItemMetaTitle} href={`/articles/${item.id}`}>
                          {item.title}
                        </a>
                      }
                      description={
                        <span>
                          <Tag>Ant Design</Tag>
                          <Tag>设计语言</Tag>
                          <Tag>蚂蚁金服</Tag>
                        </span>
                      }
                    />
                    <ArticleListContent data={this.getContent(item)} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <Button type="primary" icon="edit" onClick={this.addArticle}>
                发表新帖
              </Button>
            </Card>
            <HostArticleList />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Articles;
