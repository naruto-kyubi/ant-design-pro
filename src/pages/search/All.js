import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List, Tag, Skeleton, Avatar, Icon } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import ArticleListContent from '@/components/ArticleListContent';

import FollowButton from '@/pages/articles/components/FollowButton';
import styles from './All.less';

@connect(({ search }) => ({
  search,
}))
class SearchAll extends PureComponent {
  state = {
    keyword: '',
  };

  componentDidMount() {
    const {
      location: {
        query: { keyword },
      },
    } = this.props;
    this.setState({
      keyword,
    });
    this.queryArticles(true, keyword);
  }

  componentWillReceiveProps(nextProps) {
    //   const { history:{ query:{keyword}},location:{query:{ keyword:key2}}} = nextProps;
    //   if(keyword===key2) return null;
    const {
      location: {
        query: { keyword },
      },
    } = nextProps;
    const { keyword: k1 } = this.state;
    this.setState({
      keyword,
    });
    if (keyword !== k1) {
      this.queryArticles(true, keyword);
    }
  }

  handleClick = e => {
    console.log(e);
    // this.setState({ catalog: e.key }, () => {
    //   this.queryArticles(true);
    // });
  };

  loadMore = () => {
    this.queryArticles();
  };

  queryArticles = (resetPool, keyword) => {
    const {
      dispatch,
      search: {
        searchs: { meta },
      },
    } = this.props;

    let kw = keyword;
    if (!kw) {
      const { keyword: k1 } = this.state;
      kw = k1;
    }
    // const { keyword } = this.state;
    // const { catalog } = this.state;
    let current = meta ? meta.pagination.current + 1 : 1;
    current = resetPool ? 1 : current;
    const payload = {
      keyword: kw,
      // sorter: 'updatedAt_desc',
      current,
    };
    // if (catalog !== 'recommand') {
    //   payload = { ...payload, catalogId_equal: catalog };
    // }
    dispatch({
      type: 'search/searchall',
      payload,
    });
  };

  hasMore = () => {
    const {
      search: {
        searchs: { meta },
      },
    } = this.props;
    return meta
      ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total
      : false;
  };

  onFollowClick = (follow, item) => {
    const { dispatch } = this.props;
    const { id } = item;
    switch (follow) {
      case 'both':
      case 'follow':
        // 取消关注；
        dispatch({
          type: 'follow/deleteFollows',
          payload: {
            id,
          },
        });
        break;
      case null:
      case 'none':
        // 新增关注；
        dispatch({
          type: 'follow/addFollows',
          payload: {
            followUser: id,
          },
        });
        break;
      default:
    }
  };

  getContent = article => {
    const { contentHtml, owner, updatedAt } = article;
    const { nickname, avatar } = owner;

    return {
      // content: `${JSON.parse(JSON.stringify(contentHtml).replace(/<\/?.+?\/?>/g, '')).substring(
      //   0,
      //   200
      // )}...`,
      content: <div className={styles.content} dangerouslySetInnerHTML={{ __html: contentHtml }} />,
      updatedAt,
      owner: nickname,
      avatar,
    };
  };

  renderItem = item => {
    const { _type } = item;

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    switch (_type) {
      case 'article':
        return (
          <List.Item
            key={item.id}
            actions={[
              <IconText type="star-o" text={item.starCount} />,
              <IconText type="like-o" text={item.likeCount} />,
              <IconText type="message" text={item.commentCount} />,
              <IconText type="read" text={item.viewCount} />,
            ]}
          >
            <List.Item.Meta
              title={
                <a
                  className={styles.listItemMetaTitle}
                  href={`/articles/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {<div dangerouslySetInnerHTML={{ __html: item.title }} />}
                </a>
              }
              description={
                <span>
                  {item.tags && item.tags.map(tag => <Tag color={tag.color}>{tag.name}</Tag>)}
                </span>
              }
            />
            <ArticleListContent data={this.getContent(item)} />
          </List.Item>
        );
      case 'user':
        return (
          <List.Item
            // actions={[
            //   <FollowButton data={item} follow={item.mutual} onFollowClick={ this.onFollowClick } />,
            // ]}
            extra={
              <FollowButton data={item} follow={item.mutual} onFollowClick={this.onFollowClick} />
            }
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                  <a href="https://ant.design">
                    <div dangerouslySetInnerHTML={{ __html: item.nickname }} />
                  </a>
                }
                description={<div dangerouslySetInnerHTML={{ __html: item.profile }} />}
              />
            </Skeleton>
          </List.Item>
        );
      default:
        return null;
    }
  };

  render() {
    const { search } = this.props;
    const {
      searchs: { data },
    } = search;
    const hasMore = this.hasMore();

    return (
      <Card className={styles.tabsCard} bordered={false}>
        <InfiniteScroll
          pageStart={1}
          loadMore={this.loadMore}
          hasMore={hasMore}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          <List
            size="large"
            // className={styles.articleList}
            rowKey="id"
            itemLayout="vertical"
            // itemLayout="horizontal"
            dataSource={data}
            renderItem={item => this.renderItem(item)}
          />
        </InfiniteScroll>
      </Card>
    );
  }
}

export default SearchAll;
