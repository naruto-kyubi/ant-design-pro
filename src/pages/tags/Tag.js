import React, { Component } from 'react';
import router from 'umi/router';
import { Card, Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Tag.less';

class Tag extends Component {
  onTabChange = key => {
    const { match } = this.props;

    switch (key) {
      case 'all':
        router.push(`${match.url}/all`);
        break;
      case 'subscribed':
        router.push(`${match.url}/subscribed`);
        break;

      default:
        break;
    }
  };

  render() {
    const { match, location, children } = this.props;

    const operationTabList = [
      {
        key: 'subscribed',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>已关注标签</span>
          </span>
        ),
      },
      {
        key: 'all',
        tab: (
          <span>
            <span style={{ fontSize: 14 }}>全部标签</span>
          </span>
        ),
      },
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

export default Tag;
