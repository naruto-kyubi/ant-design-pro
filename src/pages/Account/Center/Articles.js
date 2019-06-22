import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import ArticleListContent from '@/components/ArticleListContent';
import ArticleList from '@/pages/articles/components/ArticleList';

@connect(({ article, user }) => ({
  article,
  user,
}))
class Center1 extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;

    // const { dispatch , user: { data :{id}} }  = this.props;
    dispatch({
      type: 'article/fetchArticleList',
      payload: {
        'owner.id': id,
        sorter: 'updatedAt_desc',
      },
    });
  }

  // handlerMenuClick=(e)=>{
  //     const { key } = e;
  //     switch(key){
  //         case "1":

  //             break;
  //         case "2":
  //                 dispatch({
  //                     type: 'article/fetchStarList',
  //                     payload:{
  //                         "userId": id,
  //                         sorter: 'updatedAt_desc',
  //                     }
  //                 });

  //             break;
  //         case "3":

  //             break;
  //         default:

  //     }
  // };
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

    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;
    const payload = {
      sorter: 'updatedAt_desc',
      currentPage,
      'owner.id': id,
    };

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
    const { article } = this.props;
    if (!article) return null;
    const { articlePool } = article;
    if (!articlePool) return null;
    const hasMore = this.hasMore();

    // const {
    //   list: { list },
    // } = this.props;
    // const IconText = ({ type, text }) => (
    //   <span>
    //     <Icon type={type} style={{ marginRight: 8 }} />
    //     {text}
    //   </span>
    // );
    return (
      <ArticleList data={articlePool} loadMore={this.loadMore} hasMore={hasMore} />
      // <div>
      //   nihao;
      //     </div>

      // <List
      //   size="large"
      //   className={styles.articleList}
      //   rowKey="id"
      //   itemLayout="vertical"
      //   dataSource={list}
      //   renderItem={item => (
      //     <List.Item
      //       key={item.id}
      //       actions={[
      //         <IconText type="star-o" text={item.star} />,
      //         <IconText type="like-o" text={item.like} />,
      //         <IconText type="message" text={item.message} />,
      //       ]}
      //     >
      //       <List.Item.Meta
      //         title={
      //           <a className={styles.listItemMetaTitle} href={item.href}>
      //             {item.title}
      //           </a>
      //         }
      //         description={
      //           <span>
      //             <Tag>Ant Design</Tag>
      //             <Tag>设计语言</Tag>
      //             <Tag>蚂蚁金服</Tag>
      //           </span>
      //         }
      //       />
      //       <ArticleListContent data={item} />
      //     </List.Item>
      //   )}
      // />
    );
  }
}

export default Center1;
