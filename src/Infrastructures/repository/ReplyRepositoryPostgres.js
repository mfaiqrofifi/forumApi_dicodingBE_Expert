const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies (id, comment_id, owner, content) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, owner, content],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
        SELECT r.id,
               u.username,
               r.date,
               r.content,
               r.is_delete
        FROM replies r
        JOIN users u ON u.id = r.owner
        WHERE r.comment_id = $1
        ORDER BY r.date ASC
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyReplyAvailability(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    const { owner: replyOwner } = result.rows[0];

    if (replyOwner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
