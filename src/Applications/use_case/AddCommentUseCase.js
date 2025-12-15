const NewComment = require('../../Domains/comments/entities/NewComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ content, threadId, owner }) {
    const newComment = new NewComment({ content });

    await this._threadRepository.verifyThreadExists(threadId);

    const addedComment = await this._commentRepository.addComment(
      newComment,
      threadId,
      owner
    );

    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
