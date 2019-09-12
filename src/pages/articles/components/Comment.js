import React, { PureComponent } from 'react';
import { Comment as AntComment, Tooltip, Icon, Avatar } from 'antd';
import BraftEditor from 'braft-editor';
import Reply from './Reply';
import { formatDate } from '@/utils/utils';

class Comment extends PureComponent {
  state = {
    isReplying: false,
    editorState: BraftEditor.createEditorState(null),
    submitting: false,
  };

  handleChange = editorState => {
    this.setState({
      editorState,
    });
  };

  handleSubmit = () => {
    const { editorState } = this.state;
    const { handleComment, comment, parent } = this.props;
    const replyto = comment.id;

    handleComment(replyto, parent, editorState.toRAW(), editorState.toHTML());
    this.setState({ isReplying: false });
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
    const { isReplying, editorState, submitting } = this.state;

    const actions = [
      <span onClick={this.like}>
        <Tooltip title="Like">
          <Icon
            type="like"
            // theme={action === 'liked' ? 'filled' : 'outlined'}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{20}</span>
      </span>,
      <span onClick={this.replyto}>
        <Tooltip title="Reply to">
          <Icon
            type="message"
            // theme={action === 'disliked' ? 'filled' : 'outlined'}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>回复</span>
      </span>,
    ];

    const { contentHtml, userId, updatedAt } = comment;
    const { nickname, avatar: author } = userId;
    const commentProps = {
      content: <div dangerouslySetInnerHTML={{ __html: contentHtml }} />,
      datetime: formatDate(updatedAt),
      author: nickname,
      avatar: <Avatar src={author} icon="user" />,
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
              value={editorState}
            />
          ) : null}
          {children}
        </AntComment>
      </div>
    );
  }
}

export default Comment;
