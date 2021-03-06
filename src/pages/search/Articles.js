import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import ArticleList from '@/pages/articles/components/ArticleList';

@connect(({ article }) => ({
  article,
}))
class ArticleSearch extends PureComponent {
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
      article: {
        articleList: { meta },
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
      sorter: 'updatedAt_desc',
      current,
    };
    // if (catalog !== 'recommand') {
    //   payload = { ...payload, catalogId_equal: catalog };
    // }
    dispatch({
      type: 'article/fetchSearchList',
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
    const { articleList } = article;
    if (!articleList) return null;

    const { data } = articleList;

    const hasMore = this.hasMore();

    return (
      // <GridContent>
      //   <div>
      //     <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
      //       <Menu.Item key="article">文章</Menu.Item>
      //       <Menu.Item key="recommand">关注</Menu.Item>
      //       <Menu.Item key="other">...</Menu.Item>
      //     </Menu>
      //   </div>
      //   <Row gutter={24}>
      //     <Col lg={24} md={24}>
      <ArticleList data={data} loadMore={this.loadMore} hasMore={hasMore} />
      //     </Col>
      //   </Row>
      // </GridContent>
    );
  }
}

export default ArticleSearch;
