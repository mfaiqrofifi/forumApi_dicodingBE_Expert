const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const toggleLikeCommentUseCase = this._container.getInstance(
      ToggleLikeCommentUseCase.name
    );

    await toggleLikeCommentUseCase.execute({
      threadId,
      commentId,
      userId,
    });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = LikesHandler;
