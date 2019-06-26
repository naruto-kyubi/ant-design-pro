import React, { PureComponent } from 'react';
import { Comment as AntComment, Tooltip, Icon } from 'antd';
import Reply from './Reply';
import { formatDate } from '@/utils/utils';

class Comment extends PureComponent {
  state = {
    isReplying: false,
    commentTxt: '',
    submitting: false,
  };

  handleChange = commentTxt => {
    this.setState({
      commentTxt,
    });
  };

  /*
  handleSubmit = () => {
    const { commentTxt } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(commentTxt);
  }; */

  handleSubmit = () => {
    const { commentTxt } = this.state;
    const { handleComment, comment, parent } = this.props;
    const replyto = comment.id;

    handleComment(replyto, parent, commentTxt);
  };

  like = () => {
    const { handleLike, comment } = this.props;
    handleLike(comment);
  };

  dislike = () => {
    const { handleDisLike, comment } = this.props;
    handleDisLike(comment);
  };

  replyto = () => {
    const { isReplying } = this.state;
    this.setState({ isReplying: !isReplying });
  };

  render() {
    const { comment, children, avatar } = this.props;
    const { isReplying, commentTxt, submitting } = this.state;

    const actions = [
      <span>
        <Tooltip title="Like">
          <Icon
            type="like"
            // theme={action === 'liked' ? 'filled' : 'outlined'}
            onClick={this.like}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{20}</span>
      </span>,
      <span>
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            // theme={action === 'disliked' ? 'filled' : 'outlined'}
            onClick={this.dislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{30}</span>
      </span>,
      <span>
        <Tooltip title="Reply to">
          <Icon
            type="message"
            // theme={action === 'disliked' ? 'filled' : 'outlined'}
            onClick={this.replyto}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>reply to</span>
      </span>,
    ];

    const { content, userId, updatedAt } = comment;
    const { nickname, avatar: author } = userId;
    const commentProps = {
      content,
      datetime: formatDate(updatedAt),
      author: nickname,
      avatar: author,
      actions,
    };

    return (
      <div>
        <AntComment {...commentProps}>
          {isReplying ? (
            <Reply
              avatar={avatar}
              submitting={submitting}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              value={commentTxt}
            />
          ) : null}
          {children}
        </AntComment>
      </div>
    );
  }
}

export default Comment;
