const NewReply = require('../../Domains/replies/entities/NewReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ content, threadId, commentId, owner }) {
    const newReply = new NewReply({ content });

    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    const addedReply = await this._replyRepository.addReply(
      newReply,
      commentId,
      owner
    );

    return new AddedReply(addedReply);
  }
}

module.exports = AddReplyUseCase;
