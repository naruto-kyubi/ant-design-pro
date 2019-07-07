import React, { PureComponent } from 'react';
import { Row, Col, Menu } from 'antd';
import { connect } from 'dva';
// import router from 'umi/router';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ArticleList from '@/pages/articles/components/ArticleList';

@connect(({ article }) => ({
  article,
}))
class SearchLists extends PureComponent {
  state = {
    current: 'article',
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
    let currentPage = meta ? meta.pagination.current + 1 : 1;
    currentPage = resetPool ? 1 : currentPage;
    const payload = {
      keyword: kw,
      sorter: 'updatedAt_desc',
      currentPage,
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
    const { articlePool } = article;
    const hasMore = this.hasMore();

    const { current } = this.state;
    return (
      <GridContent>
        <div>
          <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="article">文章</Menu.Item>
            <Menu.Item key="recommand">关注</Menu.Item>
            <Menu.Item key="other">...</Menu.Item>
          </Menu>
        </div>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <ArticleList data={articlePool} loadMore={this.loadMore} hasMore={hasMore} />
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default SearchLists;
