import React, { Component } from 'react';
import router from 'umi/router';
import { Card, Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Search.less';

class Search extends Component {
  onTabChange = key => {
    const { match, location } = this.props;
    const {
      query: { keyword },
    } = location;

    switch (key) {
      case 'all':
        router.push(`${match.url}/all?keyword=${keyword}`);
        break;
      case 'articles':
        router.push(`${match.url}/articles?keyword=${keyword}`);
        break;
      case 'users':
        router.push(`${match.url}/users?keyword=${keyword}`);
        break;

      default:
        break;
    }
  };

  render() {
    const { match, location, children } = this.props;

    const operationTabList = [
      {
        key: 'all',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>综合</span>
          </span>
        ),
      },
      {
        key: 'articles',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>文章</span>
          </span>
        ),
      },
      {
        key: 'users',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>用户</span>
          </span>
        ),
      },
      // {
      //   key: 'follows',
      //   tab: (
      //     <span>
      //       <span style={{ fontSize: 14 }}>关注了{followCount > 0 ? `(${followCount})` : ''}</span>
      //     </span>
      //   ),
      // },
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              // loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Search;
