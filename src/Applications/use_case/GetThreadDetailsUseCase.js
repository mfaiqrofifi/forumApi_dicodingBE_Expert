const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        );
        return { ...comment, replies };
      })
    );

    const detailThread = new DetailThread({
      ...thread,
      comments: commentsWithReplies,
    });

    return detailThread;
  }
}

module.exports = GetThreadDetailsUseCase;
