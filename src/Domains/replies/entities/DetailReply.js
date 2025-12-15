const EntityValidator = require('../../shared/EntityValidator');

const DELETED_REPLY_MESSAGE = '**balasan telah dihapus**';

class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, content, is_delete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? DELETED_REPLY_MESSAGE : content;
  }

  _verifyPayload(payload) {
    const requiredKeys = ['id', 'username', 'date', 'content', 'is_delete'];
    EntityValidator.verifyRequiredProperties(
      payload,
      requiredKeys,
      'DETAIL_REPLY'
    );

    const isDateValid =
      typeof payload.date === 'string' || payload.date instanceof Date;
    const typeSpec = {
      id: (val) => typeof val === 'string',
      username: (val) => typeof val === 'string',
      date: (val) => isDateValid,
      content: (val) => typeof val === 'string',
      is_delete: (val) => typeof val === 'boolean',
    };
    EntityValidator.verifyDataTypes(payload, typeSpec, 'DETAIL_REPLY');
  }
}

module.exports = DetailReply;
