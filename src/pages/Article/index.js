import React, { PureComponent } from 'react';
import { List, Icon, Tag, Card, Row, Col } from 'antd';
import { connect } from 'dva';
import ArticleListContent from '@/components/ArticleListContent';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';

@connect(({ article }) => ({
  article,
}))
class Article extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetch',
      payload: {
        count: 8,
      },
    });
  }

  getContent = item => {
    const { content, owner, updatedAt } = item;
    const { nickname, avatar } = owner;
    return {
      content,
      updatedAt,
      owner: nickname,
      avatar,
    };
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
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              这里要放置热帖！
            </Card>
          </Col>
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
                        <a className={styles.listItemMetaTitle} href={item.href}>
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
        </Row>
      </GridContent>
    );
  }
}

export default Article;
