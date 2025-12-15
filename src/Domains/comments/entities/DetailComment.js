const DetailReply = require('../../replies/entities/DetailReply');
const EntityValidator = require('../../shared/EntityValidator');

const DELETED_COMMENT_MESSAGE = '**komentar telah dihapus**';

class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, content, is_delete, replies } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? DELETED_COMMENT_MESSAGE : content;
    this.replies = replies.map((reply) => new DetailReply(reply));
  }

  _verifyPayload(payload) {
    const requiredKeys = [
      'id',
      'username',
      'date',
      'content',
      'is_delete',
      'replies',
    ];
    EntityValidator.verifyRequiredProperties(
      payload,
      requiredKeys,
      'DETAIL_COMMENT'
    );

    const isDateValid =
      typeof payload.date === 'string' || payload.date instanceof Date;
    const typeSpec = {
      id: (val) => typeof val === 'string',
      username: (val) => typeof val === 'string',
      date: (val) => isDateValid,
      content: (val) => typeof val === 'string',
      is_delete: (val) => typeof val === 'boolean',
      replies: (val) => Array.isArray(val),
    };
    EntityValidator.verifyDataTypes(payload, typeSpec, 'DETAIL_COMMENT');
  }
}

module.exports = DetailComment;
