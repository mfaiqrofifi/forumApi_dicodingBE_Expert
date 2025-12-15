const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockResolvedValue();
    mockReplyRepository.verifyReplyAvailability = jest.fn().mockResolvedValue();
    mockReplyRepository.verifyReplyOwner = jest.fn().mockResolvedValue();
    mockReplyRepository.deleteReply = jest.fn().mockResolvedValue();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(
      'thread-123'
    );
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      'comment-123'
    );
    expect(mockReplyRepository.verifyReplyAvailability).toBeCalledWith(
      'reply-123'
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      'reply-123',
      'user-123'
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith('reply-123');
  });
});
