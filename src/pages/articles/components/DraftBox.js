import React, { PureComponent } from 'react';
import { Button, Drawer, Icon, List } from 'antd';
import { formatDate } from '@/utils/utils';

import styles from './DraftBox.less';

class DraftBox extends PureComponent {
  state = { visible: false };

  showDrawer = () => {
    const { getDraftList } = this.props;
    getDraftList();
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const { draftList, getDraftArticle } = this.props;

    return (
      <span>
        <Button className={styles.draftBox} onClick={this.showDrawer}>
          {`草稿箱 ( ${draftList.data ? draftList.meta.pagination.total : 0} )`}{' '}
          <Icon type="down" />
        </Button>
        <Drawer
          title="草稿箱"
          placement="right"
          closable
          width={540}
          onClose={this.onClose}
          visible={visible}
        >
          <List
            size="large"
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            bordered={false}
            dataSource={draftList.data || []}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <a
                      className={styles.listItemMetaTitle}
                      onClick={() => getDraftArticle(item.id)}
                      rel="noopener noreferrer"
                    >
                      {item.title ? item.title : '无标题'}
                    </a>
                  }
                  description={<span>{`更新时间 ${formatDate(item.updatedAt)}`}</span>}
                />
              </List.Item>
            )}
          />
        </Drawer>
      </span>
    );
  }
}

export default DraftBox;
