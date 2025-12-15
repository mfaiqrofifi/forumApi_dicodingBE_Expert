const DetailComment = require('../../comments/entities/DetailComment');
const EntityValidator = require('../../shared/EntityValidator');

class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments.map((comment) => new DetailComment(comment));
  }

  _verifyPayload(payload) {
    const requiredKeys = [
      'id',
      'title',
      'body',
      'date',
      'username',
      'comments',
    ];
    EntityValidator.verifyRequiredProperties(
      payload,
      requiredKeys,
      'DETAIL_THREAD'
    );

    const isDateValid =
      typeof payload.date === 'string' || payload.date instanceof Date;
    const typeSpec = {
      id: (val) => typeof val === 'string',
      title: (val) => typeof val === 'string',
      body: (val) => typeof val === 'string',
      date: (val) => isDateValid,
      username: (val) => typeof val === 'string',
      comments: (val) => Array.isArray(val),
    };
    EntityValidator.verifyDataTypes(payload, typeSpec, 'DETAIL_THREAD');
  }
}

module.exports = DetailThread;
