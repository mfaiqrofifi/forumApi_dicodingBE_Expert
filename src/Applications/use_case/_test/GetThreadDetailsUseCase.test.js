const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrate get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: new Date('2021-08-08T07:22:33.555Z'),
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: new Date('2021-08-08T07:26:21.338Z'),
        content: 'komentar dihapus',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        username: 'johndoe',
        date: new Date('2021-08-08T07:30:00.000Z'),
        content: 'sebuah balasan',
        is_delete: false,
      },
      {
        id: 'reply-2',
        username: 'dicoding',
        date: new Date('2021-08-08T07:31:00.000Z'),
        content: 'balasan dihapus',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockResolvedValueOnce(mockReplies)
      .mockResolvedValueOnce([]);
    mockLikeRepository.getLikeCountByCommentId = jest
      .fn()
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await getThreadDetailsUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      threadId
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledTimes(2);

    expect(result.id).toEqual(mockThread.id);
    expect(result.title).toEqual(mockThread.title);
    expect(result.body).toEqual(mockThread.body);
    expect(result.username).toEqual(mockThread.username);
    expect(result.date).toEqual(mockThread.date);

    expect(result.comments).toHaveLength(2);
    expect(result.comments[0].content).toEqual('sebuah comment');
    expect(result.comments[0].likeCount).toEqual(2);
    expect(result.comments[0].replies).toHaveLength(2);
    expect(result.comments[0].replies[0].content).toEqual('sebuah balasan');
    expect(result.comments[0].replies[1].content).toEqual(
      '**balasan telah dihapus**'
    );
    expect(result.comments[1].content).toEqual('**komentar telah dihapus**');
    expect(result.comments[1].likeCount).toEqual(1);
    expect(result.comments[1].replies).toHaveLength(0);
  });

  it('should handle thread not found', async () => {
    // Arrange
    const threadId = 'thread-xxx';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
    const notFoundError = new NotFoundError('thread tidak ditemukan');

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockRejectedValue(notFoundError);

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(getThreadDetailsUseCase.execute(threadId)).rejects.toThrow(
      'thread tidak ditemukan'
    );
  });

  it('should return thread with empty comments array when no comments', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockResolvedValue([]);

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await getThreadDetailsUseCase.execute(threadId);

    // Assert
    expect(result.comments).toHaveLength(0);
    expect(Array.isArray(result.comments)).toBe(true);
  });

  it('should handle comments with replies correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: new Date('2021-08-08T07:22:33.555Z'),
        content: 'sebuah comment',
        is_delete: false,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        username: 'johndoe',
        date: new Date('2021-08-08T07:30:00.000Z'),
        content: 'sebuah balasan',
        is_delete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockResolvedValue(mockReplies);
    mockLikeRepository.getLikeCountByCommentId = jest.fn().mockResolvedValue(3);

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await getThreadDetailsUseCase.execute(threadId);

    // Assert
    expect(result.comments[0].replies).toHaveLength(1);
    expect(result.comments[0].replies[0].id).toEqual('reply-1');
    expect(result.comments[0].replies[0].username).toEqual('johndoe');
    expect(result.comments[0].replies[0].content).toEqual('sebuah balasan');
    expect(result.comments[0].likeCount).toEqual(3);
  });
});
